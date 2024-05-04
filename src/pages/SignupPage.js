import React, { useRef } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../features/apiService';

const SignupPage = () => {
    const firstNameInput = useRef();
    const lastNameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const addressInput = useRef();
    const cityInput = useRef();
    const dateOfBirthInput = useRef();
    const maleInput = useRef();
    const femaleInput = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const signup = async () => {
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
            //city: cityInput.current.value,
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

    return (
        <div>
            <div className="login">
                <h1>Create a User Account</h1>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control ref={firstNameInput} type="text" placeholder="Enter your first name" />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control ref={lastNameInput} type="text" placeholder="Enter your last name" />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailInput} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordInput} type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control ref={addressInput} type="text" placeholder="Enter address" />
                    </Form.Group>

                    <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control ref={cityInput} type="text" placeholder="Enter city" />
                    </Form.Group>
                    <Form.Group controlId="date-of-birth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" ref={dateOfBirthInput} />
                    </Form.Group>
                    <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Check ref={maleInput}
                            inline
                            label="male"
                            name="gender"
                            type="radio"
                            id={`inline-radio-1`}
                            checked
                        />
                        <Form.Check ref={femaleInput}
                            inline
                            label="female"
                            name="gender"
                            type="radio"
                            id={`inline-radio-2`}
                        />
                    </Form.Group>
                    <Button type="button" onClick={signup}>
                        Sign Up
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;