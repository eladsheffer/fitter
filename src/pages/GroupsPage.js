import { Row, Col,Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import RootModal from '../components/RootModal';
import { renderModalType, showModal } from '../features/modal';
import { useState, useEffect } from 'react';
import { getData } from '../features/apiService';
import LinearProgress from '@mui/material/LinearProgress';
import GroupCard3 from "../components/GroupCard3";
import PageTitle from "../components/PageTitle";

const GroupsPage = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.user.value);
    const groupUpdated = useSelector((state) => state.groups.value.groupUpdated);

    const [groupsOfUserAsAdmin, setGroupsOfUserAsAdmin] = useState([]);
    const [groupsOfUserAsMember, setGroupsOfUserAsMember] = useState([]);
    const [groupsUserNotIn, setGroupsUserNotIn] = useState([]);

    const type = activeUser ? 'Group' : 'Signup';

    dispatch(renderModalType({ type: type }));

    const pickGroup = (group) => {
        navigate(`/groups/${group.id}`);
    }

    const fetchGroups = async () => {
        if (!activeUser){
            let data = await getData(serverUrl + 'groups');
            if (!data) return;
            setGroupsUserNotIn(data);
        }
        else{

        let data = await getData(serverUrl + 'users/get_user_groups_as_admin/?email=' + activeUser.email);
        if (!data) return;
        setGroupsOfUserAsAdmin(data);

        data = await getData(serverUrl + 'users/get_user_groups_as_member_not_as_admin/?email=' + activeUser.email);
        if (!data) return;
        setGroupsOfUserAsMember(data);

        data = await getData(serverUrl + 'users/get_groups_user_not_in/?email=' + activeUser.email);
        if (!data) return;
        setGroupsUserNotIn(data);
        }
    };

    useEffect(() => {
        
        fetchGroups();
        // Cleanup function if needed
        return () => {
            // Cleanup code here, if any
        };
    }, [groupUpdated, activeUser]);

    const createGroup = () => {
        if (!activeUser) {
            dispatch(renderModalType({ type: 'Login' }));
        } else {
            dispatch(renderModalType({ type: 'Group' }));
        }
        dispatch(showModal());
    }


    return (
        <div>
           <div style={{ width: "90%", marginInline: "auto", marginTop: "1rem" }}>
                <PageTitle title={`Fitter - Groups`} />
                <Row>
                    <Col>
                    </Col>
                    <Col>

                    </Col>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                        <p>Start your group and community!</p>
                    </Col>
                    <Col>
                    <a href="#">
                        <Image src="/icons/add.png" width="40" height="40" className="d-inline-block align-top" alt="add" rounded
                            onClick={createGroup} />
                    </a>
                    <RootModal hideButton={true} />
                    </Col>

                </Row>
            
            {groupsOfUserAsAdmin.length===0 && groupsOfUserAsMember.length===0 && groupsUserNotIn.length===0? <LinearProgress/> : null}
            {groupsOfUserAsAdmin.length===0? null : <>
            <h1
                style={{
                    marginTop: "4rem",
                    marginBottom: "2rem",
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
                        <GroupCard3 group={group} key={i} render={true}/>
                    </Col>
                ))}
            </Row>
            </>}

            {groupsOfUserAsMember.length===0? null : <>
            <h1
                style={{
                    marginTop: "4rem",
                    marginBottom: "2rem",
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
                        <GroupCard3 group={group} key={i} render={true}/>
                    </Col>
                ))}
            </Row>
            </>}

            {groupsUserNotIn.length===0? null : <>
             <h1
                style={{
                    marginTop: "4rem",
                    marginBottom: "2rem",
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
                        <GroupCard3 group={group} key={i} render={true}/>
                    </Col>
                ))}
            </Row>
            </>}
            </div>
        </div>
    );
}

export default GroupsPage;