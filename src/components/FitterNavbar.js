import React from 'react';
import { Navbar, Nav, Form, Row, Col, Button, Image } from 'react-bootstrap'
const FitterNavbar = () => {
    return (
        <Navbar className="bg-body-tertiary justify-content-between" bg="dark" data-bs-theme="dark">
            <Navbar.Brand href="/">
                <Image src="icons/fitter-logo.jpg" width="100" height="50" className="d-inline-block align-top" alt="Fitter" rounded />
            </Navbar.Brand>
            <Form inline>
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2 rounded-pill"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Search</Button>
                    </Col>
                </Row>
            </Form>
            <Nav>
                <Nav.Link href="/groups">Groups</Nav.Link>
                <Nav.Link href="/events">Events</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
            </Nav>
        </Navbar>
    );
};

export default FitterNavbar;