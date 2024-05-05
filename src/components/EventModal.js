import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from '../features/modal';
import { postData } from '../features/apiService';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField, InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import { Description } from '@mui/icons-material';
import dayjs from 'dayjs';

const EventModal = () => {
    const activeUser = useSelector((state) => state.user.value);
    const titleEventInput = useRef(null);
    const descriptionEventInput = useRef(null);
    const locationEventInput = useRef(null);
    const eventVisibilityInput = useRef(null);
    const eventDateTimeInput = useRef(null);
    const [open, openchange] = useState(false);
    const [formValues, setFormValues] = useState({ title: true, description: true, location: true, visibility: true })
    const functionopenpopup = () => {
        openchange(true);
    }
    const closepopup = () => {
        openchange(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = value === "" ? "required field" : false;
        setFormValues({ ...formValues, [name]: error });
    }
    
    const createEvent = () => {
        let newEvent = {
            title: titleEventInput.current.value,
            description: descriptionEventInput.current.value,
            location: locationEventInput.current.value,
            visibility: eventVisibilityInput.current.value,
            date_and_time: eventDateTimeInput.current.value,
            organizer: activeUser.id
        }
        console.log(newEvent);
        let path = 'https://fitter-backend.onrender.com/events/';
        let event = postData(path, newEvent);
        console.log(event);
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>MUI - DIALOG</h1>
            <Button onClick={functionopenpopup} color="primary" variant="contained">Open Popup</Button>
            <Dialog
                // fullScreen 
                open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>Create Event<IconButton onClick={closepopup} style={{ float: 'right' }}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <TextField variant="outlined" inputRef={titleEventInput} name="title" error={formValues.title} label="Title" helperText="required field" required onChange={handleChange}></TextField>
                        <TextField variant="outlined" inputRef={descriptionEventInput} name="description" label="Description" error={formValues.description} helperText="required field" required onChange={handleChange}></TextField>
                        <TextField variant="outlined" inputRef={locationEventInput} name="location" label="Location" error={formValues.location} helperText="required field" onChange={handleChange}></TextField>
                        <FormControl fullWidth required>
                            <InputLabel id="demo-simple-select-label" error={formValues.visibility}>Visibility</InputLabel>
                            <Select inputRef={eventVisibilityInput}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="visibility"
                                error={formValues.visibility}
                                label="Visibility"
                                onChange={handleChange}
                            >
                                <MenuItem value={"public"}>public</MenuItem>
                                <MenuItem value={"private"}>private</MenuItem>
                                <MenuItem value={"invitation_only"}>invitation only</MenuItem>
                            </Select>
                        </FormControl>
                        <DateTimePicker required inputRef={eventDateTimeInput}
                            label="Event Date & Time"
                            format="YYYY-MM-DD hh:mm"
                            //value={dayjs()}
                            defaultValue={dayjs()}
                            //onChange={(newValue) => setValue(newValue)}
                        />
                        <FormControlLabel control={<Checkbox defaultChecked color="primary"></Checkbox>} label="Agree terms & conditions"></FormControlLabel>
                        <Button color="primary" variant="contained" onClick={createEvent}>Create Event</Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                </DialogActions>
            </Dialog>
        </div>
    );
    // const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //   setOpen(true);
    // };

    // const handleClose = () => {
    //   setOpen(false);
    // };

    // return (
    //     <React.Fragment>
    //       <Button variant="outlined" onClick={handleClickOpen}>
    //         Open form dialog
    //       </Button>
    //       <Dialog
    //         open={open}
    //         onClose={handleClose}
    //         PaperProps={{
    //           component: 'form',
    //           onSubmit: (event) => {
    //             event.preventDefault();
    //             const formData = new FormData(event.currentTarget);
    //             const formJson = Object.fromEntries(formData.entries());
    //             const email = formJson.email;
    //             console.log(email);
    //             handleClose();
    //           },
    //         }}
    //       >
    //         <DialogTitle>Subscribe</DialogTitle>
    //         <DialogContent>
    //           <DialogContentText>
    //             To subscribe to this website, please enter your email address here. We
    //             will send updates occasionally.
    //           </DialogContentText>
    //           <TextField
    //             autoFocus
    //             required
    //             margin="dense"
    //             id="name"
    //             name="email"
    //             label="Email Address"
    //             type="email"
    //             fullWidth
    //             variant="standard"
    //           />
    //         </DialogContent>
    //         <DialogActions>
    //           <Button onClick={handleClose}>Cancel</Button>
    //           <Button type="submit">Subscribe</Button>
    //         </DialogActions>
    //       </Dialog>
    //     </React.Fragment>
    //   );
};

export default EventModal;