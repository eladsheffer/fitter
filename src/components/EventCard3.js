import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addGroup, removeGroup } from '../features/groups';
import { showModal, renderModalType, setGroupId } from '../features/modal';
import { postData } from '../features/apiService';
import { formatFriendlyDate } from "../features/apiService";


const EventCard3 = ({ event }) => {

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeUser = useSelector((state) => state.user.value);

    const defaultEventImage = '/icons/group.png';
    const image = event.image ? event.image : defaultEventImage;
    const attendeeIcon = '/icons/success.png';
    const organizerIcon = '/icons/admin.png';

    const [participants, setParticpants] = useState(event.users_attended);

    const editEvent = () => {
        console.log('Edit event:', event);
        navigate(`/edit-event/${event.id}`);
    };

    const joinEvent = async () => {

    };

    const leaveEvent = async () => {

    };

    const removeEvent = () => {
        console.log('Remove event:', event);
    };

    const login = () => {
        navigate('/login');
    };


    return (
        <div>
            <hr />
            <Row>
                <Col lg={6} md={6} sm={6} xs="6" style={{ overflow: "hidden" }}>
                    <Link to={`/events/${event.id}/`}>
                        <Image
                            src={image}
                            alt="Group thumbnail"
                            style={{ width: "200px", height: "150px" }}
                        />
                    </Link>
                </Col>



                <Col lg={6} md={6} sm={6} xs="6" style={{ textWrap: "wrap", whiteSpace: "wrap", textOverflow: "ellipsis" }}>
                    <Row>
                        <Link to={`/events/${event.id}/`} style={{ textDecoration: "none" }}>
                            <h5>{event.title}</h5>
                        </Link>
                        <h5>{formatFriendlyDate(event.date_and_time)}</h5>

                        <Col>
                            <h6>{event.location}</h6>
                            <h6>{`Gender: ${event.gender}`}</h6>
                            <h6>{`Ages: ${event.min_age ? event.min_age : "0"} - ${event.max_age ? event.max_age : "120"}`}</h6>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row>
                <Col xs={8}>
                    <p>{event.description}</p>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h6>Sport Type: {event.sport_type} </h6>
                </Col>

            </Row>

            <Row className="justify-between gap-5" style={{ color: "#43a047" }}>
                <Col>

                    {event.max_participants !== null &&
                        typeof event.max_participants === "number" ? (
                        <h6>{`${event.users_attended.length}/${event.max_participants} Attendees`}</h6>
                    ) : (
                        <h6>{`${event.users_attended.length} Attendees`}</h6>
                    )}
                </Col>
            </Row>

            <Row className="justify-between gap-5">
                <Col>
                    {activeUser === null ? (<>
                        <Button variant="outline-warning" onClick={login}>Login</Button>
                    </>) : event.organizer === activeUser.id ? (<>
                        <Button variant="outline-primary" onClick={editEvent}>Edit Event</Button>
                    </>) : event.users_attended.includes(activeUser.id) ? (<>
                        <Button variant="outline-info" onClick={leaveEvent}>Leave</Button>
                    </>) : (<>
                        <Button variant="outline-warning" onClick={joinEvent}>Join</Button>
                    </>)}

                </Col>
            </Row>

            {activeUser && event.users_attended.includes(activeUser.id) &&
                <Row>
                    <Col xs="auto" style={{ paddingRight: '0', display: 'flex', alignItems: 'center' }}>
                        <Image src={attendeeIcon} alt="Member icon" width={20} height={20} />
                    </Col>
                    <Col className="text-start" xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                        <h5 style={{ color: 'green', marginLeft: '5px', marginTop: '6px' }}>Attendee</h5>
                    </Col>
                    {activeUser && event.organizer === activeUser.id &&
                        <>
                            <Col xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                                <Image src={organizerIcon} alt="Admin icon" width={30} height={30} />
                            </Col>
                            <Col className="text-start" xs="auto" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center' }}>
                                <h5 style={{ color: 'blue', marginLeft: '5px', marginTop: '6px' }}>organizer</h5>
                            </Col>
                        </>
                    }
                </Row>
            }

        </div>
    );
}

export default EventCard3;