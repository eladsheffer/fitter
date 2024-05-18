import React, { useEffect, useRef } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useNavigate, Link } from 'react-router-dom';
import { getData, postData } from '../features/apiService';
import { showModal, closeModal } from '../features/modal';

const SignupPage = (props) => {
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
    const [validated, setValidated] = React.useState(false);
    const [cities, setCities] = React.useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            const path = 'https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab';
            const data = await getData(path);
            if (!data) return;
            const cities = data.result.records.map((city) => city.שם_ישוב.trim().replace('(',')').replace(')','('));
            setCities(cities);
        };

        fetchCities();

        // Cleanup function if needed
        return () => {
            // Cleanup code here, if any
        };
    }, []);

    const signup = async () => {
        if (!firstNameInput.current.checkValidity() || !lastNameInput.current.checkValidity() || !emailInput.current.checkValidity() || !passwordInput.current.checkValidity() || !dateOfBirthInput.current.checkValidity())
            return;

        let user = await getData('https://fitter-backend.onrender.com/users/get_user_by_email?email=' + emailInput.current.value);

        if (user != null) {
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
        newUser = await postData('https://fitter-backend.onrender.com/users/', newUser);
        if (newUser) {
            dispatch(login(newUser));
            navigate("/");
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
                <Form noValidate validated={validated}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control ref={firstNameInput} type="text" placeholder="Enter your first name" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control ref={lastNameInput} type="text" placeholder="Enter your last name" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailInput} type="email" placeholder="Enter email" required onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordInput} type="password" placeholder="Password" required onChange={handleChange} />
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