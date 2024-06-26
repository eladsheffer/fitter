import React, { useEffect, useRef, useState } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useNavigate, Link } from 'react-router-dom';
import { getData, postData } from '../features/apiService';
import { showModal, closeModal } from '../features/modal';

const SignupPage = (props) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;
    const firstNameInput = useRef(null);
    const lastNameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const addressInput = useRef(null);
    const cityInput = useRef(null);
    const dateOfBirthInput = useRef(null);
    const maleInput = useRef(null);
    const femaleInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [cities, setCities] = useState([]);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);

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

        let newUser = {
            first_name: firstNameInput.current.value,
            last_name: lastNameInput.current.value,
            email: emailInput.current.value,
            password: passwordInput.current.value,
            //address: addressInput.current.value,
            location: cityInput.current.value,
            date_of_birth: dateOfBirthInput.current.value,
            gender: maleInput.current.checked ? "male" : "female",
        };

        console.log(newUser);
        newUser = await postData(serverUrl + 'users/', newUser);
        if (newUser) {
            dispatch(login(newUser));
            setSuccessMessages("User created successfully");
            navigate("/");
        }
        else {
            setErrorMessages("Error creating user");
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

    return (
        <div>
            <div className="login">
                {props.modal ? null :
                    <>
                        <h1>Create User Account</h1>
                        <p>
                            Already a member? <Link to="/login">log in</Link>
                        </p>
                    </>
                }
                <Alert variant="danger" show={errorMessages}>
                    {errorMessages}
                </Alert>
                <Alert variant="success" show={successMessages}>
                    {successMessages}
                </Alert>
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

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control ref={addressInput} type="text" placeholder="Enter address" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Select aria-label="cities" ref={cityInput} required>
                            <option value="">Choose Location</option>
                            {cities.map((city) => <option value={city} key={city}>{city}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="date-of-birth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" ref={dateOfBirthInput} required />
                        <Form.Control.Feedback type="invalid">
                            required field
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Check ref={maleInput}
                            inline
                            label="male"
                            name="gender"
                            type="radio"
                            id={`inline-radio-1`}
                            defaultChecked
                        />
                        <Form.Check ref={femaleInput}
                            inline
                            label="female"
                            name="gender"
                            type="radio"
                            id={`inline-radio-2`}
                        />
                        <Form.Control.Feedback type="invalid">
                            required field
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="button" className="w-100" onClick={signup}>
                        Sign Up
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;