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
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField, InputLabel, Select, MenuItem, FormControl, Box, Alert } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Description } from '@mui/icons-material';
import dayjs from 'dayjs';


const NewEventPage = () => {

    const activeUser = useSelector((state) => state.user.value);
    const titleEventInput = useRef(null);
    const descriptionEventInput = useRef(null);
    const locationEventInput = useRef(null);
    const eventVisibilityInput = useRef(null);
    const eventDateTimeInput = useRef(null);

    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [formValues, setFormValues] = useState({ title: true, description: true, location: true, visibility: true })


    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = value === "" ? "required field" : false;
        setFormValues({ ...formValues, [name]: error });
    }

    const createEvent = async () => {

        setErrorMessages(null);
        setSuccessMessages(null);

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
        console.log(newEvent);
        let path = 'https://fitter-backend.onrender.com/events/';
        let event = await postData(path, newEvent);
        console.log(event);
        if (event && event.title) {
            console.log(event);
            setSuccessMessages(`Event "${event.title}" created successfully`);
        }
        else {
            setErrorMessages("Error creating event");
        }
    }

    return (
        <div className='login'>
            {successMessages && (<Alert severity='success' >{successMessages}</Alert>)}
            {errorMessages && (<Alert severity='error'>{errorMessages}</Alert>)}
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
        </div>
    );
};

export default NewEventPage;