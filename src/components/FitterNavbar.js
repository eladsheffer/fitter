import React from "react";
import logo from "@/../../public/icons/fitter-logo.jpg";
import { Navbar, Nav, Form, Row, Col, Button, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import {Link} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../features/user';

const FitterNavbar = () => {
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.user.value);
  let signupLink = !activeUser ? <Nav.Link as={Link} to="/signup">Signup</Nav.Link> : null;
  let loginLink = !activeUser ? <Nav.Link as={Link} to="/login">Login</Nav.Link> : null;
  let logoutLink = activeUser ? <Nav.Link as={Link} to="/" onClick={()=>logoutFunc()}>Logout</Nav.Link> : null;
  const logoutFunc = () => {
    dispatch(logout());
  }

  return (
    <Navbar
      className="bg-body-tertiary justify-content-between"
      bg="dark"
      data-bs-theme="dark"
    >
      <Navbar.Brand as={Link} to="/">
        <Image
          src={logo}
          width="100"
          height="50"
          className="d-inline-block align-top"
          alt="Fitter"
          rounded
        />
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
            <Button>Search</Button>
          </Col>
        </Row>
      </Form>
      <Nav>
        <Nav.Link as={Link} to="/groups">Groups</Nav.Link>
        <Nav.Link as={Link} to="/events">Events</Nav.Link>
      </Nav>
      <Nav>
        {signupLink}
        {loginLink}
        {logoutLink}
      </Nav>
    </Navbar>
  );
};

export default FitterNavbar;
