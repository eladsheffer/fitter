import React, {useState, useRef} from 'react'
import { Form, Row, Col, Container, Button, Modal, Image } from 'react-bootstrap'
import { useSelector } from "react-redux";
import { postData } from '../features/apiService';

const GroupModal = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);

    const groupNameInput = useRef(null);
    const groupDescriptionInput = useRef(null);
    const groupVisibilityInput = useRef(null);
    
    const activeUser = useSelector((state) => state.user.value);

    const createGroup = (event) => {
        
        if (activeUser == null) {
            alert("Please login to create a group");
            return;
        }

        handleChange(event);



        let newGroup = {
            admin: activeUser.id,
            name: groupNameInput.current.value,
            description: groupDescriptionInput.current.value,
            visibility: groupVisibilityInput.current.value
        }
        
        let path = 'https://fitter-backend.onrender.com/groups/';
        let group = postData(path, newGroup);
        console.log(group);
        setShow(false);
    };

   

    const handleChange = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
    };

    return (
        <Container>
            <Row>
                <Col>
                <a href="#">  
                        <Image src="icons/add.png" width="40" height="40" className="d-inline-block align-top" alt="add" rounded
                        onClick={handleShow} />
                        </a>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated}>
                        <Form.Group className="mb-3" controlId="groupName">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter group name" required ref={groupNameInput} onChange={handleChange}/>
                            <Form.Control.Feedback type="invalid">
                                required field
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="groupDescription">
                            <Form.Label>Group Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter group description" required ref={groupDescriptionInput}/>
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
                </Modal.Body>
            </Modal>
        </Container>
    )
};

export default GroupModal;