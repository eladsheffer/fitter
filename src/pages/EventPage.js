import React, { useEffect, useState } from "react";
import FitterNavbar from "../components/FitterNavbar";
import { Container, Image, Row, Col } from "react-bootstrap";
import logo from "@/../../public/icons/fitter-logo.jpg";
import { useParams } from "react-router-dom";
import events from "../data-model/events.json";

export default function EventPage() {
  let { id } = useParams();
  let eventData = events.find((e) => e.id === id);
  const [event, setEvent] = useState(eventData);

  return (
    <div>
      <FitterNavbar />
      <div style={{ width: "70%", marginInline: "auto", marginTop: "4rem" }}>
        <Container>
          <Row className="gap-5">
            <Col xs="auto" className="px-10">
              <Image src={logo} width={300} height={250} />
            </Col>
            <Col>
              <h1>{event.name}</h1>
              <h2>{event.date}</h2>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
