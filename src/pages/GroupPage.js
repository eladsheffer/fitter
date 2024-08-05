import FitterNavbar from '../components/FitterNavbar';
import { useState, useEffect } from 'react';
import { Card, Col, Row, Image, CardGroup } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import events from '../data-model/events.json';
// import groups from '../data-model/groups.json';
import { useSelector } from 'react-redux';
import User from '../features/user';
import UserCard from '../components/UserCard';
import { getData, postData } from '../features/apiService';
import EventCard from '../components/EventCard';


const GroupPage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [group, setGroup] = useState(null);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {
        const fetchGroupAndUsers = async () => {
            if (!activeUser) return;

            // Fetch group data
            const groupData = await getData(`${serverUrl}groups/${id}/`);
            if (groupData) {
                setGroup(groupData);
            }

            // Fetch users data
            const usersData = await getData(`${serverUrl}groups/${id}/get_group_members/`);
            if (usersData) {
                setUsers(usersData);
            }

            // Fetch events data
            const eventsData = await getData(`${serverUrl}groups/${id}/get_group_future_events/`);
            if (eventsData) {
                setEvents(eventsData);
            }
        };
        fetchGroupAndUsers();
    }, [activeUser, id, serverUrl]);

    let profile_picture = group?.profile_picture || "https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png";

    return (
        <div> 
            {!group ? (
                <><h1>There is no such group</h1></>
            ) : (
                <>
                    <Row style={{marginTop:"3em"}}>
                        <Col xs="1"></Col>
                        <Col xs="8">
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Card.Title>{group.name}</Card.Title>
                                            <Card.Text>
                                                {group.description}
                                            </Card.Text>
                                        </Col>
                                        <Col>
                                        <Card.Img src={profile_picture} />
                                        </Col>
                                        <Col>
                                            
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs="1"></Col>
                        {
                        activeUser && group.admin === activeUser.id &&
                        <Col xs="2">
                        <Link to={`/edit-group/${group.id}/`}>
                            <Image width={50} height={50} src="/icons/settings.png" />
                        </Link>
                        </Col>
                        }
                    </Row>

                    <h1
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    > 
                        Group's upcoming Events 
                    </h1>
                    <CardGroup
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </CardGroup>

                    <h1
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        Members
                    </h1>
                

                    <CardGroup
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        {users.length > 0 ? (
                            users.map((user, i) => (
                                <UserCard key={i} user={user} />
                            ))
                        ) : (
                            <p style={{color:"red"}}>No members found.</p>
                        )}
                    </CardGroup> 
                </>
            )}
        </div>
    );
}

export default GroupPage;
