import { Card, Col, Row, CardGroup } from "react-bootstrap";
import groups from "../data-model/groups.json";
import events from "../data-model/events.json";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getData } from "../features/apiService";
import GroupCard from "../components/GroupCard";
import EventCard from "../components/EventCard";

const Homepage = () => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchGroupsAndEvents = async () => {
            if (!activeUser){

            let data = await getData(serverUrl + 'groups');
            if (!data) return;
            setGroups(data.results);

            data = await getData(serverUrl + 'events');
            if (!data) return;
           setEvents(data.results);
            }
            else{
                let data = await getData(serverUrl + 'users/get_groups_user_not_in/?email=' + activeUser.email);
                console.log("offer: ",data);
                if (!data) return;
                setGroups(data);

                data = await getData(serverUrl + 'users/get_events_user_not_in/?email=' + activeUser.email);
                console.log("offer: ",data);
                if (!data) return;
                setEvents(data);
            }
        }
        fetchGroupsAndEvents();
        console.log(groups);
        console.log(events);

        // Cleanup function if needed
        return () => {
            // Cleanup code here, if any
        };
    }, [activeUser]);


    return (
        
        <div>
                <div style={{ backgroundColor: "#f8f9fa", padding: "2rem" }}>
                    <h1 style={{ textAlign: "center" }}>Welcome to Fitter</h1>
                    <p style={{ textAlign: "center" }}>
                        Discover and join sports groups and events near you
                    </p>
                </div>

                <Card style={{ width: "80%", marginInline: "auto" }}>
                    <Card.Body>
                        <Row>
                            <Col>
                            <Card.Img src="https://images.unsplash.com/photo-1607962776833-7ec9ef952784?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTd8fHxlbnwwfHx8fHw%3D" />
                            </Col>
                            <Col>
                                <Card.Img src="https://images.unsplash.com/photo-1622599518895-be813cc42628?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                            </Col>
                            <Col>
                                <Card.Img src="https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MzJ8fHxlbnwwfHx8fHw%3D" />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {groups === null || events === null ? (
                    <h1>Loading...</h1>
                ) : (
                    <>
                        <h1
                            style={{
                                width: "70%",
                                marginInline: "auto",
                                marginTop: "4rem",
                            }}
                        >
                            Events you may like
                        </h1>
                        <Row
                            className="d-flex flex-wrap"
                            style={{
                                width: "70%",
                                marginInline: "auto",
                                marginTop: "4rem",
                            }}
                        >
                            {events.map((event, i) => (
                                <Col sm={4}>
                                    <EventCard event={event} key={i} />
                                </Col>
                            ))}
                        </Row>

                        <h1
                            style={{
                                width: "70%",
                                marginInline: "auto",
                                marginTop: "4rem",
                            }}
                        >
                            Groups you may like
                        </h1>
                        <Row
                            className="d-flex flex-wrap"
                            style={{
                                width: "70%",
                                marginInline: "auto",
                                marginTop: "4rem",
                            }}
                        >
                            {groups.map((group, i) => (
                                <Col sm={4}>
                                    <GroupCard group={group} key={i} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
        </div>
    );
};

export default Homepage;
