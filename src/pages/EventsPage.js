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
import { formatFriendlyDate } from "../features/apiService";

const EventsPage = () => {
  // States
  const [sport, setSport] = useState("Any Sport");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState(['2024-08-01', '2024-08-14', '2024-08-31']);
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
  
  const compareDates = (a, b) => {
    return a.slice(0, 10) === b.slice(0, 10);
  };

  async function getEvents() {
    const url = `${process.env.REACT_APP_SERVER_URL}events`;
    const req = await fetch(url);
    const res = await req.json();
    setEvents(res.results.sort((a, b) => new Date(a.date_and_time) - new Date(b.date_and_time)));
    setEventDates(res.results.map((event) =>  event.users_attended.includes(activeUser.id) && event.date_and_time.slice(0, 10)));
  }

  // Effects
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
                showNeighboringMonth={true}
                tileClassName={({ date }) =>{
                  let day = date.getDate();
                  let month = date.getMonth() + 1;
                  if (date.getMonth() < 10) 
                    month = "0" + month;
                  if (date.getDate() < 10)
                    day = "0" + day;  
                  let formattedDate = `${date.getFullYear()}-${month}-${day}`;
                return eventDates.find(val=> val===formattedDate) ? "highlight" : null;
                }}

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
                {/* {events.map((event, i) => (
                  <>
                  {
                  <h5>{formatFriendlyDate(event.date_and_time, "time")}</h5>}
                 <EventCard3 event={event} key={i} />
                 </>
                ))} */}

<>
      {events.map((event, i) => {
        // Get the date part of the current event
        

        let isDifferentDate = true;
        if (i > 0) {
          // Get the date part of the previous event
          isDifferentDate = events[i - 1].date_and_time.slice(0, 10) !== event.date_and_time.slice(0, 10);
        }
        

        return (
          <>
            {isDifferentDate && <h3 style={{color: "blue", fontWeight:"bold", borderBottom:"5px solid", marginTop:"2rem"}}>{formatFriendlyDate(event.date_and_time)}</h3>}
            <EventCard3 event={event} key={i}/>
          </>
        );
      })}
    </>



              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EventsPage;
