import React, { useEffect, useRef, useState } from 'react';
import { Form, Alert, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/user';
import { useNavigate, Link } from 'react-router-dom';
import { getData, postData } from '../features/apiService';
import { Slider } from '@mui/material';
import sports from "../data-model/sports.json";
import { Typeahead } from 'react-bootstrap-typeahead';
import PageTitle from "../components/PageTitle";

const SignupPage = (props) => {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;
    const firstNameInput = useRef(null);
    const lastNameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    // const cityInput = useRef(null);
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
    const [validated, setValidated] = useState(false);
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState([]);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [userProfilePicture, setUserProfilePicture] = useState(null);
    const [disabledWeightSlider, setDisabledWeightSlider] = useState(true);
    const [disabledHeightSlider, setDisabledHeightSlider] = useState(true);
    const [height, setHeight] = useState(165);
    const [weight, setWeight] = useState(60);


    const fetchCities = async () => {
        const data = await getData(citiesUrl);
        if (!data) return;
        const cities = data.result.records.map((city) => city.שם_ישוב.trim().replace('(', ')').replace(')', '('));
        setCities(cities);
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const signup = async () => {
        setErrorMessages(null);
        setSuccessMessages(null);

        if (!firstNameInput.current.checkValidity() || !lastNameInput.current.checkValidity() || !emailInput.current.checkValidity() || !passwordInput.current.checkValidity() || !dateOfBirthInput.current.checkValidity())
            return;

        let user = await getData(serverUrl + 'users/get_user_by_email?email=' + emailInput.current.value);

        if (user != null) {
            setErrorMessages("Email already exists. Please login or signup with another email");
            return;
        }

        let newUser = new FormData();
        newUser.append('first_name', firstNameInput.current.value);
        newUser.append('last_name', lastNameInput.current.value);
        newUser.append('email', emailInput.current.value);
        newUser.append('password', passwordInput.current.value);
        newUser.append('location', city);
        newUser.append('date_of_birth', dateOfBirthInput.current.value);
        newUser.append('gender', genderInput.current.value);
        if (sportsInput.current.selectedOptions.length > 0)
            newUser.append('preferred_sports', Array.from(sportsInput.current.selectedOptions).map((option) => option.value));
        if (userProfilePicture)
            newUser.append('profile_picture', userProfilePicture);
        if (!disabledWeightSlider)
            newUser.append('weight', weight);
        if (!disabledHeightSlider)
            newUser.append('height', height);
        newUser.append('bio', bioInput.current.value);

        let data = await postData(serverUrl + 'users/', newUser, true);
        if (!data) {
            setErrorMessages("Error creating user");
            return;
        }

        newUser = data.user;
        if (!newUser) {
            setErrorMessages("Error creating user");
            return;
        }

        dispatch(login(newUser));
        setSuccessMessages("User created successfully");
        navigate("/");
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

    let userProfilePictureToShow = userProfilePicture ? URL.createObjectURL(userProfilePicture) : null;

    return (
        <div>
            {activeUser ? navigate('/') :
                <div className="login">
                    <PageTitle title={`Fitter - Sign Up`} />
                    {props.modal ? null :
                        <>
                            <h1>Create User Account</h1>
                            <p>
                                Already a member? <Link to="/login">log in</Link>
                            </p>
                        </>
                    }
                    <Form noValidate validated={validated}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control ref={firstNameInput} type="text" placeholder="Enter your first name" required onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                                required field
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control ref={lastNameInput} type="text" placeholder="Enter your last name" required onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                                required field
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control ref={emailInput} type="email" placeholder="Enter email" required onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                                required field
                                {errorMessages}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control ref={passwordInput} type="password" placeholder="Password" required onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                                required field
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Typeahead
                                id="basic-typeahead-single"
                                labelKey="name"
                                onChange={setCity}
                                options={cities}
                                placeholder="Choose location"
                                selected={city}
                                required
                            />
                        </Form.Group>

                        {/* <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Select aria-label="cities" ref={cityInput} required>
                            <option value="" disabled checked>Choose Location</option>
                            {cities.map((city) => <option value={city} key={city}>{city}</option>)}
                        </Form.Select>
                    </Form.Group> */}
                        <Form.Group className="mb-3" controlId="date-of-birth">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" ref={dateOfBirthInput} required />
                            <Form.Control.Feedback type="invalid">
                                required field
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Select aria-label="gender" ref={genderInput}>
                            <option value="" disabled checked>Your Gender</option>
                            <option value="male">male</option>
                            <option value="female">female</option>
                            <option value="prefer_not_to_say">prefer not to say</option>
                        </Form.Select>
                        <Form.Group className="mb-3" controlId="sports">
                            <Form.Label>Sports</Form.Label>
                            <Form.Select multiple aria-label="sports" ref={sportsInput}>
                                <option value="" disabled>Choose Sports</option>
                                {sports.map((sport) => <option value={sport.name} key={sport.id}>{sport.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Row>
                                <Col sm={9}>
                                    <Form.Label>User Profile Picture</Form.Label>
                                    <Form.Control type="file" accept='image/*' ref={userProfilePictureInput} onChange={(e) => setUserProfilePicture((e.target.files[0]))} />
                                </Col>
                                <Col sm={3}>
                                    <Image src={userProfilePictureToShow} ref={userProfileImg} fluid />
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
                                defaultValue={170} aria-label="Default" valueLabelDisplay="auto" />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='weight'>
                            <Form.Check type="checkbox" label="Weight (Kg.) Optional" onChange={() => setDisabledWeightSlider(!disabledWeightSlider)} />
                            <Slider ref={weightSliderInput} disabled={disabledWeightSlider}
                                min={10}
                                max={150}
                                value={weight}
                                onChange={(event, value) => handleWeightChange(event, value)}
                                defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='bio'>
                            <Form.Label>Bio (Optional)</Form.Label>
                            <Form.Control as="textarea" placeholder="Tell us about yourself" rows={3} ref={bioInput} />
                        </Form.Group>
                        <Alert variant="danger" show={errorMessages}>
                            {errorMessages}
                        </Alert>
                        <Alert variant="success" show={successMessages}>
                            {successMessages}
                        </Alert>
                        <Button type="button" className="w-100" onClick={signup}>
                            Sign Up
                        </Button>
                    </Form>
                </div>
            }
        </div>
    );
};

export default SignupPage;