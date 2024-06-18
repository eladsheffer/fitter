import React from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postData } from '../features/apiService';
import { useState } from 'react';
import RemoveModal from '../components/RemoveModal';

export default function EventCard({ event }) {
    const success_img = 'https://res.cloudinary.com/djud4xysp/image/upload/v1716200974/utils/success_fpryzq.png';
    const default_event_img = 'https://res.cloudinary.com/djud4xysp/image/upload/v1716159396/events/event_img_qjeqvp.png';
    const user = useSelector((state) => state.user.value);
    const [attendees, setAttendees] = useState(event.users_attended);
    const [showModal, setShowModal] = useState(false);
    const event_date = new Date(event.date_and_time).toLocaleDateString();
    const event_time = new Date(event.date_and_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleAttend = async (isAttending) => {
        let data = {
            user_id: user.id
        };

        if (!isAttending) {
            let url = `https://fitter-backend.onrender.com/events/${event.id}/add_user/`;
            let response = await postData(url, data);
            if (response) {
                // Update the local state with the new member
                setAttendees([...attendees, user.id]);
            } else {
                console.error('Error adding user to group:', response);
            }
        } else {
            let url = `https://fitter-backend.onrender.com/events/${event.id}/remove_user/`;
            let response = await postData(url, data);
            if (response) {
                // Update the local state by removing the member
                setAttendees(attendees.filter(attendee => attendee !== user.id));
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
                title="Remove Event"
                message={`Are you sure you want to leave this event?`}
                handleRemove = {handleAttend}
                isAttending = {true}
            />
            <Row>
                <Col xs="auto">
                    <Link to={`../events/${event.id}`}>
                        <Image
                            src={event.image ?? default_event_img}
                            alt="Event thumbnail"
                            width={150}
                            height={150}
                        />
                    </Link>
                </Col>
                <Col>
                    <Link to={`${event.id}`} className='text-decoration-none'>
                        <h3>{event.title}</h3>
                    </Link>
                    <h5>{event.date}</h5>
                    <p>{event.description}</p>
                    <Row>
                        <h6>{event_date} - {event_time}</h6>
                    </Row>
                    <Row className="justify-content-between">
                        <Col xs="auto">
                            <h6>{`${attendees.length}${event.max_participants ? `/${event.max_participants}` : ''} Attendees`}</h6>
                        </Col>
                        <Col className='text-end' xs="auto">
                            <h6>{event.location}</h6>
                        </Col>
                    </Row>
                    
                    {user ? (
                        <Row>
                            {attendees.includes(user.id) ? (
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
                                        <h5 style={{ color: 'green', marginLeft: '5px', marginTop: '6px' }}>Attending</h5>
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
