import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeModal, showModal } from '../features/modal';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NewEventPage from '../pages/NewEventPage';

const RootDialog = (props) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.modal.value.show);
    const functionopenpopup = () => {
        dispatch(showModal());
    }
    const closepopup = () => {
        dispatch(closeModal());
    }

    return (
        <div>
            {!props.hideButton &&
                <Box sx={{ fontSize: 20, textAlign: 'center' }}>
                    <a href='#'>
                        <AddCircleIcon color="primary" sx={{ fontSize: 45, color: "blue" }} onClick={functionopenpopup} variant="contained">
                            {/* <Button onClick={functionopenpopup} color="primary" variant="contained">Create New Event</Button> */}
                        </AddCircleIcon>
                    </a>
                </Box>}
            <Dialog
                // fullScreen 
                open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>Create Event<IconButton onClick={closepopup} style={{ float: 'right' }}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
                <DialogContent>
                    <NewEventPage />
                </DialogContent>
                <DialogActions>
                    {/* <Button color="success" variant="contained">Yes</Button>
                <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                </DialogActions>
            </Dialog>
        </div>

    )
};

export default RootDialog;