import React, { useState, useRef, useEffect } from 'react'
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
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField, InputLabel, Select, MenuItem, FormControl, Box, Alert, Slider } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Description } from '@mui/icons-material';
import dayjs from 'dayjs';
import sports from "../data-model/sports.json";


const NewEventPage = (props) => {

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;

    const activeUser = useSelector((state) => state.user.value);
    const titleEventInput = useRef(null);
    const descriptionEventInput = useRef(null);
    const locationEventInput = useRef(null);
    const eventVisibilityInput = useRef(null);
    const eventDateTimeInput = useRef(null);
    const eventSportTypeInput = useRef(null);
    const eventProfilePictureInput = useRef(null);
    const ageSliderInput = useRef(null);
    const eventGenderInput = useRef(null);

    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [formValues, setFormValues] = useState({ title: true, description: true, location: true, visibility: true })
    const [cities, setCities] = useState([]);
    const [eventProfilePicture, setEventProfilePicture] = useState(null);
    const [disabledAgeSlider, setDisabledAgeSlider] = useState(true);
    const [ageRange, setAgeRange] = useState([20, 40]);
    const [value, setValue] = useState('');


    useEffect(() => {
        const fetchCities = async () => {
            const data = await getData(citiesUrl);
            if (!data) return;
            const cities = data.result.records.map((city) => city.שם_ישוב.trim().replace('(', ')').replace(')', '('));
            setCities(cities);
        };

        fetchCities();

        // Cleanup function if needed
        return () => {
            // Cleanup code here, if any
        };
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = value === "" ? "required field" : false;
        setFormValues({ ...formValues, [name]: error });
    }

    const x = (event) => {
        // Extract the new value from the event
        const newValue = event.target.value;
        if (newValue.split('')[0]<'1' || newValue.split('')[0]>'9') {
            return;
        }
        // Filter out non-numeric characters and ensure it's non-negative
        setValue(newValue.replace(/[^0-9]/g, ''));
      };

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

        console.log(props.group);
        let newEvent = new FormData();
        newEvent.append('title', titleEventInput.current.value);
        newEvent.append('description', descriptionEventInput.current.value);
        newEvent.append('location', locationEventInput.current.value);
        newEvent.append('visibility', eventVisibilityInput.current.value);
        newEvent.append('date_and_time', eventDateTimeInput.current.value);
        newEvent.append('sport_type', eventSportTypeInput.current.value);
        newEvent.append('image', eventProfilePicture);
        newEvent.append('min_age', disabledAgeSlider ? 0 : ageRange[0]);
        newEvent.append('max_age', disabledAgeSlider ? 120 : ageRange[1]);
        newEvent.append('gender', eventGenderInput.current.value);
        newEvent.append('max_participants', value);
        newEvent.append('organizer', activeUser.id);
        if (props.group)
            newEvent.append('group_organized', props.group);

        console.log(newEvent);
        let path = serverUrl + 'events/';
        let event = await postData(path, newEvent);
        console.log(event);
        if (event && event.title) {
            console.log(event);
            setSuccessMessages(`Event "${event.title}" created successfully`);
        }
        else {
            setErrorMessages("Error creating event");
        }
    };

    const handleSliderChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setAgeRange([Math.min(newValue[0], ageRange[1]), ageRange[1]]);
        } else {
            setAgeRange([ageRange[0], Math.max(newValue[1], ageRange[0])]);
        }
    };

    let eventProfilePictureToShow = eventProfilePicture ? URL.createObjectURL(eventProfilePicture) : null;

    return (
        <div className='login'>
            {successMessages && (<Alert severity='success' >{successMessages}</Alert>)}
            {errorMessages && (<Alert severity='error'>{errorMessages}</Alert>)}
            <Stack spacing={2} margin={2}>
                <TextField variant="outlined" inputRef={titleEventInput} name="title" error={formValues.title} label="Title" helperText="required field" required onChange={handleChange}></TextField>
                <TextField variant="outlined" inputRef={descriptionEventInput} name="description" label="Description" error={formValues.description} helperText="required field" required onChange={handleChange}></TextField>
                <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label" error={formValues.location}>Location</InputLabel>
                    <Select inputRef={locationEventInput}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="location"
                        error={formValues.location}
                        label="Location"
                        onChange={handleChange}
                    >
                        {cities.map((city) => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                    </Select>
                </FormControl>
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
                <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">Sport Type</InputLabel>
                    <Select inputRef={eventSportTypeInput}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="sport-type"
                        label="Sport Type"
                    >
                        {sports.map((sport) => <MenuItem key={sport.id} value={sport.name}>{sport.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                <TextField type="file" inputProps={{ accept: 'image/*' }} ref={eventProfilePictureInput} onChange={(e)=> setEventProfilePicture(e.target.files[0])} />
                <Box
                    component="img"
                    sx={{
                        height: 233,
                        width: 350,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                    }}
                    src={eventProfilePictureToShow}
                />
                </FormControl>
                 <FormControl fullWidth>
                 <FormControlLabel control={<Checkbox />} label="Event Age Range (Optional)" onChange={() => setDisabledAgeSlider(!disabledAgeSlider)} />
                    <Slider ref={ageSliderInput}
                        getAriaLabel={() => 'Minimum distance'}
                        value={ageRange}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        // getAriaValueText={valuetext}
                        disableSwap
                        disabled={disabledAgeSlider}
                        max={120}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select inputRef={eventGenderInput}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="gender"
                        label="Gender"
                    >
                        <MenuItem value={"mixed"}>mixed</MenuItem>
                        <MenuItem value={"men"}>men</MenuItem>
                        <MenuItem value={"women"}>women</MenuItem>
                    </Select>
                </FormControl>
                <TextField
      label="Maximum participants (if empty, unlimited)"
      placeholder='Maximum participants. If empty, unlimited'
      value={value}
      onChange={x}
      variant="outlined"
        //type="number"
        inputMode='numeric'
    />

                <Button color="primary" variant="contained" onClick={createEvent}>Create Event</Button>
            </Stack>
        </div>
    );
};

export default NewEventPage;