import FitterNavbar from '../components/FitterNavbar';
import { useState, useEffect } from 'react';
import { Card, CardGroup, Row, Col, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getData } from '../features/apiService';
import EventCard3 from '../components/EventCard3';
import GroupCard3 from '../components/GroupCard3';
import LinearProgress from '@mui/material/LinearProgress';

const UserPage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState("/icons/user.png");
    const [groups, setGroups] = useState(null);
    const [events, setEvents] = useState(null);
    let { id } = useParams();

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

    const ageCalc = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    if (!user) {
        return <LinearProgress />;
    }

    return (
        <div style={{ width: "95%", marginInline: "auto", marginTop: "4rem" }}>
            <Row style={{ marginTop: "3em" }}>
                <Col xs="1"></Col>
                <Col lg={4} md={6} sm={8} xs="8">

                    <Image src={profilePicture} style={{ width: "10em", height: "10em" }} roundedCircle />
                    <h1>{user.first_name} {user.last_name}</h1>
                    <h5>Age: {ageCalc(user.date_of_birth)}</h5>
                    {user.height && <h5>Height: {user.height} cm.</h5>}
                    {user.weight && <h5>Weight: {user.weight} kg.</h5>}
                    <h5>
                        <Link to={`mailto:${user.email}`}>
                            {user.email}
                        </Link>
                    </h5>
                    {user.location && <h5>Location: {user.location}</h5>}
                    {user.bio && <h5>Bio: {user.bio}</h5>}
                    {user.preferred_sports && user.preferred_sports.length > 0 &&
                        <>
                            <h5>Preferred Sport: | {user.preferred_sports.map(
                                (sport) => (
                                    ` ${sport} | `
                                )
                            )}</h5>
                        </>}

                </Col>
                <Col lg={5} md={3} sm={1} xs="1"></Col>
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
                <h1
                    style={{
                        marginTop: "4rem",
                    }}
                >
                    {user.first_name} {user.last_name}'s Groups
                </h1>
                <Row
                    style={{
                        marginInline: "auto",
                        marginTop: "2rem",
                        marginLeft: "2rem",
                    }}
                >
                    {groups.map((group, i) => (
                        <Col lg={4} md={6} sm={12}>
                            <GroupCard3 group={group} key={i} narrowView />
                        </Col>
                    ))}
                </Row>
            </>}

            {!events || events.length === 0 ? null : <>
                <h1
                    style={{
                        marginTop: "4rem",
                    }}
                >
                    {user.first_name} {user.last_name}'s Upcoming Events
                </h1>
                <Row
                    style={{
                        marginInline: "auto",
                        marginTop: "2rem",
                        marginLeft: "2rem",
                    }}
                >
                    {events.map((event, i) => (
                        <Col lg={4} md={6} sm={12}>
                            <EventCard3 event={event} key={i} narrowView />
                        </Col>
                    ))}
                </Row>
            </>}
        </div>
    );
};

export default UserPage;
