import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function RemoveModal({show, handleClose ,title , message , handleRemove , isAttending}) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => handleRemove(isAttending)}>
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
    );
}