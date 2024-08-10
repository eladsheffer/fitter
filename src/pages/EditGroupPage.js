import React, { useState, useRef, useEffect } from 'react'
import { Form, Row, Col, Button, Image, Alert } from 'react-bootstrap'
import { useSelector } from "react-redux";
import { getData, patchData, putData, deleteData } from '../features/apiService';
import { Box, Slider } from '@mui/material';
import sports from "../data-model/sports.json";
import { Link, useParams, useNavigate } from "react-router-dom";
import RemoveModal from '../components/RemoveModal';
import LinearProgress from '@mui/material/LinearProgress';

const EditGroupPage = (props) => {
    const navigate = useNavigate();
    let { id } = useParams();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;
    //const path = serverUrl + 'groups/' + props.id;
    const path = `${serverUrl}groups/${id}/`;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [cities, setCities] = useState([]);
    const [groupProfilePicture, setGroupProfilePicture] = useState(null);
    const [ageRange, setAgeRange] = useState([0, 120]);
    const [disabledAgeSlider, setDisabledAgeSlider] = useState(true);
    const [group, setGroup] = useState({});
    const [location, setLocation] = useState(null);
    const [visibility, setVisibility] = useState(null);
    const [gender, setGender] = useState(null);
    const [preferredSports, setPreferredSports] = useState([]);
    const [groupProfilePictureToShow, setGroupProfilePictureToShow] = useState(null);

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
            // cleanup
        };

    }, []);

    useEffect(() => {
    const fetchGroup = async () => {
        const groupData = await getData(path);
        console.log(groupData);
        if (!groupData) return;
        setGroup(groupData);
        setLocation(groupData.location);
        setPreferredSports(groupData.preferred_sports[0].split(","));
        setGroupProfilePictureToShow(groupData.profile_picture);
        setVisibility(groupData.visibility);
        setGender(groupData.gender);
        if (groupData.min_age || groupData.max_age)
            setAgeRange([groupData.min_age, groupData.max_age]);
    };

    fetchGroup();

    // Cleanup function if needed
    return () => {
        // cleanup
        
    };

}, []);

    const editGroup = async () => {
        setErrorMessages(null);
        setSuccessMessages(null);
        if (!activeUser) {
            alert("Please login to create a group");
            return;
        }
        
        const newGroup = new FormData();
        if (groupNameInput.current.value) {
            newGroup.append('name', groupNameInput.current.value);
        }
        if (groupDescriptionInput.current.value) {
            newGroup.append('description', groupDescriptionInput.current.value);
        }

        newGroup.append('visibility', groupVisibilityInput.current.value);
        newGroup.append('location', cityInput.current.value);
        newGroup.append('gender', genderInput.current.value);

        if (!disabledAgeSlider) {
            newGroup.append('min_age', ageRange[0]);
            newGroup.append('max_age', ageRange[1]);
        }

        if (groupProfilePicture){
            newGroup.append('profile_picture', groupProfilePicture);
        }

        if (sportsInput.current.selectedOptions.length > 0 && sportsInput.current.selectedOptions[0].value !== "") {
            newGroup.append('preferred_sports', Array.from(sportsInput.current.selectedOptions).map((option) => option.value));
        }

        //const preferred_sports = Array.from(sportsInput.current.selectedOptions).map((option) => option.value);
        //preferred_sports.forEach((sport, i) => newGroup.append(`preferred_sports[${i}]`, sport));

        console.log(newGroup);

        let group = await patchData(path, newGroup);
        if (group && group.name) {
            console.log(group.name);
            setSuccessMessages(`Group "${group.name}" updated successfully`);
        }
        else {
            setErrorMessages("Error updating group");
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

    const deleteGroup = async () => {
        const deleted = await deleteData(path);

        if (deleted) {
            navigate(-1);   
        }
        else {
            setErrorMessages("Error deleting user profile");
        }
    };


    return (
        <div>
            {!activeUser ? <Alert variant="danger">You must be logged in to view this page. <Link to="/login">Login</Link></Alert> : !group ? <LinearProgress /> :
                activeUser.id !== group.admin ? <Alert variant="danger">You are not the admin of this group. <Button variant='link' onClick={() => navigate(-1)} >Go Back</Button> </Alert> :

                    <div className="login">
                        <RemoveModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} title="Delete Group" message="Are you sure you want to delete this group?" handleRemove={deleteGroup} />
                        <Alert variant="danger" show={errorMessages}>
                            {errorMessages}
                        </Alert>
                        <Alert variant="success" show={successMessages}>
                            {successMessages}
                        </Alert>
                        <Form noValidate validated={validated}>

                            <Form.Group className="mb-3" controlId="groupName">
                                <Form.Label>Group Name</Form.Label>
                                <Form.Control type="text" placeholder="Group name is empty and will not be altered" defaultValue={group.name} ref={groupNameInput} />
                                <Form.Control.Feedback type="invalid">
                                    required field
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="groupDescription">
                                <Form.Label>Group Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Group description is empty and will not be altered" defaultValue={group.description} ref={groupDescriptionInput} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Group Visibility</Form.Label>
                                <Form.Select aria-label="Default select example" value={visibility} ref={groupVisibilityInput} onChange={(e) => setVisibility(e.target.value)}>
                                    <option>public</option>
                                    <option>private</option>
                                    <option value={"invitation_only"}>invitation only</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Select aria-label="cities" value={location} ref={cityInput} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="" checked disabled>Choose Location</option>
                                    {cities.map((city) => <option value={city} key={city}>{city}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="sports">
                                <Form.Label>Sports</Form.Label>
                                <Form.Select multiple aria-label="sports" ref={sportsInput} value={preferredSports} onChange={(e) => setPreferredSports(Array.from(e.target.selectedOptions, option => option.value))}>
                                    <option value="" disabled>Choose Sports</option>
                                    {sports.map((sport) => <option value={sport.name} key={sport.id}>{sport.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="gender">
                                <Form.Label>Gender of the Group</Form.Label>
                                <Form.Select aria-label="gender" value={gender} ref={genderInput} onChange={(e) => setGender(e.target.value)}>
                                    <option value="mixed">mixed</option>
                                    <option value="men">men</option>
                                    <option value="women">women</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Row>
                                    <Col sm={9}>
                                        <Form.Label>Group Profile Picture</Form.Label>
                                        <Form.Control type="file" accept='image/*' ref={groupProfilePictureInput} onChange={(e) => (setGroupProfilePicture((e.target.files[0])), setGroupProfilePictureToShow(URL.createObjectURL(e.target.files[0])))} />
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
                            <Button variant="primary" className="w-100" onClick={editGroup}>
                                Edit Group
                            </Button>
                            <br />
                            <br />
                            <Button variant="danger" className="w-100" onClick={()=>setShowDeleteModal(true)}>
                                Delete Group
                            </Button>
                            
                        </Form>
                    </div>}
        </div>
    );
}

export default EditGroupPage;