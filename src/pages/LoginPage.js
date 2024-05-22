import { Form, Alert, Button } from 'react-bootstrap'
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { postData } from '../features/apiService';
import { showModal, closeModal } from '../features/modal';

function LoginPage(props) {
    const [validated, setValidated] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);

    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFunc = async (event) => {

        if (!emailInput.current.checkValidity() || !passwordInput.current.checkValidity()) {
            return;
        }

        let userDetails = {
            email: emailInput.current.value,
            password: passwordInput.current.value
        };
        let path = 'https://fitter-backend.onrender.com/users/login/'
        let data = await postData(path, userDetails,true);
        if (!data) {
            setInvalidLogin(true);
            return;
        }
        let user = data.user;
        if (!user) {
            setInvalidLogin(true);
            return;
        }
        console.log(user);
        dispatch(login(user)); // dispatch the user object to the store
        //dispatch(closeModal());
        navigate(-1); // go back to the previous page
        if (props.modal) {
        dispatch(showModal());
    }
    };

    const handleChange = (event) => {
        setInvalidLogin(false);
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

                {props.modal === true ? null : <>
                    <h1>Login</h1>
                    <p>
                        Not a member yet? <Link to="/signup">sign up</Link>
                    </p>
                </>
                }
                <Alert variant="danger" show={invalidLogin}>
                    Invalid email or password!
                </Alert>
                <Form noValidate validated={validated}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailInput} type="email" defaultValue="qqq@gmail.com" placeholder="Enter email" required onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">
                            required field
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordInput} type="password" defaultValue="qqq!!!qqq" placeholder="Password" required onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">
                            required field
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="button" className="w-100" onClick={loginFunc}>
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;