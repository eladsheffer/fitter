import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/modal";
import { postData, getData } from "../features/apiService";
import {Button, Checkbox, FormControlLabel, Stack, TextField, InputLabel, Select, MenuItem, FormControl, Box, Alert, Slider, Grid} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import sports from "../data-model/sports.json";
import { useParams, useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import PageTitle from "../components/PageTitle";
import LinearProgress from '@mui/material/LinearProgress';

const NewEventPage = (props) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const citiesUrl = process.env.REACT_APP_CITIES_URL;
  const streetsUrl = process.env.REACT_APP_STREETS_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { groupId } = useParams();
  groupId = useSelector((state) => state.modal.value.groupId) || groupId;

  const activeUser = useSelector((state) => state.user.value);
  const titleEventInput = useRef(null);
  const descriptionEventInput = useRef(null);
  const eventDateTimeInput = useRef(null);
  const eventSportTypeInput = useRef(null);
  const eventProfilePictureInput = useRef(null);
  const ageSliderInput = useRef(null);
  const eventGenderInput = useRef(null);
  const locationInput = useRef(null);

  const [errorMessages, setErrorMessages] = useState(null);
  const [successMessages, setSuccessMessages] = useState(null);
  const [formValues, setFormValues] = useState({
    title: true,
    description: true,
    location: true,
    sportType: true,
  });
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [city, setCity] = useState(null);
  const [street, setStreet] = useState(null);
  const [eventProfilePicture, setEventProfilePicture] = useState(null);
  const [disabledAgeSlider, setDisabledAgeSlider] = useState(true);
  const [ageRange, setAgeRange] = useState([20, 40]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStreets = async (city) => {
    const data = await getData(`${streetsUrl}&q=${city}`);
    if (!data) return;
    const streets = data.result.records.map((street) =>
      street.שם_רחוב.trim().replace("(", ")").replace(")", "(")
    );
    console.log("streets: ", streets);
    setStreets(streets);
  };

  useEffect(() => {
    const fetchCities = async () => {
      const data = await getData(citiesUrl);
      if (!data) return;
      const cities = data.result.records.map((city) =>
        city.שם_ישוב.trim().replace("(", ")").replace(")", "(")
      );
      setCities(cities);
    };

    fetchCities();

    // Cleanup function if needed
    return () => {
      // Cleanup code here, if any
    };
  }, []);

  useEffect(() => {
    if (city) {
      fetchStreets(city);
      setStreet(null);
    }
  }, [city]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let error = value === "" ? "required field" : false;
    setFormValues({ ...formValues, [name]: error });
  };

  const handleAutocompleteChangeCity = (event, value) => {
    if (!value) {
      setFormValues({ ...formValues, ["location"]: "required city" });
      setCity(null);
    } else {
      setCity(value);
      setFormValues({ ...formValues, ["location"]: false });
    }
  };

  const handleAutocompleteChangeStreet = (event, value) => {
    if (!value) {
      setFormValues({ ...formValues, ["location"]: "required street" });
      setStreet(null);
    } else {
      setStreet(value);
      setFormValues({ ...formValues, ["location"]: false });
    }
  };

  const handleNumberInputChanged = (event) => {
    // Extract the new value from the event
    const newValue = event.target.value;
    if (newValue.split("")[0] < "1" || newValue.split("")[0] > "9") {
      return;
    }
    // Filter out non-numeric characters and ensure it's non-negative
    setValue(newValue.replace(/[^0-9]/g, ""));
  };

  const createEvent = async () => {
    setErrorMessages(null);
    setSuccessMessages(null);

    if (activeUser == null) {
      alert("Please login to create an event");
      return;
    }

    if (
      !titleEventInput.current.value ||
      !descriptionEventInput.current.value ||
      !locationInput.current.value ||
      !eventSportTypeInput.current.value ||
      !eventDateTimeInput.current.value
    ) {
      console.log(
        `The form is not filled correctly: \nTitle: ${titleEventInput.current.value}\nDescription: ${descriptionEventInput.current.value}\nCity: ${city}\nStreet: ${street}\nSport Type: ${eventSportTypeInput.current.value}\nDate & Time: ${eventDateTimeInput.current.value}\nGender: ${eventGenderInput.current.value}`
      );
      setFormValues({
        title: !titleEventInput.current.value,
        description: !descriptionEventInput.current.value,
        location: !locationInput.current.value,
        sportType: !eventSportTypeInput.current.value,
      });
      return;
    }

    setLoading(true);

    let newEvent = new FormData();
    newEvent.append("title", titleEventInput.current.value);
    newEvent.append("description", descriptionEventInput.current.value);
    newEvent.append("location", locationInput.current.value);
    newEvent.append("date_and_time", eventDateTimeInput.current.value);
    newEvent.append("sport_type", eventSportTypeInput.current.value);
    if (eventProfilePicture)
      newEvent.append("image", eventProfilePicture);
    newEvent.append("min_age", disabledAgeSlider ? 0 : ageRange[0]);
    newEvent.append("max_age", disabledAgeSlider ? 120 : ageRange[1]);
    newEvent.append("gender", eventGenderInput.current.value);
    newEvent.append("max_participants", value);
    newEvent.append("organizer", activeUser.id);
    if (groupId) newEvent.append("group_organized", groupId);
    
    let path = serverUrl + "events/";
    let event = await postData(path, newEvent);
    setLoading(false);

    if (event && event.title) {
      setSuccessMessages(`Event "${event.title}" created successfully`);
    } else {
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
    if (activeThumb === 0) {
      setAgeRange([Math.min(newValue[0], ageRange[1]), ageRange[1]]);
    } else {
      setAgeRange([ageRange[0], Math.max(newValue[1], ageRange[0])]);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    navigate(-1);
  };

  let eventProfilePictureToShow = eventProfilePicture
    ? URL.createObjectURL(eventProfilePicture)
    : null;

  return (
    <div className="login">
      <PageTitle title={`Fitter - Create Event`} />
      <Stack spacing={2} margin={2}>
        <TextField
          variant="outlined"
          inputRef={titleEventInput}
          name="title"
          error={formValues.title}
          label="Title"
          helperText="required field"
          required
          onChange={handleChange}
        ></TextField>
        <TextField
         multiline
          variant="outlined"
          inputRef={descriptionEventInput}
          name="description"
          label="Description"
          error={formValues.description}
          helperText="required field"
          required
          onChange={handleChange}
        ></TextField>
        <TextField
          variant="outlined"
          inputRef={locationInput}
          name="location"
          error={formValues.location}
          label="Location"
          helperText="required field"
          required
          onChange={handleChange}
        ></TextField>
        {/* <FormControl fullWidth required>
          <Autocomplete
            disablePortal
            id="combo-box-location"
            options={cities}
            error={formValues.location}
            label="City"
            onChange={handleAutocompleteChangeCity}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                required
                error={formValues.location}
                onChange={handleAutocompleteChangeCity}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth required>
          <Autocomplete
            disablePortal
            id="combo-box-location"
            options={streets}
            error={formValues.location}
            label="Street"
            onChange={handleAutocompleteChangeStreet}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Street"
                required
                error={formValues.location}
                onChange={handleAutocompleteChangeStreet}
              />
            )}
          />
        </FormControl> */}

        <DateTimePicker
          required
          inputRef={eventDateTimeInput}
          label="Event Date & Time"
          format="YYYY-MM-DD HH:mm"
          //value={dayjs()}
          defaultValue={dayjs(dayjs().format("YYYY-MM-DD HH:mm"))}
          //onChange={(newValue) => setValue(newValue)}
        />
        <FormControl fullWidth required>
          <InputLabel
            id="demo-simple-select-label"
            error={formValues.sportType}
          >
            Sport Type
          </InputLabel>
          <Select
            inputRef={eventSportTypeInput}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="sportType"
            error={formValues.sportType}
            label="Sport Type"
            defaultValue={""}
            onChange={handleChange}
          >
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.name}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            ref={eventProfilePictureInput}
            onChange={(e) => setEventProfilePicture(e.target.files[0])}
          />
          </Grid>
          <Grid item xs={7} sm={7} md={7} lg={7}>
          <Box
            component="img"
            style={{ width: "100%", height: "100%" }}
            src={eventProfilePictureToShow}
          />
          </Grid>
          </Grid>
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            control={<Checkbox />}
            label="Event Age Range (Optional)"
            onChange={() => setDisabledAgeSlider(!disabledAgeSlider)}
          />
          <Slider
            ref={ageSliderInput}
            getAriaLabel={() => "Minimum distance"}
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
          <Select
            inputRef={eventGenderInput}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="gender"
            label="Gender"
            defaultValue={"mixed"}
          >
            <MenuItem value={"mixed"}>mixed</MenuItem>
            <MenuItem value={"men"}>men</MenuItem>
            <MenuItem value={"women"}>women</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Maximum participants (if empty, unlimited)"
          placeholder="Maximum participants. If empty, unlimited"
          value={value}
          onChange={handleNumberInputChanged}
          variant="outlined"
          type="number"
          inputMode="numeric"
        />
        {loading && <LinearProgress />}
        {successMessages && <Alert severity="success">{successMessages}</Alert>}
        {errorMessages && <Alert severity="error">{errorMessages}</Alert>}
        <Button color="primary" variant="contained" onClick={createEvent}>
          Create Event
        </Button>
        <Button color="secondary" variant="contained" onClick={handleClose}>
          Back
        </Button>
      </Stack>
    </div>
  );
};

export default NewEventPage;
