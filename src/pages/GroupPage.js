import FitterNavbar from '../components/FitterNavbar';
import { useState } from 'react';
import { Card, Col, Row, Image, CardGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import events from '../data-model/events.json';
import groups from '../data-model/groups.json';
import users from '../data-model/users.json';


const GroupPage = () => {

    let { id } = useParams();
    let groupData = groups.find((e) => e.id === id);
    const [group, setGroup] = useState(groupData);

    return (
        <div>
            <Row>
            <Col xs="1">
                </Col>  
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
                        <Card.Img src={"../icons/rating-5-stars.png"} />
                        </Col>  
                        <Col>
                            <Card.Img src={"../"+group.image} />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Col> 
            <Col xs="1">    
            </Col>   
            <Col xs="2">
            <Image width={50} height={50} src="../icons/settings.png" />
            </Col>  
            </Row>

            <h1
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                Events
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
                            <Card.Img variant="top" src={"../"+event.image} />
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
                Members
            </h1>
            <CardGroup
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                {users.map((user, i) => (
                    <Card key={i} border="secondary">
                        <Link to={`events/${user.id}`} style={{
                            textDecoration: "none",
                        }}>
                            <Card.Img variant="top" src={"../"+user.picture} />
                            <Card.Body>
                                <Card.Title>{user.name}</Card.Title>
                            </Card.Body>
                        </Link>
                    </Card>
                ))}
            </CardGroup>
        </div>
    );
}


export default GroupPage;