import React, { useState } from 'react';
import { Card, Button, Row, Col, Image, Accordion } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postData } from '../features/apiService';
import RemoveModal from '../components/RemoveModal';
import { renderCardType, makeAdmin, makeMember, removeAdmin, removeMember } from '../features/card';
import { setGroupsAsAdmin, setGroupsAsMember, addGroup, removeGroup } from '../features/groups';
import { showModal, closeModal, renderModalType } from '../features/modal';
import RootModal from './RootModal';

const RootCard = (props) => {
    const dispatch = useDispatch();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const activeUser = useSelector((state) => (state.user? state.user.value: null));
    const group = props.group;
    const key = props.key;
    const [members, setMembers] = useState(group.members);
    const navigate = useNavigate();


    const joinGroup = async () => {
        if (!activeUser)
            navigate('/login');

        let url = serverUrl + `groups/${group.id}/add_user/`;
        let data = {
            user_id: activeUser.id
        };
        let response = await postData(url, data);
        if (response) {
            setMembers([...members, activeUser.id]);
            dispatch(addGroup(group));
        } else {
            console.error('Error joining group:', response);
        }
    };

    const leaveGroup = async () => {
        let url = serverUrl + `groups/${group.id}/remove_user/`;
        let data = {
            user_id: activeUser.id
        };
        let response = await postData(url, data);
        if (response) {
            //setMembers(members.filter(member => member !== activeUser.id));
            dispatch(removeGroup(group));
        } else {
            console.error('Error leaving group:', response);
        }
    };

    const makeGroupAdmin = async (member_id) => {
        let url = serverUrl + `groups/${group.id}/make_admin/`;
        let data = {
            user_id: member_id
        };
        let response = await postData(url, data);
        if (response) {
            setMembers([...members, member_id]);
        } else {
            console.error('Error making user admin:', response);
        }
    };

    const removeGroupAdmin = async (member_id) => {
        let url = serverUrl + `groups/${group.id}/remove_admin/`;
        let data = {
            user_id: member_id
        };
        let response = await postData(url, data);
        if (response) {
            setMembers(members.filter(member => member !== member_id));
        } else {
            console.error('Error removing user admin:', response);
        }
    };

    const editGroup = () => {
        console.log('Edit group:', group);
    };

    const createEvent = () => {
        //dispatch(renderModalType({ type: 'Event' }));
    };

    // const removeGroup = () => {
    //     console.log('Remove group:', group);
    // };

    const login = () => {
        navigate('/login');
    };

    const handleAction = (action) => {
        switch (action) {
            case 'join':
                joinGroup();
                break;
            case 'leave':
                leaveGroup();
                break;
            case 'makeAdmin':
                makeGroupAdmin();
                break;
            case 'removeAdmin':
                removeGroupAdmin();
                break;
            case 'edit':
                editGroup();
                break;
            case 'createEvent':
                createEvent();
                break;
            case 'remove':
                removeGroup();
                break;
            default:
                break;
        }
    };

    const footer = activeUser === null ? (<>
        <Button variant="warning" onClick={login}>Login</Button>
    </>) : group.admin === activeUser.id ? (<>
        <Button variant="primary" onClick={editGroup} style={{ height:"50%", marginBottom: '5px' }}>Edit Group</Button>
        <Button variant="danger" onClick={createEvent} style={{ height:"50%" }}>Create New Event</Button>
    </>) : group.members.includes(activeUser.id) ? (<>
        <Button variant="info" onClick={leaveGroup}>Leave</Button>
    </>) : (<>
        <Button variant="warning" onClick={joinGroup}>Join</Button>
    </>);

    const profile_picture = group.profile_picture ? group.profile_picture : 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png';



    return (
        <div>
            <Card className="flex-fill d-flex flex-column m-2" >
                <Card.Header className='text-center' style={{display: 'flex', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
                    <Link to={`${group.id}`} className='text-decoration-none'>

                        <Card.Title style={{ marginTop: 'auto' }}>{group.name}</Card.Title>
                            <Card.Img variant="top" src={profile_picture} style={{ width: '300px', height: '200px', objectFit: 'contain' }} />

                    </Link>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Gender: {group.gender}
                    </Card.Text>
                    <Card.Text>
                        Members: {group.members.length}
                    </Card.Text>
                    <Card.Text>
                        {group.location}
                    </Card.Text>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Description</Accordion.Header>
                            <Accordion.Body>
                                {group.description}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
                <Card.Footer className="mt-auto d-flex justify-content-center"  style={{display: 'flex', 'flex-direction': 'column','align-items': 'stretch',width: '100%', height: '5em'}}>
                    {footer}
                </Card.Footer>
            </Card>
        </div>
    );
}

export default RootCard;