import { Form, Alert, Button } from 'react-bootstrap'
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [invalidLogin, setInvalidLogin] = useState(false);
    const [successLogin, setSuccessLogin] = useState(false);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFunc = () => {
        dispatch(login({ name: "test", email: emailInput.current.value, password: passwordInput.current.value }));
        navigate("/");
        // const { users } = props;
        // let newActiveUser = null;
        // for (let i = 0; i < users.length && !newActiveUser; i++) {
        //     if (
        //         users[i].email === emailInput.current.value &&
        //         users[i].password === passwordInput.current.value
        //     ) {
        //         newActiveUser = users[i];
        //     }
        // }

        // if (newActiveUser) {
        //     props.handleLogin(newActiveUser);
        //     setSuccessLogin(true);
        // } else {
        //     setInvalidLogin(true);
        // }
    };

    return (
        <div>
            <div className="login">
                <h1>Login</h1>
                <p>
                    or <Link to="/signup">create an account</Link>
                </p>
                <Alert variant="danger" show={invalidLogin}>
                    Invalid email or password!
                </Alert>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailInput} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordInput} type="password" placeholder="Password" />
                    </Form.Group>
                    <Button type="button" block onClick={loginFunc}>
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;