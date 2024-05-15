import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeModal, showModal, renderModalType } from '../features/modal';
import { postData, getData } from '../features/apiService';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField, InputLabel, Select, MenuItem, FormControl, Box } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Description } from '@mui/icons-material';
import dayjs from 'dayjs';
import NewEventPage from '../pages/NewEventPage';

const RootDialog = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.modal.value.show);
    const functionopenpopup = () => {
        dispatch(showModal());
    }
    const closepopup = () => {
        dispatch(closeModal());
    }
    
    return(
        <div>
        <Box sx={{ fontSize: 20, textAlign: 'center' }}>
        Create New Event
        <a href='#'>
        <AddCircleIcon color="primary" sx={{fontSize: 100}} onClick={functionopenpopup} variant="contained">
        {/* <Button onClick={functionopenpopup} color="primary" variant="contained">Create New Event</Button> */}
        </AddCircleIcon>
        </a>
        </Box>
        <Dialog
            // fullScreen 
            open={open} onClose={closepopup} fullWidth maxWidth="sm">
            <DialogTitle>Create Event<IconButton onClick={closepopup} style={{ float: 'right' }}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
            <DialogContent>
               <NewEventPage/>
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