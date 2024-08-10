import React, { useState, useRef, useEffect } from 'react'
import { Form, Row, Col, Container, Button, Modal, Image, Alert } from 'react-bootstrap'
import { useSelector } from "react-redux";
import { getData, postData } from '../features/apiService';
import { Box, Slider } from '@mui/material';
import sports from "../data-model/sports.json";

const NewGroupPage = () => {

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;
    const [validated, setValidated] = useState(false);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [cities, setCities] = useState([]);
    const [groupProfilePicture, setGroupProfilePicture] = useState(null);
    const [ageRange, setAgeRange] = useState([20, 40]);
    const [disabledAgeSlider, setDisabledAgeSlider] = useState(true);

    const groupNameInput = useRef(null);
    const groupDescriptionInput = useRef(null);
    const groupVisibilityInput = useRef(null);
    const cityInput = useRef(null);
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
            const cities = data.result.records.map((city) => city.שם_ישוב.trim().replace('(', ')').replace(')', '('));
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

        if (!groupNameInput.current.checkValidity() || !groupDescriptionInput.current.checkValidity() || !groupVisibilityInput.current.checkValidity())
            return;
        const newGroup = new FormData();
        newGroup.append('admin', activeUser.id);
        newGroup.append('name', groupNameInput.current.value);
        newGroup.append('description', groupDescriptionInput.current.value);
        newGroup.append('visibility', groupVisibilityInput.current.value);
        newGroup.append('location', cityInput.current.value ? cityInput.current.value : null);
        newGroup.append('min_age', disabledAgeSlider ? 0 : ageRange[0]);
        newGroup.append('max_age', disabledAgeSlider ? 120 : ageRange[1]);
        newGroup.append('profile_picture', groupProfilePicture);
        newGroup.append('gender', genderInput.current.value);
        const preferred_sports = Array.from(sportsInput.current.selectedOptions).map((option) => option.value);
        preferred_sports.forEach((sport, i) => newGroup.append(`preferred_sports[${i}]`, sport));

        console.log(newGroup);

        let path = serverUrl + 'groups/';
        let group = await postData(path, newGroup);
        if (group && group.name) {
            console.log(group.name);
            setSuccessMessages(`Group "${group.name}" created successfully`);
        }
        else {
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

    let groupProfilePictureToShow = groupProfilePicture ? URL.createObjectURL(groupProfilePicture) : null;


    return (
        <div className="login">
            <Alert variant="danger" show={errorMessages}>
                {errorMessages}
            </Alert>
            <Alert variant="success" show={successMessages}>
                {successMessages}
            </Alert>
            <Form noValidate validated={validated}>

                <Form.Group className="mb-3" controlId="groupName">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter group name" required ref={groupNameInput} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        required field
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="groupDescription">
                    <Form.Label>Group Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter group description" required ref={groupDescriptionInput} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        required field
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Group Visibility</Form.Label>
                    <Form.Select aria-label="Default select example" required ref={groupVisibilityInput}>
                        <option>public</option>
                        <option>private</option>
                        <option value={"invitation_only"}>invitation only</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        required field
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Select aria-label="cities" ref={cityInput}>
                        <option value="" disabled checked>Choose Location</option>
                        {cities.map((city) => <option value={city} key={city}>{city}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="sports">
                    <Form.Label>Sports</Form.Label>
                    <Form.Select multiple aria-label="sports" ref={sportsInput}>
                        <option value="" disabled>Choose Sports</option>
                        {sports.map((sport) => <option value={sport.name} key={sport.id}>{sport.name}</option>)}
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
                        <Col sm={9}>
                            <Form.Label>Group Profile Picture</Form.Label>
                            <Form.Control type="file" accept='image/*' ref={groupProfilePictureInput} onChange={(e) => setGroupProfilePicture((e.target.files[0]))} />
                        </Col>
                        <Col sm={3}>
                            <Image src={groupProfilePictureToShow} ref={groupProfileImg} fluid />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="min-max">
                    <Form.Check type="checkbox" label="Group Age Range (Optional)" onChange={() => setDisabledAgeSlider(!disabledAgeSlider)} />
                    <Slider ref={ageSliderInput}
                        getAriaLabel={() => 'Minimum distance'}
                        value={ageRange}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        // getAriaValueText={valuetext}
                        disableSwap
                        disabled={disabledAgeSlider}
                        max={120}
                    />
                </Form.Group>
                <Box sx={{ width: 300 }}>

                </Box>
                <Button variant="primary" className="w-100" onClick={createGroup}>
                    Create Group
                </Button>
            </Form>
        </div>
    );
}

export default NewGroupPage;