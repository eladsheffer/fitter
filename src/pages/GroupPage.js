import FitterNavbar from '../components/FitterNavbar';
import { useState, useEffect } from 'react';
import { Card, Col, Row, Image, CardGroup, Container } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import events from '../data-model/events.json';
// import groups from '../data-model/groups.json';
import { useSelector } from 'react-redux';
import User from '../features/user';
import UserCard from '../components/UserCard';
import { getData, postData } from '../features/apiService';
import EventCard from '../components/EventCard';
import LinearProgress from '@mui/material/LinearProgress';


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
                <LinearProgress style={{ marginTop: "4rem" }} />
            ) : (
                <div style={{ width: "80%", margin: "4rem auto" }}>
                    <Container fluid="md">
                        <Row className="mb-4">
                            <Col md={6}>
                                <Image src={profile_picture} alt="Event Banner" fluid />
                            </Col>
                            <Col md={5}>
                                <h1>{group.name}</h1>
                                <h2>{group.location}</h2>
                                <h3>Preferred Sports:</h3>
                                {group.preferred_sports.map((sport) => (
                                    <h3>{sport}</h3>
                                ))}
                            </Col>
                            {
                                activeUser && group.admin === activeUser.id &&
                                <Col xs="1">
                                    <Link to={`/edit-group/${group.id}/`}>
                                        <Image width={50} height={50} src="/icons/settings.png" />
                                    </Link>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <h3>Description</h3>
                                <p>{group.description}</p>
                            </Col>
                        </Row>
                        {/* <Row style={{ marginTop: "3em" }}>
                        <Col xs="1"></Col>
                        <Col xs="8">
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col lg="6" xs="12" className="text-nowrap text-truncate">
                                            <Card.Title>{group.name}</Card.Title>
                                            <Card.Text>
                                                {group.description}
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                    <Row className='justify-content-end'>
                                        <Col lg="6" xs="12">
                                        <Card.Img src={profile_picture} />
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
                    </Row> */}
                        {events.length > 0 &&
                            <>
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
                            </>
                        }

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
                                    <Col lg={4} md={6} sm={12}>
                                        <UserCard key={i} user={user} />
                                    </Col>
                                ))
                            ) : (
                                <p style={{ color: "red" }}>No members found.</p>
                            )}
                        </CardGroup>
                    </Container>
                </div>
            )}
        </div>
    );
}

export default GroupPage;
