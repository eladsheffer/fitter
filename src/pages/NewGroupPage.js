import React, { useState, useRef, useEffect } from "react";
import { Form, Row, Col, Button, Image, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getData, postData } from "../features/apiService";
import { Box, Slider } from "@mui/material";
import sports from "../data-model/sports.json";
import { Typeahead } from "react-bootstrap-typeahead";
import { closeModal } from "../features/modal";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import LinearProgress from '@mui/material/LinearProgress';

const NewGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const citiesUrl = process.env.REACT_APP_CITIES_URL;
  const [validated, setValidated] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const [successMessages, setSuccessMessages] = useState(null);
  const [cities, setCities] = useState([]);
  const [groupProfilePicture, setGroupProfilePicture] = useState(null);
  const [ageRange, setAgeRange] = useState([20, 40]);
  const [loading, setLoading] = useState(false);
  const [disabledAgeSlider, setDisabledAgeSlider] = useState(true);
  const [city, setCity] = useState(null);

  const groupNameInput = useRef(null);
  const groupDescriptionInput = useRef(null);
  const groupProfilePictureInput = useRef(null);
  const groupProfileImg = useRef(null);
  const genderInput = useRef(null);
  const ageSliderInput = useRef(null);
  const sportsInput = useRef(null);

  const activeUser = useSelector((state) => state.user.value);

  useEffect(() => {
    const fetchCities = async () => {
      const data = await getData(citiesUrl);
      if (!data) return;
      const cities = data.result.records.map((city) =>
        city.שם_ישוב.trim().replace("(", ")").replace(")", "(")
      );
      setCities(cities);
    };

    fetchCities();

    // Cleanup function if needed
    return () => {
      // Cleanup code here, if any
    };
  }, []);

  const createGroup = async () => {
    setErrorMessages(null);
    setSuccessMessages(null);
    if (!activeUser) {
      alert("Please login to create a group");
      return;
    }

    if (
      !groupNameInput.current.checkValidity() ||
      !groupDescriptionInput.current.checkValidity()
    )
      return;

    setLoading(true);

    const newGroup = new FormData();
    newGroup.append("admin", activeUser.id);
    newGroup.append("name", groupNameInput.current.value);
    newGroup.append("description", groupDescriptionInput.current.value);
    newGroup.append("location", city);
    newGroup.append("min_age", disabledAgeSlider ? 0 : ageRange[0]);
    newGroup.append("max_age", disabledAgeSlider ? 120 : ageRange[1]);
    if (groupProfilePicture)
      newGroup.append("profile_picture", groupProfilePicture);
    newGroup.append("gender", genderInput.current.value);
    const preferred_sports = Array.from(
      sportsInput.current.selectedOptions
    ).map((option) => option.value);
    preferred_sports.forEach((sport, i) =>
      newGroup.append(`preferred_sports[${i}]`, sport)
    );

    let path = serverUrl + "groups/";
    let group = await postData(path, newGroup);

    setLoading(false);

    if (group && group.name) {
      console.log("response data: ", group);
      setSuccessMessages(`Group "${group.name}" created successfully`);
    } else {
      setErrorMessages("Error creating group");
    }
  };

  const handleChange = (event) => {
    setErrorMessages(null);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const handleSliderChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setAgeRange([Math.min(newValue[0], ageRange[1]), ageRange[1]]);
    } else {
      setAgeRange([ageRange[0], Math.max(newValue[1], ageRange[0])]);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    navigate(-1);
  };

  let groupProfilePictureToShow = groupProfilePicture
    ? URL.createObjectURL(groupProfilePicture)
    : null;

  return (
    <div className="login">
      <PageTitle title={`Fitter - Create Group`} />
      <Form noValidate validated={validated}>
        <Form.Group className="mb-3" controlId="groupName">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter group name"
            required
            ref={groupNameInput}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            required field
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="groupDescription">
          <Form.Label>Group Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter group description"
            required
            ref={groupDescriptionInput}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            required field
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(selected) => setCity(selected[0])}
            options={cities}
            placeholder="Choose location"
            required
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Select aria-label="cities" ref={cityInput}>
                        <option value="" disabled checked>Choose Location</option>
                        {cities.map((city) => <option value={city} key={city}>{city}</option>)}
                    </Form.Select>
                </Form.Group> */}
        <Form.Group className="mb-3" controlId="sports">
          <Form.Label>Sports</Form.Label>
          <Form.Select multiple aria-label="sports" ref={sportsInput}>
            <option value="" disabled>
              Choose Sports
            </option>
            {sports.map((sport) => (
              <option value={sport.name} key={sport.id}>
                {sport.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="gender">
          <Form.Label>Gender of the Group</Form.Label>
          <Form.Select aria-label="gender" ref={genderInput}>
            <option value="mixed">mixed</option>
            <option value="men">male</option>
            <option value="women">female</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Form.Label>Group Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                ref={groupProfilePictureInput}
                onChange={(e) => setGroupProfilePicture(e.target.files[0])}
              />
            </Col>
          </Row>
          <Row className="my-3">
            <Col lg={7} md={7} sm={7} xs={7}>
              <Image
                src={groupProfilePictureToShow}
                ref={groupProfileImg}
                fluid
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3" controlId="min-max">
          <Form.Check
            type="checkbox"
            label="Group Age Range (Optional)"
            onChange={() => setDisabledAgeSlider(!disabledAgeSlider)}
          />
          <Slider
            ref={ageSliderInput}
            getAriaLabel={() => "Minimum distance"}
            value={ageRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            // getAriaValueText={valuetext}
            disableSwap
            disabled={disabledAgeSlider}
            max={120}
          />
        </Form.Group>
        <Box sx={{ width: 300 }}></Box>
        {loading && <LinearProgress />}
        <Alert variant="danger" show={errorMessages}>
          {errorMessages}
        </Alert>
        <Alert variant="success" show={successMessages}>
          {successMessages}
        </Alert>
        <Button variant="primary" className="w-100" onClick={createGroup}>
          Create Group
        </Button>
        <br />
        <br />
        <Button variant="info" className="w-100" onClick={() => handleClose()}>
          Back
        </Button>
      </Form>
    </div>
  );
};

export default NewGroupPage;
