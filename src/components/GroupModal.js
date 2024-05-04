import React, {useState} from 'react'
import { Form, Row, Col, Container, Button, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from '../features/modal';
import { postData } from '../features/apiService';

const GroupModal = () => {
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const showModal = useSelector((state) => state.groupModal.value);
    const groupNameInput = React.createRef();
    const groupDescriptionInput = React.createRef();
    const groupVisibilityInput = React.createRef();
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.user.value);

    const createGroup = () => {
        let newGroup = {
            admin: activeUser.id,
            name: groupNameInput.current.value,
            description: groupDescriptionInput.current.value,
            visibility: groupVisibilityInput.current.value
        }
        
        let path = 'https://fitter-backend.onrender.com/groups/';
        let group = postData(path, newGroup);
        console.log(group);
        dispatch(closeModal());
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Button variant="primary" onClick={handleShow}>
                        Create Group
                    </Button>
                </Col>
            </Row>
            <Modal show={showModal} onHide={()=>{dispatch(closeModal())}}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="groupName">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter group name" ref={groupNameInput}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="groupDescription">
                            <Form.Label>Group Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter group description" ref={groupDescriptionInput}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Group Visibility</Form.Label>
                            <Form.Select aria-label="Default select example" ref={groupVisibilityInput}>
                                <option>public</option>
                                <option>private</option>
                                <option>invitation_only</option>
                            </Form.Select>
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