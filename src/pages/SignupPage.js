import React, { useRef } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';

const SignupPage = () => {
    const nameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const addressInput = useRef();
    const cityInput = useRef();
    const dispatch = useDispatch();

    const signup = () => {

        const newUser = {
            name: nameInput.current.value,
            email: emailInput.current.value,
            password: passwordInput.current.value,
        };
        
        dispatch(login(newUser));

    };

    return (
        <div>
            <div className="login">
                <h1>Create a User Account</h1>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control ref={nameInput} type="text" placeholder="Enter your name" />
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
                    <Button type="button" block onClick={signup}>
                        Sign Up
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;