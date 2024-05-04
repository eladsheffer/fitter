import { Form, Alert, Button } from 'react-bootstrap'
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import user, { login } from '../features/user';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { postData } from '../features/apiService';

function LoginPage() {
    const [invalidLogin, setInvalidLogin] = useState(false);
    const [successLogin, setSuccessLogin] = useState(false);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFunc = async () => {

        let userDetails = {
            email: emailInput.current.value,
            password: passwordInput.current.value
        };
        let path = 'https://fitter-backend.onrender.com/users/login/'
        let user = await postData(path, userDetails);
        if (user!=null) {
            localStorage.setItem('user', JSON.stringify(user));
        dispatch(login(user)); // dispatch the user object to the store
        navigate("/");
        } else { 
            setInvalidLogin(true);
        }
        // const location = 'https://fitter-backend.onrender.com/users/login/';
        // const settings = {
        //     method: 'POST',
        //     headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //     email: "qqq@gmail.com",
        //     password: "qqq!!!qqq"
        //     })
        // };
        // try {
        //     const fetchResponse = await fetch(location, settings);
        //     const data = await fetchResponse.json();
        //     const status = fetchResponse.status;
        //     console.log(status);
        //     console.log(data);
        //     // handle the response data here
        //     // dispatch(login({ name: "test", email: emailInput.current.value, password: passwordInput.current.value }));
        //     // navigate("/");
        // } catch (e) {
        //     console.error(e);
        //     // handle the error here
        // }
        
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
                        <Form.Control ref={emailInput} type="email" value="qqq@gmail.com" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordInput} type="password" value="qqq!!!qqq" placeholder="Password" />
                    </Form.Group>
                    <Button type="button" onClick={loginFunc}>
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;