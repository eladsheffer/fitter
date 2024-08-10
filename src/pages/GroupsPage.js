import { Dropdown, Row, Col, Form, Button, Image, Card, CardGroup } from 'react-bootstrap';
import groups from "../data-model/groups.json";
import sports from "../data-model/sports.json";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GroupCard2 from '../components/GroupCard2';
import RootCard from '../components/RootCard';
import { useSelector, useDispatch } from 'react-redux';
import RootModal from '../components/RootModal';
import { renderModalType } from '../features/modal';
import { useState, useEffect } from 'react';
import { getData } from '../features/apiService';
import LinearProgress from '@mui/material/LinearProgress';

const GroupsPage = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.user.value);
    //const groups = useSelector((state) => state.groups.value);
    const location = useLocation();

    const [groupsOfUserAsAdmin, setGroupsOfUserAsAdmin] = useState([]);
    const [groupsOfUserAsMember, setGroupsOfUserAsMember] = useState([]);
    const [groupsUserNotIn, setGroupsUserNotIn] = useState([]);

    const type = activeUser ? 'Group' : 'Signup';

    dispatch(renderModalType({ type: type }));

    const pickGroup = (group) => {
        navigate(`/groups/${group.id}`);
    }

    useEffect(() => {
        const fetchGroups = async () => {
            if (!activeUser){
                let data = await getData(serverUrl + 'groups');
                if (!data) return;
                setGroupsUserNotIn(data.results);
            }
            else{

            let data = await getData(serverUrl + 'users/get_user_groups_as_admin/?email=' + activeUser.email);
            if (!data) return;
            setGroupsOfUserAsAdmin(data);

            data = await getData(serverUrl + 'users/get_user_groups_as_member_not_as_admin/?email=' + activeUser.email);
            if (!data) return;
            setGroupsOfUserAsMember(data);

            data = await getData(serverUrl + 'users/get_groups_user_not_in/?email=' + activeUser.email);
            console.log("offer: ",data);
            if (!data) return;
            setGroupsUserNotIn(data);
            }


        }
        fetchGroups();
        console.log(groupsOfUserAsMember);
        console.log(groupsOfUserAsAdmin);

        // Cleanup function if needed
        return () => {
            // Cleanup code here, if any
        };
    }, []);


    return (
        <div>
            <div style={{ width: "95%", marginInline: "auto", marginTop: "4rem" }}>
                {/* <Row>
                    <Col>
                    </Col>
                    <Col xs="10">
                        <h1>Find Your Group</h1>
                    </Col>
                </Row> */}
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        {/* <Form.Control
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2 rounded-pill"
                        /> */}
                    </Col>
                    <Col>
                        {/* <Button>Search</Button> */}
                    </Col>
                    <Col>
                        {/* <h3>Or</h3> */}
                    </Col>
                    <Col>
                        <p>Start your group and community!</p>
                    </Col>
                    <Col>
                        <RootModal />
                    </Col>

                </Row>

                {/* <Row>
                    <Col>
                        <h3>Search By Filters</h3>
                    </Col>
                </Row> */}

                {/* <div className="d-flex justify-content-between"> 
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
                           
                        </Dropdown.Menu>
                    </Dropdown>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown3" style={{ borderRadius: "20px" }}>
                            Any Proficiency
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                           
                        </Dropdown.Menu>
                    </Dropdown>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown4" style={{ borderRadius: "20px" }}>
                            Any Rating
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                           
                        </Dropdown.Menu>
                    </Dropdown>
                </div> */}
            
            
            {groupsOfUserAsAdmin.length===0 && groupsOfUserAsMember.length===0 && groupsUserNotIn.length===0? <LinearProgress/> : null}
            {groupsOfUserAsAdmin.length===0? null : <>
            <h1
                style={{
                    marginTop: "4rem",
                }}
            >
                Groups You Admin
            </h1>
            <Row
                style={{
                    marginInline: "auto",
                }}
            >
                {groupsOfUserAsAdmin.map((group, i) => (
                    <Col lg={4} md={6} sm={12}>
                        <GroupCard2 group={group} key={i}/>
                    </Col>
                ))}
            </Row>
            </>}

            {groupsOfUserAsMember.length===0? null : <>
            <h1
                style={{
                    marginTop: "4rem",
                }}
            >
                Groups You Are A Member Of
            </h1>
            <Row className='d-flex flex-wrap'
                style={{
                    marginInline: "auto",
                }}
            >
                {groupsOfUserAsMember.map((group, i) => (
                    <Col lg={4} md={6} sm={12}>
                        <GroupCard2 group={group} key={i}/>
                    </Col>
                ))}
            </Row>
            </>}

            {groupsUserNotIn.length===0? null : <>
             <h1
                style={{
                    marginTop: "4rem",
                }}
            >
                Groups You can Join:
            </h1>
            <Row className='d-flex flex-wrap'
                style={{
                    marginInline: "auto",
                }}
            >
                {groupsUserNotIn.map((group, i) => (
                    <Col lg={4} md={6} sm={12}>
                        <GroupCard2 group={group} key={i}/>
                    </Col>
                ))}
            </Row>
            </>}
            </div>
        </div>
    );
}

export default GroupsPage;