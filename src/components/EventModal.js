import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from '../features/modal';
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

const EventModal = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
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
    
    const createEvent = async () => {

        if (activeUser == null) {
            alert("Please login to create an event");
            return;
        }

        if (!titleEventInput.current.value || !descriptionEventInput.current.value || !locationEventInput.current.value || !eventVisibilityInput.current.value) {
            setFormValues({ title: !titleEventInput.current.value, description: !descriptionEventInput.current.value, location: !locationEventInput.current.value, visibility: !eventVisibilityInput.current.value });
            return;
        }   

        let newEvent = {
            title: titleEventInput.current.value,
            description: descriptionEventInput.current.value,
            location: locationEventInput.current.value,
            visibility: eventVisibilityInput.current.value,
            date_and_time: eventDateTimeInput.current.value,
            organizer: activeUser.id
        }
        let path = serverUrl + 'events/';
        let event = await postData(path, newEvent);
        if (event) {
            closepopup();
        }
        else {
            alert("Error creating event");
        }
    }

    return (
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
}

export default EventModal;