import { useState, useEffect } from 'react';
import { Col, Row, Image, Container, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserCard from '../components/UserCard';
import { getData, postData } from '../features/apiService';
import EventCard3 from '../components/EventCard3';
import LinearProgress from '@mui/material/LinearProgress';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RootDialog from '../components/RootDialog';
import { useDispatch } from 'react-redux';
import { setGroupId, showModal } from '../features/modal';
import PageTitle from '../components/PageTitle';


const GroupPage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [admin, setAdmin] = useState(null);
    const dispatch = useDispatch();
    let { id } = useParams();

    const fetchGroupAndMembers = async () => {

        // Fetch group data
        let adminId = null;
        const groupData = await getData(`${serverUrl}groups/${id}/`);
        if (groupData) {
            setGroup(groupData);
            adminId = groupData.admin;
        }

        // Fetch members data
        const membersData = await getData(`${serverUrl}groups/${id}/get_group_members/`);
        if (membersData) {
            setMembers(membersData);
        }

        if (adminId) {
            const adminData = await getData(`${serverUrl}users/${adminId}/`);
        if (adminData) {
            setAdmin(adminData);
        }
    }

        // Fetch events data
        const eventsData = await getData(`${serverUrl}groups/${id}/get_group_events/`);
        if (eventsData) {
            setEvents(eventsData);
        }
    };

    useEffect(() => {
       
        fetchGroupAndMembers();
    }, []);

    const createEvent = () => {
        dispatch(setGroupId({ groupId: id }));
        dispatch(showModal());
    };

    let profile_picture = group?.profile_picture || "/icons/group.png";
    
    const removeUser = async (userId) => {
        
        const url =`${serverUrl}groups/${id}/remove_user/`;
        let userToRemove = {
            user_id: userId
        };
        let response = await postData(url, userToRemove);
        if (response) {
            fetchGroupAndMembers();
        } else {    
            console.error('Error removing user:', response);
        }   

    };

    return (
        <div>
            {!group ? (
                <LinearProgress />
            ) : (
                <div className="pages">
                    <PageTitle title={`Fitter - Group - ${group.name}`} />
                    <Container fluid="md">
                        {
                            activeUser && group.admin === activeUser.id &&
                            <Row>
                                <Col lg={8} md={8} sm={8} xs="8"></Col>
                                <Col lg={1} md={1} sm={2} xs="2">
                                    <a href="#">
                                        <Image src="/icons/add.png" width="40" height="40" className="d-inline-block align-top" alt="add" rounded
                                            onClick={createEvent} />
                                    </a>
                                    <Col> <RootDialog hideButton={true} /></Col>
                                </Col>
                                <Col lg={3} md={3} sm={2} xs="2">
                                    <Link to={`/edit-group/${group.id}/`}>
                                        <Image width={40} height={40} src="/icons/settings.png" />
                                    </Link>
                                </Col>
                            </Row>
                        }
                        <Row className="mb-4">
                            <Col md={6}>
                                <Image src={profile_picture} alt="Event Banner" fluid />
                            </Col>
                            <Col md={6}>
                                <h1>{group.name}</h1>
                                <h2>{group.location}</h2>
                                <h2>{`Gender: ${group.gender}`}</h2>
                                <h2>{`Ages: ${group.min_age ? group.min_age : "0"} - ${group.max_age ? group.max_age : "120"}`}</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3>Description</h3>
                                <p>{group.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h4>Preferred Sports: </h4>
                                   <div style={{textWrap:"wrap", whiteSpace:"wrap"}}>| {group.preferred_sports.map((sport) => (
                                        ` ${sport} | `
                                    ))} </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop:"2rem"}}>
                            <Col>
                                <h4>{`${group.members.length} Members`}</h4>
                            </Col>
                        </Row>
                        {
                            admin &&
                        <Row style={{marginTop:"2rem"}}>
                            <Col lg={1} md={2} sm={2} xs={3}>
                                <h4 >Admin: </h4>
                               
                            </Col>
                            <Col>
                            <UserCard user={admin} />
                            </Col>

                        </Row>
}
                        {events.length > 0 &&
                            <>
                                <h1
                                    style={{
                                        marginInline: "auto",
                                        marginTop: "4rem",
                                    }}
                                >
                                    Group's upcoming Events
                                </h1>
                                <Row
                                    style={{
                                        marginInline: "auto",
                                        marginTop: "4rem",
                                        marginLeft: "2rem",
                                    }}
                                >
                                    {events.map((event) => (
                                        <EventCard3 key={event.id} event={event} />
                                    ))}
                                </Row>
                            </>
                        }

                        <h1
                            style={{
                                marginInline: "auto",
                                marginTop: "4rem",
                            }}
                        >
                            Members
                        </h1>


                        <Row
                            style={{
                                marginInline: "auto",
                                marginLeft: "2rem",
                            }}
                        >
                            {members.length > 0 ? (
                                members.map((user, i) => (
                                    <Col lg={3} md={4} sm={6} xs={12}>
                                        <UserCard key={i} user={user} />
                                        {activeUser && group.admin === activeUser.id && user.id !== activeUser.id && (
                                        <Button className='rounded-pill' variant='danger' style={{backgroundColor:"transparent", marginBottom:"4rem"}}
                                        onClick={() => removeUser(user.id)}
                                        >
                                        <RemoveCircleOutlineIcon style={{ color: "red" }} />
                                        </Button>
                                        )}
                                    </Col>
  
                                ))
                            ) : (
                                <p style={{ color: "red" }}>No members found.</p>
                            )}
                        </Row>
                    </Container>
                </div>
            )}
        </div>
    );
}

export default GroupPage;
