import React, { useEffect, useState } from "react";
import { Container, Image, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { green } from "@mui/material/colors";
import { formatFriendlyDate } from "../features/apiService";
import LinearProgress from "@mui/material/LinearProgress";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import UserCard from "../components/UserCard";
import { getData, postData } from "../features/apiService";
import Map from "../components/Map";
import PageTitle from "../components/PageTitle";

export default function EventPage() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const activeUser = useSelector((state) => state.user.value);
  let { id } = useParams();
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const defaultEventImage = "/icons/event.png";
  const [eventImage, setEventImage] = useState(defaultEventImage);

  const fetchEventAndAttendees = async () => {
    // Fetch evnet data
    let organizerId = null;
    const eventData = await getData(`${serverUrl}events/${id}/`);
    if (eventData) {
      setEvent(eventData);
      if (eventData.image) {
        setEventImage(eventData.image);
      }
      organizerId = eventData.organizer;
    }

    // Fetch attendees data
    const attendeesData = await getData(
      `${serverUrl}events/${id}/get_event_attendees/`
    );
    if (attendeesData) {
      setAttendees(attendeesData);
    }

    if (organizerId) {
      const organizerData = await getData(`${serverUrl}users/${organizerId}/`);
      if (organizerData) {
        setOrganizer(organizerData);
      }
    }
  };

  useEffect(() => {
    fetchEventAndAttendees();
  }, []);

  const removeAttendee = async (userId) => {

    const url = `${serverUrl}events/${id}/remove_user/`;
    let attendeeToRemove = {
      user_id: userId
    };
    let response = await postData(url, attendeeToRemove);
    if (response) {
      fetchEventAndAttendees();
    } else {
      console.error('Error removing user:', response);
    }

  };

  return (
    <div>
      {!event ? (
        <LinearProgress />
      ) : (
        <div className="pages">
          <PageTitle title={`Fitter - Event - ${event.title}`} />
          <Container fluid="md">

            {activeUser && event.organizer === activeUser.id && (
              <Row>
                <Col lg="9" md="9" sm="9" xs="9"></Col>
                <Col lg="1" md="1" sm="1" xs="1">
                  <Link to={`/edit-event/${event.id}/`}>
                    <Image width={50} height={50} src="/icons/settings.png" />
                  </Link>
                </Col>
              </Row>
            )}

            <Row className="mb-4">
              <Col md={6}>
                <Image src={eventImage} alt="Event Banner" fluid />
              </Col>
              <Col md={5}>
                <h1>{`${event.title} - ${event.location}`}</h1>
                <h2>{formatFriendlyDate(event.date_and_time)}</h2>
                {organizer ? (
                  <h3>{`By ${organizer.first_name} ${organizer.last_name}`}</h3>
                ) : (
                  <></>
                )}
                <p className="mb-0">
                  <strong>Type:</strong> {event.sport_type}
                </p>
                {event.event_fee && (
                  <p className="mb-0">
                    <strong>Fee:</strong> ${event.event_fee}
                  </p>
                )}
                {!event.event_fee && (
                  <p className="mb-0">
                    <strong>Fee:</strong> Free
                  </p>
                )}
                {event.contact_info && (
                  <p>
                    <strong>Contact:</strong> {event.contact_info}
                  </p>
                )}
                {event.max_participants !== null &&
                  typeof event.max_participants === "number" ? (
                  <h6
                    style={{ color: green }}
                  >{`${event.users_attended.length}/${event.max_participants} Attendees`}</h6>
                ) : (
                  <h6
                    style={{ color: "#43a047" }}
                  >{`${event.users_attended.length} Attendees`}</h6>
                )}
              </Col>

            </Row>
            <Row>
              <Col>
                <h3>Description</h3>
                <p>{event.description}</p>
              </Col>
            </Row>
            {organizer && (
              <Row>
                <Col lg={1} md={2} sm={2} xs={3}>
                  <h4>Organizer: </h4>
                </Col>
                <Col>
                  <UserCard user={organizer} />
                </Col>
              </Row>
            )}

            <h1
              style={{
                marginInline: "auto",
                marginTop: "2rem",
              }}
            >
              Attendees
            </h1>

            <Row
              style={{
                marginInline: "auto",
                marginLeft: "2rem",
              }}
            >
              {attendees.length > 0 ? (
                attendees.map((attendee, i) => (
                  <Col lg={3} md={4} sm={6} xs={12}>
                    <UserCard key={i} user={attendee} />
                    {activeUser && event.organizer === activeUser.id && attendee.id !== activeUser.id && (

                      <Button className='rounded-pill' variant='danger' style={{ backgroundColor: "transparent", marginBottom: "4rem" }}
                        onClick={() => removeAttendee(attendee.id)}
                      >
                        <RemoveCircleOutlineIcon style={{ color: "red" }} />
                      </Button>



                    )}
                  </Col>
                ))
              ) : (
                <p style={{ color: "red" }}>No attendees found.</p>
              )}
            </Row>
            <Row>
              <Col lg="8" md="10" sm="12" xs="12">
                <h3>Location</h3>
                <Map address={event.location} />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );

  function handleReminderToggle() {
    // Handle reminder setting logic here, perhaps update the server with new state
  }
}
