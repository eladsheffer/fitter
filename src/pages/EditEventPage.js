import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from '../features/modal';
import { Link, useParams, useNavigate } from "react-router-dom";
import { postData, getData, putData, patchData, deleteData } from '../features/apiService';
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
import LinearProgress from '@mui/material/LinearProgress';
import RemoveModal from '../components/RemoveModal';
import Autocomplete from '@mui/material/Autocomplete';


const EditEventPage = (props) => {

    const navigate = useNavigate();
    let { id } = useParams();

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const citiesUrl = process.env.REACT_APP_CITIES_URL;

    const path = `${serverUrl}events/${id}/`;

    const activeUser = useSelector((state) => state.user.value);
    const titleEventInput = useRef(null);
    const descriptionEventInput = useRef(null);
    const eventDateTimeInput = useRef(null);
    const eventSportTypeInput = useRef(null);
    const eventProfilePictureInput = useRef(null);
    const ageSliderInput = useRef(null);
    const eventGenderInput = useRef(null);
    const eventProfileImg = useRef(null);
    const maxParticipantsInput = useRef(null);

    const [event, setEvent] = useState(null);
    const [eventProfilePictureToShow, setEventProfilePictureToShow] = useState(null);
    const [location, setLocation] = useState(null);
    const [gender, setGender] = useState(null);
    const [sportType, setSportType] = useState(null);
    const [errorMessages, setErrorMessages] = useState(null);
    const [successMessages, setSuccessMessages] = useState(null);
    const [formValues, setFormValues] = useState({ title: true, description: true, location: true })
    const [cities, setCities] = useState([]);
    const [eventProfilePicture, setEventProfilePicture] = useState(null);
    const [disabledAgeSlider, setDisabledAgeSlider] = useState(true);
    const [ageRange, setAgeRange] = useState([0, 120]);
    const [maxParticipants, setMaxParticipants] = useState('');
    const [showRemoveModal, setShowRemoveModal] = useState(false);


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

    useEffect(() => {
        const fetchEvent = async () => {
            const eventData = await getData(path);
            console.log(eventData);
            if (!eventData) return;
            setEvent(eventData);
            console.log(eventData);
            console.log(event);
            setLocation(eventData.location);

            setEventProfilePictureToShow(eventData.image);
            setGender(eventData.gender);
            setSportType(eventData.sport_type);
            if (eventData.min_age || eventData.max_age) {
                setAgeRange([eventData.min_age, eventData.max_age]);
            }

            setMaxParticipants(eventData.max_participants);
        };

        fetchEvent();

        // Cleanup function if needed
        return () => {
            // cleanup

        };

    }, []);

    const handleNumberInputChanged = (event) => {
        // Extract the new value from the event
        const newValue = event.target.value;
        if (newValue.split('')[0] < '1' || newValue.split('')[0] > '9') {
            return;
        }
        // Filter out non-numeric characters and ensure it's non-negative
        setMaxParticipants(newValue.replace(/[^0-9]/g, ''));
    };

    const updateEvent = async () => {

        setErrorMessages(null);
        setSuccessMessages(null);

        if (activeUser == null) {
            alert("Please login to update an event");
            return;
        }

        console.log(props.group);
        let newEvent = new FormData();
        if (titleEventInput.current.value) {
            newEvent.append('title', titleEventInput.current.value);
        }

        if (descriptionEventInput.current.value) {
            newEvent.append('description', descriptionEventInput.current.value);
        }
        newEvent.append('location', location);
        newEvent.append('gender', eventGenderInput.current.value);
        newEvent.append('sport_type', eventSportTypeInput.current.value);

        newEvent.append('date_and_time', eventDateTimeInput.current.value);

        if (!disabledAgeSlider) {
            newEvent.append('min_age', ageRange[0]);
            newEvent.append('max_age', ageRange[1]);
        }

        if (eventProfilePicture) {
            newEvent.append('image', eventProfilePicture);
        }

        if (maxParticipantsInput.current.value) {
            newEvent.append('max_participants', maxParticipants);
        }

        //newEvent.append('organizer', activeUser.id);
        if (props.group)
            newEvent.append('group_organized', props.group);

        console.log(newEvent);

        let event = await patchData(path, newEvent);
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

    const deleteEvent = async () => {
        const deleted = await deleteData(path);

        if (deleted) {
            setShowRemoveModal(false);
            setSuccessMessages("Event deleted successfully");
            navigate(-1);
        }
        else {
            setErrorMessages("Error deleting user profile");
        }
    };

    return (
        <div className='login'>
            {!activeUser ? <Alert variant="danger">You must be logged in to view this page. <Link to="/login">Login</Link></Alert> : !event ? <LinearProgress /> :
                activeUser.id !== event.organizer ? <Alert variant="danger">You are not the organizer of this event. <Button variant='link' onClick={() => navigate(-1)} >Go Back</Button> </Alert> :

                    <>
                        <RemoveModal show={showRemoveModal} handleClose={() => setShowRemoveModal(false)} title="Delete Event" message="Are you sure you want to delete this event?" handleRemove={deleteEvent} />
                        <Stack spacing={2} margin={2}>
                            <TextField variant="outlined" inputRef={titleEventInput} name="title" placeholder='Event title is empty and will not be altered' defaultValue={event.title} label="Title"></TextField>
                            <TextField variant="outlined" inputRef={descriptionEventInput} name="description" placeholder='Event description is empty and will not be altered' defaultValue={event.description} label="Description"></TextField>
                            <FormControl fullWidth>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-location"
                                    options={cities}
                                    error={formValues.location}
                                    label="Location"
                                    defaultValue={event.location}
                                    onChange={(e, value) => setLocation(value)}
                                    renderInput={(params) => <TextField {...params} label="Location" />}
                                />
                            </FormControl>
                            <DateTimePicker inputRef={eventDateTimeInput}
                                label="Event Date & Time"
                                format="YYYY-MM-DD hh:mm"
                                //value={dayjs()}
                                defaultValue={dayjs(event.date_and_time)}
                            //onChange={(newValue) => setValue(newValue)}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Sport Type</InputLabel>
                                <Select inputRef={eventSportTypeInput} value={sportType} onChange={(e) => setSportType(e.target.value)}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="sport-type"
                                    label="Sport Type"
                                >
                                    {sports.map((sport) => <MenuItem key={sport.id} value={sport.name}>{sport.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField type="file" inputProps={{ accept: 'image/*' }} inputRef={eventProfilePictureInput} onChange={(e) => (setEventProfilePicture((e.target.files[0])), setEventProfilePictureToShow(URL.createObjectURL(e.target.files[0])))} />
                                <Box inputRef={eventProfileImg}
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
                                <Slider inputRef={ageSliderInput}
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
                                <Select inputRef={eventGenderInput} value={gender} onChange={(e) => setGender(e.target.value)}
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
                                placeholder='Maximum participants is empty and will not be altered'
                                value={maxParticipants}
                                onChange={handleNumberInputChanged}
                                variant="outlined"
                                type="number"
                                inputMode='numeric'
                                inputRef={maxParticipantsInput}
                            />
                            {successMessages && (<Alert severity='success' >{successMessages}</Alert>)}
                            {errorMessages && (<Alert severity='error'>{errorMessages}</Alert>)}
                            <Button color="primary" variant="contained" onClick={updateEvent}>Update Event</Button>
                            <Button color="secondary" variant="contained" onClick={() => setShowRemoveModal(true)}>Delete Event</Button>
                        </Stack>
                    </>
            }
        </div>
    );
};

export default EditEventPage;