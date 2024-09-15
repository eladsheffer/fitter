import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from '../features/modal';
import { Link, useParams, useNavigate } from "react-router-dom";
import { postData, getData, patchData, deleteData } from '../features/apiService';
import { Button, Checkbox, FormControlLabel, Stack, TextField, InputLabel, Select, MenuItem, FormControl, Box, Alert, Slider, Grid } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import sports from "../data-model/sports.json";
import LinearProgress from '@mui/material/LinearProgress';
import RemoveModal from '../components/RemoveModal';
import Autocomplete from '@mui/material/Autocomplete';
import { Col, Row } from 'react-bootstrap';
import PageTitle from "../components/PageTitle";

const EditEventPage = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    const locationInput = useRef(null);

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
    const [loading, setLoading] = useState(false);

    const fetchCities = async () => {
        const data = await getData(citiesUrl);
        if (!data) return;
        const cities = data.result.records.map((city) => city.שם_ישוב.trim().replace('(', ')').replace(')', '('));
        setCities(cities);
    };


    useEffect(() => {  
        fetchCities();
    }, []);

    const fetchEvent = async () => {
        const eventData = await getData(path);
       
        if (!eventData) return;
        setEvent(eventData);
        setLocation(eventData.location);

        setEventProfilePictureToShow(eventData.image);
        setGender(eventData.gender);
        setSportType(eventData.sport_type);
        if (eventData.min_age || eventData.max_age) {
            setAgeRange([eventData.min_age, eventData.max_age]);
        }

        setMaxParticipants(eventData.max_participants);
    };

    useEffect(() => {
        fetchEvent();
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

        setLoading(true);

        let newEvent = new FormData();
        if (titleEventInput.current.value) {
            newEvent.append('title', titleEventInput.current.value);
        }

        if (descriptionEventInput.current.value) {
            newEvent.append('description', descriptionEventInput.current.value);
        }

        if(locationInput.current.value){
        newEvent.append('location', locationInput.current.value);
        }
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


        let event = await patchData(path, newEvent);

        setLoading(false);

        if (event && event.title) {
            setSuccessMessages(`Event "${event.title}" updated successfully`);
        }
        else {
            setErrorMessages("Error updating event");
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

    const handleClose = () => {
        dispatch(closeModal());
        navigate(-1);
    };

    const removeImage = async () => {
        setEventProfilePicture(null);
        setEventProfilePictureToShow(null);
        const deleteImage = await postData(`${serverUrl}events/${id}/remove_image/`,null);
        if (deleteImage) {
            setSuccessMessages("Image removed successfully");
        }
        else {
            setErrorMessages("Error removing image");
        }

    };

    return (
        <div className='login'>
            {!activeUser ? <Alert variant="danger">You must be logged in to view this page. <Link to="/login">Login</Link></Alert> : !event ? <LinearProgress /> :
                activeUser.id !== event.organizer ? <Alert variant="danger">You are not the organizer of this event. <Button variant='link' onClick={() => navigate(-1)} >Go Back</Button> </Alert> :

                    <>
                        <PageTitle title={`Fitter - Edit Event`} />
                        <RemoveModal show={showRemoveModal} handleClose={() => setShowRemoveModal(false)} title="Delete Event" message="Are you sure you want to delete this event?" handleRemove={deleteEvent} />
                        <Stack spacing={2} margin={2}>
                            <TextField variant="outlined" inputRef={titleEventInput} name="title" placeholder='Event title is empty and will not be altered' defaultValue={event.title} label="Title"></TextField>
                            <TextField multiline variant="outlined" inputRef={descriptionEventInput} name="description" placeholder='Event description is empty and will not be altered' defaultValue={event.description} label="Description"></TextField>
                            {/* <FormControl fullWidth>
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
                            </FormControl> */}
                            <TextField variant="outlined" inputRef={locationInput} name="location" placeholder='Event location is empty and will not be altered' defaultValue={event.location} label="Location" ></TextField>
                            <DateTimePicker inputRef={eventDateTimeInput}
                                label="Event Date & Time"
                                format="YYYY-MM-DD HH:mm"
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
                                <Grid container spacing={2}>
                                   <Grid item xs={12} sm={12} md={12} lg={12}>
                                <TextField type="file" inputProps={{ accept: 'image/*' }} inputRef={eventProfilePictureInput} onChange={(e) => (setEventProfilePicture((e.target.files[0])), setEventProfilePictureToShow(URL.createObjectURL(e.target.files[0])))} />
                                </Grid>
                                <Grid item xs={7} sm={7} md={7} lg={7}>
                                <Box inputRef={eventProfileImg}
                                    component="img"
                                    style={{ width: "100%", height: "100%" }}
                                    src={eventProfilePictureToShow}
                                />
                                </Grid>
                               <Grid item xs={2} sm={2} md={2} lg={2} style={{margin: "auto"}}>
                               
                                <Button color="error" variant="contained" onClick={() => removeImage()}>Remove Image</Button>
                                </Grid>
                                
                                
                                </Grid>
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
                                label="Maximum participants"
                                placeholder='Maximum participants is empty and will not be altered'
                                value={maxParticipants}
                                onChange={handleNumberInputChanged}
                                variant="outlined"
                                type="number"
                                inputMode='numeric'
                                inputRef={maxParticipantsInput}
                            />
                            {loading && <LinearProgress />}
                            {successMessages && (<Alert severity='success' >{successMessages}</Alert>)}
                            {errorMessages && (<Alert severity='error'>{errorMessages}</Alert>)}
                            <Button color="primary" variant="contained" onClick={updateEvent}>Update Event</Button>
                            <Button color="error" variant="contained" onClick={() => setShowRemoveModal(true)}>Delete Event</Button>
                            <Button variant="contained" onClick={()=>handleClose()}>Back</Button>
                        </Stack>
                    </>
            }
        </div>
    );
};

export default EditEventPage;