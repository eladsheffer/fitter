import { Card, Col, Row, CardGroup } from "react-bootstrap";
import groups from "../data-model/groups.json";
import events from "../data-model/events.json";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getData } from "../features/apiService";
import GroupCard2 from "../components/GroupCard2";
import GroupCard3 from "../components/GroupCard3";
import EventCard2 from "../components/EventCard2";
import EventCard3 from "../components/EventCard3";
import RootCard from "../components/RootCard";
import LinearProgress from '@mui/material/LinearProgress';

const Homepage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);

    const fetchGroupsAndEvents = async () => {
        if (!activeUser) {

            let data = await getData(serverUrl + 'groups');
            if (!data) return;
            setGroups(data);

            data = await getData(serverUrl + 'events');
            if (!data) return;
            setEvents(data);
        }
        else {
            let data = await getData(serverUrl + 'users/get_groups_user_not_in/?email=' + activeUser.email);
            if (!data) return;
            setGroups(data);

            data = await getData(serverUrl + 'users/get_events_user_not_in/?email=' + activeUser.email);
            if (!data) return;
            setEvents(data);
        }
    };

    useEffect(() => {

        fetchGroupsAndEvents();

        // Cleanup function if needed
        return () => {
            // Cleanup code here, if any
        };
    }, [activeUser]);


    return (

        <div>
            <div style={{ width: "95%", marginInline: "auto", marginTop: "1rem" }}>
                { activeUser &&
                <h1>
                    Hello {activeUser.first_name} 👋
                </h1>
                }
                <div style={{ backgroundColor: "#f8f9fa", padding: "2rem" }}>
                    <h1 style={{ textAlign: "center" }}>Welcome to Fitter</h1>
                    <p style={{ textAlign: "center" }}>
                        Discover and join sports groups and events near you
                    </p>
                </div>

                <Card >
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Img src="https://images.unsplash.com/photo-1607962776833-7ec9ef952784?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTd8fHxlbnwwfHx8fHw%3D" 
                                 style={{height: "15vw"}}
                                />
                            </Col>
                            <Col>
                                <Card.Img src="https://images.unsplash.com/photo-1622599518895-be813cc42628?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                 style={{height: "15vw"}}/>
                            </Col>
                            <Col>
                                <Card.Img src="https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MzJ8fHxlbnwwfHx8fHw%3D" 
                                style={{height: "15vw"}}/>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {groups.length === 0 && events.length === 0 ? (
                    <LinearProgress style={{ marginTop: "4rem" }} />
                ) : (
                    <>
                        <h1
                            style={{
                                marginTop: "2rem",
                                marginBottom: "2rem",
                            }}
                        >
                            Events you may like
                        </h1>
                        <Row
                            className="d-flex flex-wrap"
                            style={{
                                marginInline: "auto",
                            }}
                        >
                            {events.map((event, i) => (
                                <Col lg={4} md={6} sm={12}>
                                    <EventCard3 event={event} key={i} />
                                </Col>
                            ))}
                        </Row>

                        <h1
                            style={{
                                marginTop: "2rem",
                                marginBottom: "2rem",
                            }}
                        >
                            Groups you may like
                        </h1>
                        <Row
                            className="d-flex flex-wrap"
                            style={{
                                marginInline: "auto",
                            }}
                        >
                            {groups.map((group, i) => (
                                <Col lg={4} md={6} sm={12}>
                                    <GroupCard3 group={group} key={i} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default Homepage;
