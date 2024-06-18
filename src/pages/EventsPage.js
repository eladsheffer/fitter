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

const EventsPage = () => {
  // States
  const [sport, setSport] = useState("Any Sport");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();

  const activeUser = useSelector((state) => state.user.value);

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
    console.log(res.results);
    setEvents(res.results);
  }

  function formatFriendlyDate(isoDateString) {
    // Creating a date object from the ISO string
    const date = new Date(isoDateString);

    // Converting to a more readable format
    const friendlyDate = date.toLocaleString("en-US", {
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
  }, []);

  // UI
  return (
    <div>
      <div style={{ width: "70%", marginInline: "auto", marginTop: "4rem" }}>
        <Container>
          <Row className="gap-5">
            <Col>
              <h1>
                Hello {activeUser !== null ? activeUser.first_name : "guest"} 👋
              </h1>
            </Col>
            <Col xs="5"></Col>
            <Col>{activeUser ? <RootDialog /> : <RootModal />}</Col>
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
                  <DropdownButton id="dropdown-sports" title={sport}>
                    <Dropdown.Item
                      onClick={() => setSport("Basketball")}
                      href="#/action-1"
                    >
                      Basketball
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setSport("Soccer")}
                      href="#/action-2"
                    >
                      Soccer
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setSport("Tenis")}
                      href="#/action-3"
                    >
                      Tenis
                    </Dropdown.Item>
                  </DropdownButton>
                </Col>
                <Col>
                  <DropdownButton id="dropdown-sports" title={sport}>
                    <Dropdown.Item
                      onClick={() => setSport("Basketball")}
                      href="#/action-1"
                    >
                      Basketball
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setSport("Soccer")}
                      href="#/action-2"
                    >
                      Soccer
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setSport("Tenis")}
                      href="#/action-3"
                    >
                      Tenis
                    </Dropdown.Item>
                  </DropdownButton>
                </Col>
                <Col>
                  <Button variant="link">Reset</Button>
                </Col>
              </Row>
              {/* Events */}
              <Row>
                <h2 className="mt-5 p-0">{`Events - ${date.getDate()}/${
                  date.getMonth() + 1
                }/${date.getFullYear()}`}</h2>
                {events.map((event, i) => (
                  <div key={i}>
                    <hr />
                    <Row>
                      <Col xs="auto">
                        <Link to={`${event.id}`}>
                          <Image
                            src={event.image}
                            alt="Event thumbnail"
                            width={100}
                            height={100}
                          />
                        </Link>
                      </Col>
                      <Col>
                        <Link to={`${event.id}`}>
                          <h3>{event.title}</h3>
                        </Link>
                        <h5>{formatFriendlyDate(event.date_and_time)}</h5>
                        <p>{event.description}</p>
                        <Row className="justify-between gap-5">
                          <Col xs={4}>
                            {event.max_participants !== null &&
                            typeof event.max_participants === "number" ? (
                              <h6>{`${event.users_attended.length}/${event.max_participants} Attendees`}</h6>
                            ) : (
                              <h6>{`${event.users_attended.length} Attendees`}</h6>
                            )}
                          </Col>
                          <Col xs={{ span: 4, offset: 2 }}>
                            <h6>{event.location}</h6>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
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
