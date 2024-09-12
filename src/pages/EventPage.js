import React, { useEffect, useState } from "react";
import FitterNavbar from "../components/FitterNavbar";
import { Container, Image, Row, Col } from "react-bootstrap";
import logo from "@/../../public/icons/fitter-logo.jpg";
import { useParams, Link } from "react-router-dom";
import events from "../data-model/events.json";
import { useSelector } from "react-redux";
import { green } from "@mui/material/colors";
import { formatFriendlyDate } from "../features/apiService";
import LinearProgress from "@mui/material/LinearProgress";
import UserCard from "../components/UserCard";
import { getData } from "../features/apiService";
import Map from "../components/Map";

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

  return (
    <div>
      {!event ? (
        <LinearProgress style={{ marginTop: "4rem" }} />
      ) : (
        <div style={{ width: "80%", margin: "4rem auto" }}>
          <Container fluid="md">
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
              {activeUser && event.organizer === activeUser.id && (
                <Col xs="1">
                  <Link to={`/edit-event/${event.id}/`}>
                    <Image width={50} height={50} src="/icons/settings.png" />
                  </Link>
                </Col>
              )}
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
                attendees.map((user, i) => (
                  <Col lg={3} md={4} sm={6} xs={12}>
                    <UserCard key={i} user={user} />
                  </Col>
                ))
              ) : (
                <p style={{ color: "red" }}>No attendees found.</p>
              )}
            </Row>
            <Row>
              <Col>
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
    console.log("Reminder toggled");
  }
}
