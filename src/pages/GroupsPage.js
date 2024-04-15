import FitterNavbar from '../components/FitterNavbar';
import { Dropdown, Row, Col, Form, Button, Image, Card, CardGroup } from 'react-bootstrap';
import groups from "../data-model/groups.json";
import sports from "../data-model/sports.json";
import { Link } from "react-router-dom";

const GroupsPage = () => {
    return (
        <div>
            <FitterNavbar />
            <div style={{ width: "80%", marginInline: "auto", marginTop: "4rem" }}>
                <Row>
                    <Col>
                    </Col>
                    <Col xs="10">
                        <h1>Find Your Group</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2 rounded-pill"
                        />
                    </Col>
                    <Col>
                        <Button type="submit">Search</Button>
                    </Col>
                    <Col>
                        <h3>Or</h3>
                    </Col>
                    <Col>
                        <p>Start your own group and community!</p>
                    </Col>
                    <Col>
                        <Image src="icons/add.png" width="40" height="40" className="d-inline-block align-top" alt="add" rounded />
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <h3>Search By Filters</h3>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between"> {/* Modified line */}
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown1" style={{ borderRadius: "20px" }}>
                            Any Sports
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {sports.map((sport, i) => (
                                <Dropdown.Item key={i}>{sport.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown2" style={{ borderRadius: "20px" }}>
                            Any Location
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* Dropdown 2 menu items */}
                        </Dropdown.Menu>
                    </Dropdown>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown3" style={{ borderRadius: "20px" }}>
                            Any Proficiency
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* Dropdown 3 menu items */}
                        </Dropdown.Menu>
                    </Dropdown>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown4" style={{ borderRadius: "20px" }}>
                            Any Rating
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* Dropdown 4 menu items */}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <h1
                style={{
                    width: "70%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                Results
            </h1>
            <CardGroup
                style={{
                    width: "30%",
                    marginInline: "auto",
                    marginTop: "4rem",
                }}
            >
                {groups.map((group, i) => (
                    <Row>
                        <Col>
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
                        </Col>
                    </Row>
                ))}
            </CardGroup>
        </div>
    );
}

export default GroupsPage;