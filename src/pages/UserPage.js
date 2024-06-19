import FitterNavbar from '../components/FitterNavbar';
import { useState, useEffect } from 'react';
import { Card, CardGroup, Row, Col ,Image} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getData } from '../features/apiService';
import EventCard from '../components/EventCard';
import GroupCard from '../components/GroupCard';

const UserPage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);
    let { id } = useParams();
    const default_group_img = 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png';


    useEffect(() => {
        const fetchUser = async () => {
            if (!activeUser) return;

            // Fetch user data
            const userData = await getData(`${serverUrl}users/${id}/`);
            if (userData) {
                setUser(userData);
            }
        };

        fetchUser();
    }, [activeUser, id, serverUrl]);

    useEffect(() => {
        if (!user) return;

        const fetchGroupsAndEvents = async () => {
            // Fetch groups data
            const groupsData = await getData(`${serverUrl}users/get_user_groups/?email=${user.email}`);
            if (groupsData) {
                setGroups(groupsData);
            }

            // Fetch events data
            const eventsData = await getData(`${serverUrl}users/get_user_future_events/?email=${user.email}`);
            if (eventsData) {
                setEvents(eventsData);
            }
        };

        fetchGroupsAndEvents();
    }, [user, id, serverUrl]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Row style={{ marginTop: "3em" }}>
                <Col xs="1"></Col>
                <Col xs="8">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                                    <Card.Text>Email : {user.email}</Card.Text>
                                    <Card.Text>Birth of date {user.date_of_birth}</Card.Text>
                                    <Card.Text>Gender : {user.gender}</Card.Text>
                                </Col>
                                {/* <Col>
                                    <Card.Img src={"../icons/rating-5-stars.png"} />
                                </Col> */}
                                <Col>
                                    <Card.Img src={user.profile_picture} height={250} width={50} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="1"></Col>
                {/* <Col xs="2">
                    <Image width={50} height={50} src="../icons/settings.png" />
                </Col> */}
            </Row>
            {user.email === activeUser.email ? (
                <>
                    <h2 style={{ marginLeft: "2em", marginTop: "2em" }}>Groups</h2>
                    <CardGroup
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        {groups.map((group, index) => (
                            <GroupCard key={index} group={group} />
                        ))}
                    </CardGroup>
                    <h2 style={{ marginLeft: "2em", marginTop: "2em" }}>Upcoming Events</h2>
                    <CardGroup
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        {events.map((event, index) => (
                            <EventCard key={index} event={event} />
                        ))}
                    </CardGroup>
                </>
            ) : (
                <>
                    <h2 style={{ marginLeft: "2em", marginTop: "2em" }}>User's Groups</h2>
                    <CardGroup
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        {groups.map((group) => (
                            <Card key={group.id}>
                                <Link to={`../groups/${group.id}`}>
                                    <Card.Img variant="top" src={group.profile_picture ?? default_group_img} />
                                    <Card.Body>
                                        <Card.Title>{group.name}</Card.Title>

                                    </Card.Body>
                                </Link>
                                <Card.Text>{group.description}</Card.Text>
                            </Card>
                        ))}
                    </CardGroup>

                    <h2 style={{ marginLeft: "2em", marginTop: "2em" }}>User's upcoming Events</h2>
                    <CardGroup
                        style={{
                            width: "70%",
                            marginInline: "auto",
                            marginTop: "4rem",
                        }}
                    >
                        {events.map((event) => (
                            <Card key={event.id}>
                                <Link to={`../events/${event.id}`}>
                                    <Card.Img variant="top" src={event.image} />
                                    <Card.Body>
                                        <Card.Title>{event.title}</Card.Title>

                                    </Card.Body>
                                </Link>
                                <Card.Text>{event.description}</Card.Text>
                            </Card>
                        ))}
                    </CardGroup>
                </>
            )}
        </div>
    );
};

export default UserPage;
