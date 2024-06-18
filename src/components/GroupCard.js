import React, { useState } from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { postData } from '../features/apiService';
import RemoveModal from '../components/RemoveModal';

export default function GroupCard({ group }) {
    const success_img = 'https://res.cloudinary.com/djud4xysp/image/upload/v1716200974/utils/success_fpryzq.png';
    const default_group_img = 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png';
    const user = useSelector((state) => state.user.value);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Manage the local state for group members
    const [members, setMembers] = useState(group.members);

    const handleAttend = async (isAttending) => {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        let data = {
            user_id: user.id
        };

        if (!isAttending) {
            let url = serverUrl + `groups/${group.id}/add_user/`;
            let response = await postData(url, data);
            if (response) {
                // Update the local state with the new member
                setMembers([...members, user.id]);
            } else {
                console.error('Error adding user to group:', response);
            }
        } else {
            let url = serverUrl + `groups/${group.id}/remove_user/`;
            let response = await postData(url, data);
            if (response) {
                // Update the local state by removing the member
                setMembers(members.filter(member => member !== user.id));
                handleClose();
            } else {
                console.error('Error removing user from group:', response);
            }
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <hr />
            <RemoveModal
                show={showModal}
                handleClose={handleClose}
                title="Remove Group"
                message={`Are you sure you want to leave this group?`}
                handleRemove = {handleAttend}
                isAttending = {true}
            />
            {/* <Row>
                <Button onClick={handleShow}>Press</Button>
            </Row> */}
            <Row>
                <Col xs="auto">
                    <Link to={`../groups/${group.id}`}>
                        <Image
                            src={group.profile_picture ?? default_group_img}
                            alt="Event thumbnail"
                            width={150}
                            height={150}
                        />
                    </Link>
                </Col>
                <Col>
                    <Link to={`../groups/${group.id}`} className='text-decoration-none'>
                        <h3>{group.name}</h3>
                    </Link>
                    <p>{group.description}</p>
                    <p>Gender: {group.gender}</p>
                    <Row className="justify-content-between">
                        <Col xs="auto">
                            <h6>{`${members.length} Members`}</h6>
                        </Col>
                        <Col className='text-end' xs="auto">
                            <h6>{group.location && group.location !== '' ? group.location : "Israel"}</h6>
                        </Col>
                    </Row>
                    {user ? (
                        <Row>
                            {members.includes(user.id) ? (
                                <>
                                    <Col xs="auto" style={{ paddingRight: '0', display: 'flex', alignItems: 'center' }}>
                                        <Image
                                            src={success_img}
                                            alt="Success icon"
                                            width={20}
                                            height={20}
                                            style={{ marginRight: '5px' }}
                                        />
                                    </Col>
                                    <Col className="text-start" xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                                        <h5 style={{ color: 'green', marginLeft: '5px', marginTop: '6px' }}>Member</h5>
                                    </Col>
                                    <Col className='text-end'>
                                        <Button variant="outline-danger" onClick={handleShow}>Leave</Button>
                                    </Col>
                                </>
                            ) : (
                                <>
                                    <Col></Col>
                                    <Col xs="auto" className='text-end ml-auto'>
                                        <Button variant="outline-primary" onClick={() => handleAttend(false)}>Attend</Button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    ) : (
                        <div>
                            <p>You need to be logged in to attend this event.</p>
                            <Link to="/login">
                                <Button variant="outline-primary">Login</Button>
                            </Link>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
}
