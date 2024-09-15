import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Image, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateEvent } from "../features/events";
import { postData } from "../features/apiService";
import { formatFriendlyDate } from "../features/apiService";

const EventCard3 = (props) => {
  const event = props.event;
  const render = props.render;
  const narrowView = props.narrowView;
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeUser = useSelector((state) => state.user.value);
  const ageCalc = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const isEventRelevant = (event) => {
    if (activeUser && activeUser.id) {
      const userAge = ageCalc(activeUser.date_of_birth);
      let result = true;
      if (event.min_age && userAge < event.min_age) {
        result = false;
      }
      if (event.max_age && userAge > event.max_age) {
        result = false;
      }
      if (
        (event.gender === "men" && activeUser.gender === "female") ||
        (event.gender === "women" && activeUser.gender === "male")
      ) {
        result = false;
      }
      if (
        event.max_participants &&
        event.users_attended &&
        event.max_participants <= event.users_attended.length
      ) {
        result = false;
      }
      return result;
    }
  };

  const defaultEventImage = "/icons/event.png";
  const image = event.image ? event.image : defaultEventImage;
  const attendeeIcon = "/icons/success.png";
  const organizerIcon = "/icons/admin.png";

  const [isAttendee, setIsAttendee] = useState(
    activeUser && event ? event.users_attended.includes(activeUser.id) : false
  );
  const [isOrganizer, setIsOrganizer] = useState(
    activeUser && event ? event.organizer === activeUser.id : false
  );
  const [numOfAttendees, setNumOfAttendees] = useState(
    event.users_attended.length
  );

  const editEvent = () => {
    navigate(`/edit-event/${event.id}`);
  };

  const joinEvent = async () => {
    if (!activeUser) {
      navigate("/login");
      return;
    }

    let url = serverUrl + `events/${event.id}/add_user/`;
    let data = {
      user_id: activeUser.id,
    };
    let response = await postData(url, data);

    if (response) {
      dispatch(updateEvent());
      if (!render) {
        setIsAttendee(true);
        setNumOfAttendees(numOfAttendees + 1);
      }
    } else {
      console.error("Error joining event:", response);
    }
  };

  const leaveEvent = async () => {
    let url = serverUrl + `events/${event.id}/remove_user/`;
    let data = {
      user_id: activeUser.id,
    };
    let response = await postData(url, data);
    if (response) {
      dispatch(updateEvent());
      if (!render) {
        setIsAttendee(false);
        setIsOrganizer(false);
        setNumOfAttendees(numOfAttendees - 1);
      }
    } else {
      console.error("Error leaving event: ", response);
    }
  };

  const removeEvent = () => {
    console.log("Remove event:", event);
  };

  return (
    <div>
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

        <Col
          lg={6}
          md={6}
          sm={6}
          xs="6"
          style={{
            textWrap: "wrap",
            whiteSpace: "wrap",
            textOverflow: "ellipsis",
            overflowX: "hidden",
          }}
        >
          <Row>
            <Link
              to={`/events/${event.id}/`}
              style={{ textDecoration: "none" }}
            >
              <h5>{event.title}</h5>
            </Link>
            <h5>{formatFriendlyDate(event.date_and_time, "time")}</h5>

            <Col>
              <h6>{event.location}</h6>
              <h6>{`Gender: ${event.gender}`}</h6>
              <h6>{`Ages: ${event.min_age ? event.min_age : "0"} - ${
                event.max_age ? event.max_age : "120"
              }`}</h6>
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
            <h6>{`${numOfAttendees}/${event.max_participants} Attendees`}</h6>
          ) : (
            <h6>{`${numOfAttendees} Attendees`}</h6>
          )}
        </Col>
      </Row>
      {!narrowView && (
        <>
          <Row className="justify-between gap-5">
            <Col>
              {activeUser === null ? (
                <>
                  <Button variant="outline-warning" onClick={joinEvent}>
                    Join
                  </Button>
                </>
              ) : isOrganizer ? (
                <>
                  <Button variant="outline-primary" onClick={editEvent}>
                    Edit Event
                  </Button>
                </>
              ) : isAttendee ? (
                <>
                  <Button variant="outline-info" onClick={leaveEvent}>
                    Leave
                  </Button>
                </>
              ) : (
                <>
                  {isEventRelevant(event) ? (
                    <Button variant="outline-warning" onClick={joinEvent}>
                      Join
                    </Button>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </Col>
          </Row>

          {activeUser && isAttendee && (
            <Row>
              <Col
                xs="auto"
                style={{
                  paddingRight: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src={attendeeIcon}
                  alt="Member icon"
                  width={20}
                  height={20}
                />
              </Col>
              <Col
                className="text-start"
                xs="auto"
                style={{
                  paddingLeft: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h5
                  style={{
                    color: "green",
                    marginLeft: "5px",
                    marginTop: "6px",
                  }}
                >
                  Attendee
                </h5>
              </Col>
              {isOrganizer && (
                <>
                  <Col
                    xs="auto"
                    style={{
                      paddingLeft: "0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={organizerIcon}
                      alt="Organizer icon"
                      width={30}
                      height={30}
                    />
                  </Col>
                  <Col
                    className="text-start"
                    xs="auto"
                    style={{
                      paddingLeft: "0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <h5
                      style={{
                        color: "blue",
                        marginLeft: "5px",
                        marginTop: "6px",
                      }}
                    >
                      organizer
                    </h5>
                  </Col>
                </>
              )}
            </Row>
          )}
        </>
      )}
      <hr />
    </div>
  );
};

export default EventCard3;
