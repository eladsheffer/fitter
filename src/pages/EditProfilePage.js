import React, { useEffect, useRef, useState } from 'react';
import { Form, Alert, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/user';
import { useNavigate, Link } from 'react-router-dom';
import { getData, postData, patchData, deleteData } from '../features/apiService';
import { Slider } from '@mui/material';
import sports from "../data-model/sports.json";
import { useSelector } from 'react-redux';
import RemoveModal from '../components/RemoveModal';
import { Typeahead } from 'react-bootstrap-typeahead';
import { closeModal } from '../features/modal';

const EditProfilePage = (props) => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;
    const firstNameInput = useRef(null);
    const lastNameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const dateOfBirthInput = useRef(null);
    const genderInput = useRef(null);
    const sportsInput = useRef(null);
    const userProfilePictureInput = useRef(null);
    const userProfileImg = useRef(null);
    const weightSliderInput = useRef(null);
    const heightSliderInput = useRef(null);
    const bioInput = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteProfileModalShow, setDeleteProfileModalShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [cities, setCities] = useState([]);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [userProfilePicture, setUserProfilePicture] = useState(null);
    const [userProfilePictureToShow, setUserProfilePictureToShow] = useState(activeUser ? activeUser.profile_picture : null);
    const [disabledWeightSlider, setDisabledWeightSlider] = useState(true);
    const [disabledHeightSlider, setDisabledHeightSlider] = useState(true);
    const [height, setHeight] = useState(activeUser && activeUser.height ? activeUser.height : 165);
    const [weight, setWeight] = useState(activeUser && activeUser.weight ? activeUser.weight : 60);
    const [city, setCity] = useState(activeUser ? activeUser.location : "");
    const [gender, setGender] = useState(activeUser ? activeUser.gender : "");
    const [preferredSports, setPreferredSports] = useState(activeUser && activeUser.preferred_sports.length > 0 ? activeUser.preferred_sports: []);


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

    const updateProfile = async () => {
        setErrorMessages(null);
        setSuccessMessages(null);

        if (!emailInput.current.checkValidity())
            return;

        let user = await getData(serverUrl + 'users/get_user_by_email?email=' + emailInput.current.value);

        if (user == null) {
            setErrorMessages("No such user exists");
            return;
        }

        let newUser = new FormData();

        if (firstNameInput.current.value) {
            newUser.append('first_name', firstNameInput.current.value);
        }
        if (lastNameInput.current.value) {
            newUser.append('last_name', lastNameInput.current.value);
        }
        if (emailInput.current.value) {
            newUser.append('email', emailInput.current.value);
        }
        if (passwordInput.current.value) {
            newUser.append('password', passwordInput.current.value);
        }
        newUser.append('location', city);
        newUser.append('date_of_birth', dateOfBirthInput.current.value);
        newUser.append('gender', genderInput.current.value);
        // const preferred_sports = Array.from(sportsInput.current.selectedOptions).map((option) => option.value);
        // preferred_sports.forEach((sport, i) => newUser.append(`preferred_sports[${i}]`, sport));
        if (sportsInput.current.selectedOptions.length > 0 && sportsInput.current.selectedOptions[0].value !== "")
            newUser.append('preferred_sports', Array.from(sportsInput.current.selectedOptions).map((option) => option.value));
        if (userProfilePicture)
            newUser.append('profile_picture', userProfilePicture);
        if (!disabledHeightSlider)
            newUser.append('height', height);
        if (!disabledWeightSlider)
            newUser.append('weight', weight);

        newUser.append('bio', bioInput.current.value);

        newUser = await patchData(serverUrl + 'users/' + activeUser.id + "/", newUser);
        if (newUser) {
            dispatch(login(newUser));
            setSuccessMessages("User profile updated successfully");
        }
        else {
            setErrorMessages("Error updating user profile");
        }
    };

    const handleChange = (event) => {
        const control = event.currentTarget;

        if (control.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const handleWeightChange = (event, value) => {
        setWeight(value);
    };

    const handleHeightChange = (event, value) => {
        setHeight(value);
    };

    const handleDelete = async () => {
        setDeleteProfileModalShow(false);
        const deleted = await deleteData(`${serverUrl}users/${activeUser.id}/`);
        if (deleted) {
            dispatch(logout());
            navigate('/');
        }
        else {
            setErrorMessages("Error deleting user profile");
        }
    };

    const handleClose = () => {
        dispatch(closeModal());
        navigate(-1);
    };

    const removePicture = async () => {
        if (!activeUser) {
            setErrorMessages("No user logged in");
            return;
        }
            
        setUserProfilePicture(null);
        setUserProfilePictureToShow(null);
        
        const deleteImage = await postData(`${serverUrl}users/${activeUser.id}/remove_profile_picture/`, null);
        if (deleteImage) {
            setSuccessMessages("Profile picture removed successfully");
        }
        else {
            setErrorMessages("Error removing profile picture");
        }

    };

    return (
        <div className='login'>
            {!activeUser ? <Alert variant="danger">You must be logged in to view this page. <Link to="/login">Login</Link></Alert> :
                <div className="login">
                    <RemoveModal show={deleteProfileModalShow} handleClose={() => setDeleteProfileModalShow(false)} title="Delete Profile" message="Are you sure you want to delete your profile?" handleRemove={handleDelete} />
                    <Form noValidate validated={validated}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control ref={firstNameInput} type="text" placeholder="First name is empty and will not be altered" onChange={handleChange}
                                defaultValue={activeUser ? activeUser.first_name : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control ref={lastNameInput} type="text" placeholder="Last name is empty and will not be altered" onChange={handleChange}
                                defaultValue={activeUser ? activeUser.last_name : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control ref={emailInput} type="email" placeholder="email is empty and will not be altered" onChange={handleChange}
                                defaultValue={activeUser ? activeUser.email : ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                required field
                                {errorMessages}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control ref={passwordInput} type="password" placeholder="Password is empty and will not be altered" onChange={handleChange}
                                defaultValue={activeUser ? activeUser.password : ""}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Typeahead
                                id="basic-typeahead-single"
                                labelKey="name"
                                onChange={(selected) => setCity(selected)}
                                options={cities}
                                placeholder="Choose location"
                                defaultInputValue={city}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date-of-birth">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" ref={dateOfBirthInput}
                                defaultValue={activeUser ? activeUser.date_of_birth : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select aria-label="gender" ref={genderInput} value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="" disabled>Your Gender</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                <option value="prefer_not_to_say">prefer not to say</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="sports">
                            <Form.Label>Sports</Form.Label>
                            <Form.Select multiple aria-label="sports" ref={sportsInput} value={preferredSports} onChange={(e) => setPreferredSports(Array.from(e.target.selectedOptions, option => option.value))}>
                                <option value="" disabled>Choose Sports</option>
                                {sports.map((sport) => <option value={sport.name} key={sport.id}>{sport.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Row>
                                <Col sm={9}>
                                    <Form.Label>User Profile Picture</Form.Label>
                                    <Form.Control type="file" accept='image/*' ref={userProfilePictureInput} onChange={(e) => (setUserProfilePicture((e.target.files[0])), setUserProfilePictureToShow(URL.createObjectURL(e.target.files[0])))} />
                                </Col>
                                </Row>
                                <Row>
                                <Col xs={7}>
                                    <Image src={userProfilePictureToShow} ref={userProfileImg} fluid />
                                </Col>
                                <Col xs={2} style={{margin:"auto"}}>
                                <Button variant='danger' type="button" onClick={removePicture}>
                                    Remove Picture
                                </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='height'>
                            <Form.Check type="checkbox" label="Height (cm) Optional" onChange={() => setDisabledHeightSlider(!disabledHeightSlider)} />
                            <Slider ref={heightSliderInput} disabled={disabledHeightSlider}
                                min={100}
                                max={220}
                                value={height}
                                onChange={(event, value) => handleHeightChange(event, value)}
                                defaultValue={activeUser.height} aria-label="Default" valueLabelDisplay="auto" />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='weight'>
                            <Form.Check type="checkbox" label="Weight (Kg.) Optional" onChange={() => setDisabledWeightSlider(!disabledWeightSlider)} />
                            <Slider ref={weightSliderInput} disabled={disabledWeightSlider}
                                min={10}
                                max={150}
                                value={weight}
                                onChange={(event, value) => handleWeightChange(event, value)}
                                defaultValue={activeUser.weight} aria-label="Default" valueLabelDisplay="auto" />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='bio'>
                            <Form.Label>Bio (Optional)</Form.Label>
                            <Form.Control as="textarea" placeholder="Tell us about yourself" rows={3} ref={bioInput}
                                defaultValue={activeUser ? activeUser.bio : ""}
                            />
                        </Form.Group>
                        <Alert variant="danger" show={errorMessages}>
                            {errorMessages}
                        </Alert>
                        <Alert variant="success" show={successMessages}>
                            {successMessages}
                        </Alert>
                        <Button type="button" className="w-100" onClick={updateProfile}>
                            Update Profile
                        </Button>
                        <br />
                        <br />
                        <Button type="button" variant='danger' className="w-100" onClick={() => setDeleteProfileModalShow(true)}>
                            Delete Profile
                        </Button>
                        <br />
                        <br />
                        <Button type="button" variant="info" className="w-100" onClick={()=>handleClose()}>
                            Back
                        </Button>
                    </Form>
                </div>}
        </div>
    );
};

export default EditProfilePage;