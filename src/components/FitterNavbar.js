import React from "react";
import logo from "@/../../public/icons/fitter-logo.jpg";
import { Navbar, Nav, Form, Row, Col, Button, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../features/user';
import { getData , postData } from "../features/apiService";
import { useState } from "react";
import { colors } from "@mui/material";

const FitterNavbar = () => {
  const [searchKey , setSearchKey] = useState('');
  const [radioValue, setRadioValue] = useState('1');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.user.value);
  let signupLink = !activeUser ? <Nav.Link as={Link} to="/signup">Signup</Nav.Link> : null;
  let loginLink = !activeUser ? <Nav.Link as={Link} to="/login">Login</Nav.Link> : null;
  let logoutLink = activeUser ? <Nav.Link as={Link} to="/" onClick={() => logoutFunc()}>Logout</Nav.Link> : null;

  const logoutFunc = async () => {

    let data = await postData('https://fitter-backend.onrender.com/users/logout/', null);
    if (data != null)
      dispatch(logout()); 
  }

  const handleSearch = async () => {
    console.log('searchKey:', searchKey);
    let groupsData = await getData(`https://fitter-backend.onrender.com/groups/?search=${searchKey}`);
    let eventsData = await getData(`https://fitter-backend.onrender.com/events/?search=${searchKey}`);
    console.log('groupsData:', groupsData.results);
    console.log('eventsData:', eventsData.results);

    let searchResults = {
      groupsData: groupsData.results,
      eventsData: eventsData.results
    }
    navigate(`/search?key=${searchKey}`, {state: searchResults});

    }
  

  const handleSearchToggle = async (e) => {
    console.log('radioValue:', e.target.value);
    setRadioValue(e.target.value);
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
      <Form>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-2 rounded-pill"
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            {/* <Nav.Link to='/search'> */}
              <Button onClick={handleSearch}>Search</Button>
            {/* </Nav.Link> */}
            
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
