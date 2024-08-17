import React, { useState } from 'react'
import { Row, Col, Container, Button, Image, Alert, Modal } from 'react-bootstrap'
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import NewGroupPage from '../pages/NewGroupPage';
import { useSelector, useDispatch } from "react-redux";
import { renderModalType, closeModal, showModal } from '../features/modal';
import NewEventPage from '../pages/NewEventPage';

const RootModal = (props) => {
    const dispatch = useDispatch();
    const show = useSelector((state) => state.modal.value.show);
    const handleClose = () => dispatch(closeModal());
    const handleShow = () => dispatch(showModal());
    //const [type, setType] = useState(props.type);
    const type = useSelector((state) => state.modal.value.type);
    const handleChange = () => {
        if (type === 'Signup') {
            dispatch(renderModalType({type: 'Login'}));
        }
        else {
            dispatch(renderModalType({type: 'Signup'}));
        }
    }
    const element = type==='Login' ? {
        title: 'Login', body: <>
            <p>
                Not a member yet? <Button className="btn btn-link" variant="outline-none" role="link" onClick={handleChange}>signup</Button>
            </p>
            <LoginPage modal={true}/>
        </>
    } : type==='Signup' ? {
        title: 'Signup', body: <>
            <p>
                Already a member? <Button className="btn btn-link" variant="outline-none" role="link" onClick={handleChange}>Login</Button>
            </p>
            <SignupPage modal={true} />
        </>
    } : type==='Group' ? {
        title: 'New Group', body: <>
            <NewGroupPage modal={true} />
        </>
    } : type==='Event' ? {
        title: 'New Event', body: <>
            <NewEventPage modal={true} />
        </>
    }: {title: 'Error', body: 'Invalid Modal Type'};

    return (
        <Container>
            {!props.hideButton &&
            <Row>
                <Col>
                    <a href="#">
                        <Image src="/icons/add.png" width="40" height="40" className="d-inline-block align-top" alt="add" rounded
                            onClick={handleShow} />
                    </a>
                </Col>
            </Row>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{element.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {element.body}
                </Modal.Body>
            </Modal>
        </Container>
    )
};

export default RootModal;