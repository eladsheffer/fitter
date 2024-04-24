import FitterNavbar from "../components/FitterNavbar";
import { Card, Col, Row, CardGroup } from "react-bootstrap";
import groups from "../data-model/groups.json";
import events from "../data-model/events.json";
import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div>
            <Card style={{ width: "40%", marginInline: "auto", marginTop: "4rem" }}>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title>Special title treatment</Card.Title>
                            <Card.Text>
                                With supporting text below as a natural lead-in to additional
                                content.
                            </Card.Text>
                        </Col>
                        <Col>
                            <Card.Img src="icons/fitter-logo.jpg" />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <h1
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                Events nearby
            </h1>
            <CardGroup
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                {events.map((event, i) => (
                    <Card key={i} border="secondary">
                        <Link to={`events/${event.id}`} style={{
                            textDecoration: "none",
                        }}>
                            <Card.Img variant="top" src={event.image} />
                            <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <Card.displayName>{event.date}</Card.displayName>
                                <Card.Text>{event.description}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">{event.location}</small>
                            </Card.Footer>
                        </Link>
                    </Card>
                ))}
            </CardGroup>
            <h1
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                Popluar groups
            </h1>
            <CardGroup
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                {groups.map((group, i) => (

                    <Card key={i} border="secondary">
                        <Link to={`groups/${group.id}`} style={{
                            textDecoration: "none",
                        }}>
                            <Card.Img variant="top" src={group.image} />
                            <Card.Body>
                                <Card.Title>{group.name}</Card.Title>
                                <Card.Text>{group.description}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">{group.location}</small>
                            </Card.Footer>
                        </Link>
                    </Card>
                ))}
            </CardGroup>
        </div>
    );
};

export default Homepage;
