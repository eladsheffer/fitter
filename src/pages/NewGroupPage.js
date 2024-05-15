import React, { useState, useRef, useEffect} from 'react'
import { Form, Row, Col, Container, Button, Modal, Image, Alert } from 'react-bootstrap'
import { useSelector } from "react-redux";
import { postData } from '../features/apiService';

const NewGroupPage = () => {

    const [validated, setValidated] = useState(false);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);

    const groupNameInput = useRef(null);
    const groupDescriptionInput = useRef(null);
    const groupVisibilityInput = useRef(null);

    const activeUser = useSelector((state) => state.user.value);

    const createGroup = async () => {
        setErrorMessages(null);
        setSuccessMessages(null);
        if (!activeUser) {
            alert("Please login to create a group");
            return;
        }

        if (!groupNameInput.current.checkValidity() || !groupDescriptionInput.current.checkValidity() || !groupVisibilityInput.current.checkValidity())
            return;



        let newGroup = {
            admin: activeUser.id,
            name: groupNameInput.current.value,
            description: groupDescriptionInput.current.value,
            visibility: groupVisibilityInput.current.value
        }

        let path = 'https://fitter-backend.onrender.com/groups/';
        let group = await postData(path, newGroup);
        if (group && group.name) {
            console.log(group.name);
            setSuccessMessages(`Group "${group.name}" created successfully`);
        }
        else {
            setErrorMessages("Error creating group");
        }
    };

    const handleChange = (event) => {
        setErrorMessages(null);
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };


    return (
        <div className="login">
            <Alert variant="danger" show={errorMessages}>
                {errorMessages}
            </Alert>
            <Alert variant="success" show={successMessages}>
            {successMessages}
            </Alert>
            <Form noValidate validated={validated}>
                
                <Form.Group className="mb-3" controlId="groupName">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter group name" required ref={groupNameInput} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        required field
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="groupDescription">
                    <Form.Label>Group Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter group description" required ref={groupDescriptionInput} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        required field
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Group Visibility</Form.Label>
                    <Form.Select aria-label="Default select example" required ref={groupVisibilityInput}>
                        <option>public</option>
                        <option>private</option>
                        <option value={"invitation_only"}>invitation only</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        required field
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" onClick={createGroup}>
                    Create Group
                </Button>
            </Form>
        </div>
    );
}

export default NewGroupPage;