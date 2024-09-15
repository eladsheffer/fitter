import { Form, Alert, Button } from 'react-bootstrap'
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/user';
import { setGroupsAsAdmin, setGroupsAsMember } from '../features/groups'
import { setEventsAsHost, setEventsAsParticipant } from '../features/events'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getData, postData } from '../features/apiService';
import { showModal } from '../features/modal';
import PageTitle from "../components/PageTitle";
import LinearProgress from '@mui/material/LinearProgress';

function LoginPage(props) {
    const activeUser = useSelector((state) => state.user.value);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [validated, setValidated] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFunc = async (event) => {

        if (!emailInput.current.checkValidity() || !passwordInput.current.checkValidity()) {
            return;
        }

        setLoading(true);

        let userDetails = {
            email: emailInput.current.value,
            password: passwordInput.current.value
        };
        let path = serverUrl + 'users/login/';
        let data = await postData(path, userDetails, true);



        if (!data) {
            setInvalidLogin(true);
            return;
        }


        let user = data.user;
        if (!user) {
            setInvalidLogin(true);
            return;
        }
        dispatch(login(user)); // dispatch the user object to the store

        // get the groups of the user
        path = serverUrl + 'users/get_user_groups_as_admin/?email=' + user.email;
        data = await getData(path);
        if (data) {
            dispatch(setGroupsAsAdmin(data));
        }

        path = serverUrl + 'users/get_user_groups_as_member_not_as_admin/?email=' + user.email;
        data = await getData(path);
        if (data) {
            dispatch(setGroupsAsMember(data));
        }

        // get the events of the user
        path = serverUrl + 'users/get_user_events_as_host/?email=' + user.email;
        data = await getData(path);
        if (data) {
            dispatch(setEventsAsHost(data));
        }

        path = serverUrl + 'users/get_user_events_as_participant/?email=' + user.email;
        data = await getData(path);

        setLoading(false);

        if (data) {
            dispatch(setEventsAsParticipant(data));
        }
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
            {activeUser ? <Alert variant="success">You're already logged in. <Link to="/">Homepage</Link></Alert> :
                <div className="login">
                    <PageTitle title={`Fitter - Login`} />
                    {props.modal ? null : <>
                        <h1>Login</h1>
                        <p>
                            Not a member yet? <Link to="/signup">sign up</Link>
                        </p>
                    </>
                    }
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
                        {loading && <LinearProgress />}
                        <Alert variant="danger" show={invalidLogin}>
                            Invalid email or password!
                        </Alert>
                        <Button type="button" className="w-100" onClick={loginFunc}>
                            Login
                        </Button>
                    </Form>
                </div>
            }
        </div>
    );
}

export default LoginPage;