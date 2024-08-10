import FitterNavbar from '../components/FitterNavbar';
import { useState, useEffect } from 'react';
import { Card, CardGroup, Row, Col, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getData } from '../features/apiService';
import EventCard2 from '../components/EventCard2';
import GroupCard2 from '../components/GroupCard2';
import EventCard from '../components/EventCard';
import GroupCard from '../components/GroupCard';
import LinearProgress from '@mui/material/LinearProgress';

const UserPage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState("/icons/user.png");
    const [groups, setGroups] = useState(null);
    const [events, setEvents] = useState(null);
    let { id } = useParams();
    const default_group_img = 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png';


    useEffect(() => {
        const fetchUser = async () => {
            if (!activeUser) return;

            // Fetch user data
            const userData = await getData(`${serverUrl}users/${id}/`);
            if (userData) {
                setUser(userData);
                if (userData.profile_picture) {
                    setProfilePicture(userData.profile_picture);
                }
            }
        };

        fetchUser();
    }, [activeUser, id, serverUrl, profilePicture]);

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
        <div style={{ width: "95%", marginInline: "auto", marginTop: "4rem" }}>
            <Row style={{ marginTop: "3em" }}>
                <Col xs="1"></Col>
                <Col xs="4">
                    <Card>
                        <Card.Body>
                            <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                            <Card.Text>Email : {user.email}</Card.Text>
                            <Card.Text>Date of Birth: {user.date_of_birth}</Card.Text>
                            <Card.Text>Gender : {user.gender}</Card.Text>
                            <Card.Text>Location : {user.location}</Card.Text>
                            <Card.Img src={profilePicture} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="6"></Col>
                {activeUser && activeUser.email === user.email &&
                <Col xs="1">
                    <Link to={`/edit-profile/`}>
                        <Image src="/icons/settings.png" style={{ width: "3em", height: "3em" }} />
                    </Link>
                </Col>
}
            </Row>
            {!groups && !events ? <LinearProgress /> : null}
            {!groups || groups.length === 0 ? null : <>
                {/* <h1
                    style={{
                        marginTop: "4rem",
                    }}
                >
                    {user.first_name} {user.last_name}'s Groups
                </h1>
                <Row
                    style={{
                        marginInline: "auto",
                    }}
                >
                    {groups.map((group, i) => (
                        <Col lg={4} md={6} sm={12}>
                            <GroupCard2 group={group} key={i} />
                        </Col>
                    ))}
                </Row> */}
                <h2 style={{ marginLeft: "2em", marginTop: "2em" }}> {user.first_name} {user.last_name}'s Groups</h2>
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
            </>}

            {!events || events.length === 0 ? null : <>
                {/* <h1
                    style={{
                        marginTop: "4rem",
                    }}
                >
                    {user.first_name} {user.last_name}'s Upcoming Events
                </h1>
                <Row
                    style={{
                        marginInline: "auto",
                    }}
                >
                    {events.map((event, i) => (
                        <Col lg={4} md={6} sm={12}>
                            <EventCard2 event={event} key={i} />
                        </Col>
                    ))}
                </Row> */}
                
                    <h2 style={{ marginLeft: "2em", marginTop: "2em" }}>{user.first_name} {user.last_name}'s Upcoming Events</h2>
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
            </>}
        </div>
    );
};

export default UserPage;
