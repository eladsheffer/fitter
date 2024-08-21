import { useState } from "react";
import {
  DropdownButton,
  Button,
  Dropdown,
  Row,
  Col,
  Container,
  Image,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
//import events from "../data-model/events.json";
import { useSelector, useDispatch } from "react-redux";
import EventModal from "../components/EventModal";
import RootDialog from "../components/RootDialog";
import RootModal from "../components/RootModal";
import { renderModalType } from "../features/modal";
import { useEffect } from "react";
import sports from "../data-model/sports.json";
import EventCard3 from "../components/EventCard3";

const EventsPage = () => {
  // States
  const [sport, setSport] = useState("Any Sport");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();

  const defaultEventImage = "/icons/event.png";

  const activeUser = useSelector((state) => state.user.value);
  const eventUpdated = useSelector((state) => state.events.value.eventUpdated);

  const type = activeUser ? "Event" : "Signup";

  // Functions
  dispatch(renderModalType({ type: type }));

  function onChange(newDate) {
    setDate(newDate);
  }

  async function getEvents() {
    const url = `${process.env.REACT_APP_SERVER_URL}events`;
    const req = await fetch(url);
    const res = await req.json();
    setEvents(res.results);
  }

  function formatFriendlyDate(isoDateString) {
    // Creating a date object from the ISO string
    const date = new Date(isoDateString);

    // Converting to a more readable format
    const friendlyDate = date.toLocaleString("en-GB", {
      weekday: "long", // long name of the day
      year: "numeric", // numeric year
      month: "2-digit", // two digit month
      day: "2-digit", // two digit day
      hour: "numeric", // numeric hour (12-hour clock)
      minute: "2-digit", // two digit minutes
      hour12: true, // use 12-hour clock
    });

    return friendlyDate;
  }

  useEffect(() => {
    getEvents();
  }, [eventUpdated]);

  // UI
  return (
    <div>
      <div style={{ width: "95%", marginInline: "auto", marginTop: "4rem" }}>
        <Container>
          <Row>
            <Col xs="8">
            </Col>
            <Col xs="1">Create New Event</Col>
            <Col xs="3">{activeUser ? <RootDialog /> : <RootModal />}</Col>
          </Row>
          <Row className="mt-5 gap-5">
            <Col xs="auto" className="p-0">
              <Calendar
                onChange={onChange}
                value={date}
                showNeighboringMonth={false}
                className="border rounded"
              />
            </Col>
            <Col className="p-0">
              {/* Filter Navbar */}
              <Row className="gap-5 align-middle">
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown1" style={{ borderRadius: "20px" }}>
                      Any Sports
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {sports.map((sport, i) => (
                        <Dropdown.Item key={i}>{sport.name}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col>
                  <Button variant="link">Reset</Button>
                </Col>
              </Row>
              {/* Events */}
              <Row>
                <h2 className="mt-5 p-0">{`Events - ${date.getDate()}/${date.getMonth() + 1
                  }/${date.getFullYear()}`}</h2>
                {events.map((event, i) => (
                 <EventCard3 event={event} key={i} />
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EventsPage;
