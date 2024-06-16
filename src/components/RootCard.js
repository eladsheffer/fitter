import React, { useState } from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postData } from '../features/apiService';
import RemoveModal from '../components/RemoveModal';
import { renderCardType, makeAdmin, makeMember, removeAdmin, removeMember } from '../features/card';
import { setGroupsAsAdmin, setGroupsAsMember, addGroup, removeGroup } from '../features/groups';

const RootCard = (props) => {
    const dispatch = useDispatch();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const activeUser = useSelector((state) => state.user.value);
    const group = props.group;
    const key = props.key;
    const [members, setMembers] = useState(group.members);


    const joinGroup = async () => {
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
        console.log('Create event for group:', group);
    };

    // const removeGroup = () => {
    //     console.log('Remove group:', group);
    // };

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

    const footer = group.admin === activeUser.id ? (<>
        <Button variant="warning" onClick={editGroup}>Edit Group</Button>
        <Button variant="info" onClick={createEvent}>Create New Event</Button>
    </>) : group.members.includes(activeUser.id) ? (<>
        <Button variant="danger" onClick={leaveGroup}>Leave</Button>
    </>) : (<>
        <Button variant="primary" onClick={joinGroup}>Join</Button>
    </>);

    const profile_picture = group.profile_picture ? group.profile_picture : 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png';



    return (
        <div>
            <Card className="flex-fill d-flex flex-column m-2" style={{ minWidth: '300px' }}>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Img src={profile_picture} />
                        </Col>
                        <Col>
                            <Link to={`${group.id}`} className='text-decoration-none'>
                                <Card.Title>{group.name}</Card.Title>
                            </Link>
                            <Card.Text>
                                {group.description}
                            </Card.Text>
                            <Card.Text>
                                Gender: {group.gender}
                            </Card.Text>
                            <Card.Text>
                                Members: {group.members.length}
                            </Card.Text>
                            <Card.Text>
                                {group.location}
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    {footer}
                </Card.Footer>
            </Card>
        </div>
    );
}

export default RootCard;