import React, { useState } from 'react';
import { Card, Button, Row, Col, Image, Accordion } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postData } from '../features/apiService';
import RemoveModal from '../components/RemoveModal';
import { renderCardType, makeAdmin, makeMember, removeAdmin, removeMember } from '../features/card';
import { showModal, closeModal, renderModalType } from '../features/modal';
import RootModal from './RootModal';

const EventCard2 = (props) => {
    const dispatch = useDispatch();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const activeUser = useSelector((state) => state.user.value);
    const event = props.event;
    const key = props.key;
    const [participants, setParticpants] = useState(event.users_attended);
    const navigate = useNavigate();

    const eventDate = new Date(event.date_and_time).toLocaleDateString();
    const eventTime = new Date(event.date_and_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


    const joinEvent = async () => {

    };

    const leaveEvent = async () => {

    };

    const makeEventHost = async (member_id) => {

    };

    const removeEventHost = async (member_id) => {

    };

    const editEvent = () => {
        console.log('Edit event:', event);
    };

    const removeEvent = () => {
        console.log('Remove event:', event);
    };

    const login = () => {
        navigate('/login');
    };

    const handleAction = (action) => {
        switch (action) {
            case 'join':
                joinEvent();
                break;
            case 'leave':
                leaveEvent();
                break;
            case 'makeAdmin':
                makeEventHost();
                break;
            case 'removeAdmin':
                removeEventHost();
                break;
            case 'edit':
                editEvent();
                break;
            case 'remove':
                removeEvent();
                break;
            default:
                break;
        }
    };

    const footer = activeUser === null ? (<>
        <Button variant="warning" onClick={login}>Login</Button>
    </>) : event.organzier === activeUser.id ? (<>
        <Button variant="primary" onClick={editEvent} style={{ height:"50%", marginBottom: '5px' }}>Edit Event</Button>
    </>) : event.users_attended.includes(activeUser.id) ? (<>
        <Button variant="info" onClick={leaveEvent}>Leave</Button>
    </>) : (<>
        <Button variant="primary" onClick={joinEvent}>Join</Button>
    </>);

    const profile_picture = event.image ? event.image : 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159438/groups/group_img_b9v9za.png';



    return (
        <div>
            <Card className="flex-fill d-flex flex-column m-2" style={{}}>
            <Link to={`${event.id}`}>
                <Card.Title className="text-center align-self-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden',  }}>{event.title}</Card.Title>
            </Link>
                <div className="flex-fill d-flex flex-row m-2" style={{width: '100%'}}>
                    <Card.Header className="d-flex justify-content-center align-items-center">
                        <Link to={`${event.id}`}>
                            <Card.Img src={profile_picture} style={{ width: '100%', objectFit: 'contain' }} />
                        </Link>
                    </Card.Header>
                    <Card.Body className="flex-fill d-flex flex-column m-2" style={{width: '200px', }}>
                    <Link to={`${event.id}`}>
                        <Card.Text>
                            Date: {eventDate}
                        </Card.Text>
                        <Card.Text>
                            Time: {eventTime}
                        </Card.Text>
                        <Card.Text>
                            Gender: {event.gender}
                        </Card.Text>
                        <Card.Text>
                            Participants: {event.users_attended.length}
                        </Card.Text>
                        <Card.Text>
                            {event.location}
                        </Card.Text>
                    </Link>
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Description</Accordion.Header>
                                <Accordion.Body>
                                    {event.description}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        {footer}
                    </Card.Body>
                </div>
            </Card>
        </div>
    );
}

export default EventCard2;