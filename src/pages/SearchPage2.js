import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import EventCard from '../components/EventCard';
import { Button, Row, Col, Container, ToggleButton, ButtonGroup, Dropdown, Form } from 'react-bootstrap';
import { getData } from '../features/apiService';
import SearchFilter from '../components/SearchFilter';
import GroupCard3 from '../components/GroupCard3';
import EventCard3 from '../components/EventCard3';
import RootModal from '../components/RootModal';
import { LinearProgress } from '@mui/material';
import { Slider } from '@mui/material';

export default function SearchPage() {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const checkboxRefs = useRef({});

    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(false);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    // const key = queryParams.get('key');
    const [searchType, setSearchType] = useState('groups');

    const [selectedFilters, setSelectedFilters] = useState({
        location: [],
        sport_type: [],
        gender: [],
    });
    const [ageRange, setAgeRange] = useState([0, 120]);
    const [filterAge, setFilterAge] = useState(false);
    const ageSliderInput = React.createRef();

    const [reset, setReset] = useState(false);

    // Group filters
    const groupLocationsArray = groups.map(group => group.location).filter(location => location !== "");
    const groupLocations = [...new Set(groupLocationsArray)];
    const groupGendersArray = groups.map(group => group.gender).filter(sport => sport !== "");
    const groupGenders = [...new Set(groupGendersArray)];
    const groupSportsTypesArray = groups.flatMap(group => group.preferred_sports.map(sport=>sport[0].toUpperCase()+sport.slice(1))).filter(sport => sport !== "");
    const groupSportsTypes = [...new Set(groupSportsTypesArray)];

    // Event filters
    const eventLocationsArray = events.map(event => event.location).filter(location => location !== "");
    const eventLocations = [...new Set(eventLocationsArray)];
    const eventSportsTypesArray = events.map(event => event.sport_type).filter(sport => sport !== "");
    const eventSportsTypes = [...new Set(eventSportsTypesArray)];
    const eventGendersArray = events.map(event => event.gender);
    const eventGenders = [...new Set(eventGendersArray)];

    const fetchGroups = async () => {
        setLoading(true);
        let url = `${serverUrl}groups/`;
        let groupsData = await getData(url);
        setGroups(groupsData);
        url = `${serverUrl}groups/?location=${selectedFilters.location}&sport_type=${selectedFilters.sport_type}&gender=${selectedFilters.gender}&age_range=${ageRange[0]}-${ageRange[1]}`;
        groupsData = await getData(url);
        setFilteredGroups(groupsData);
        setLoading(false);
    };

    const fetchEvents = async () => {
        setLoading(true);
        let url = `${serverUrl}events/`;
        let eventsData = await getData(url);
        setEvents(eventsData);
        url = `${serverUrl}events/?location=${selectedFilters.location}&sport_type=${selectedFilters.sport_type}&gender=${selectedFilters.gender}&age_range=${ageRange[0]}-${ageRange[1]}`;
        eventsData = await getData(url);
        setFilteredEvents(eventsData);
        setLoading(false);
    };

    const applyAgeFilter = (event) => {
        if (!event.target.checked) {
            setAgeRange([0, 120]);
        };
    };


    const handleFilterChange = (filterType, event) => {
        let value = event.target.name;
        let checked = event.target.checked;
        setSelectedFilters(prevState => ({
            ...prevState,
            [filterType]: checked ? [...prevState[filterType], value] : prevState[filterType].filter(v => v !== value)
        }));
    };

    useEffect(() => {
        applyFilters();
    }, [filter, searchType, reset]);

    const applyFilters = () => {
        if (searchType === 'groups') {
            fetchGroups();
        } else {
            fetchEvents();
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

    const resetFilters = () => {
        Object.values(checkboxRefs.current).forEach(ref => {
            if (ref) ref.checked = false; // Directly manipulate the DOM element
        });


        setSelectedFilters({
            location: [],
            sport_type: [],
            gender: [],
        });

        setAgeRange([0, 120]);
        setFilterAge(false);
        setReset(!reset);
    }

    return (
        <div>
            <RootModal hideButton />
            <Row className="my-4 justify-content-center">
                <Col xs="auto" className="text-center">
                    <h1>Search Page</h1>
                    {/* <p>Search key: {key}</p> */}
                </Col>
            </Row>
            <Row className="mb-3 justify-content-center">
                <Col xs="auto">
                    <ButtonGroup toggle>
                        <ToggleButton
                            id="toggle-groups"
                            type="radio"
                            variant={searchType === 'groups' ? 'primary' : 'outline-primary'}
                            name="radio"
                            value="groups"
                            checked={searchType === 'groups'}
                            onChange={() => setSearchType('groups')}
                        >
                            Groups
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-events"
                            type="radio"
                            variant={searchType === 'events' ? 'primary' : 'outline-primary'}
                            name="radio"
                            value="events"
                            checked={searchType === 'events'}
                            onChange={() => (resetFilters(),setSearchType('events'))}
                        >
                            Events
                        </ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row className='d-flex justify-content-around'>
                <Col lg="2" md="2" xs="3" style={{marginInline:"auto"}} >
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown1" className="text-wrap" style={{ borderRadius: "20px" }} >
                            Locations Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {searchType === 'groups' ? (
                                groupLocations.map((location) => (
                                    <Form.Check
                                        style={{ margin: "10px" }}
                                        name={location}
                                        label={location}
                                        type="checkbox"
                                        //defaultChecked={props?.searchIn?.title}
                                        onChange={(event) => handleFilterChange("location", event)}
                                        ref={el => checkboxRefs.current[location] = el}
                                    />))) :
                                (eventLocations.map((location) => (
                                    <Form.Check
                                        style={{ margin: "10px" }}
                                        name={location}
                                        label={location}
                                        type="checkbox"
                                        //defaultChecked={props?.searchIn?.title}
                                        onChange={(event) => handleFilterChange("location", event)}
                                        ref={el => checkboxRefs.current[location] = el}
                                    />)))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col lg="2" md="2" sm="2" xs="3"  style={{marginInline:"auto"}}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown1" className="text-wrap" style={{ borderRadius: "20px" }} >
                            Gender Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {searchType === 'groups' ? (
                                groupGenders.map((gender) => (
                                    <Form.Check
                                        style={{ margin: "10px" }}
                                        name={gender}
                                        label={gender}
                                        type="checkbox"
                                        //defaultChecked={props?.searchIn?.title}
                                        onChange={(event) => handleFilterChange("gender", event)}
                                        ref={el => checkboxRefs.current[gender] = el}
                                    />))) :
                                (eventGenders.map((gender) => (
                                    <Form.Check
                                        style={{ margin: "10px" }}
                                        name={gender}
                                        label={gender}
                                        type="checkbox"
                                        //defaultChecked={props?.searchIn?.title}
                                        onChange={(event) => handleFilterChange("gender", event)}
                                        ref={el => checkboxRefs.current[gender] = el}
                                    />)))}

                            {/* {groupLocations.map((location, i) => (
                        <Dropdown.Item key={location}>{location}</Dropdown.Item>
                      ))} */}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col lg="2" md="2" xs="3"  style={{marginInline:"auto"}}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown1" className="text-wrap" style={{ borderRadius: "20px" }} >
                            Sport Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {searchType === 'groups' ? (
                                groupSportsTypes.map((sport) => (
                                    <Form.Check
                                        style={{ margin: "10px" }}
                                        name={sport}
                                        label={sport}
                                        type="checkbox"
                                        //defaultChecked={props?.searchIn?.title}
                                        onChange={(event) => handleFilterChange("sport_type", event)}
                                        ref={el => checkboxRefs.current[sport] = el}
                                    />))) :

                                (eventSportsTypes.map((sport) => (
                                    <Form.Check
                                        style={{ margin: "10px" }}
                                        name={sport}
                                        label={sport}
                                        type="checkbox"
                                        //defaultChecked={props?.searchIn?.title}
                                        onChange={(event) => handleFilterChange("sport_type", event)}
                                        ref={el => checkboxRefs.current[sport] = el}
                                    />)))}

                            {/* {groupLocations.map((location, i) => (
                        <Dropdown.Item key={location}>{location}</Dropdown.Item>
                      ))} */}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
                <Row className="d-flex justify-content-around" style={{ marginTop: "2rem" }}>
                <Col lg="4" md="4" sm="6" xs="10" style={{marginInline:"auto"}}>
                    <Form.Group style={{textAlign:"center"}} className="mb-3" controlId="min-max">
                        <Form.Label style={{padding: "10px",color: "white", backgroundColor:"blue", borderRadius: "40%", margin:"-10px"}}>Age Range</Form.Label>
                        <Slider ref={ageSliderInput}
                            getAriaLabel={() => 'Minimum distance'}
                            value={ageRange}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            // getAriaValueText={valuetext}
                            disableSwap
                            disabled={false}
                            max={120}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center" style={{ marginTop: "2rem" }}>
                <Col lg="2" md="3" sm="3" xs="4" style={{marginLeft:"auto"}}>
                    <Button variant="info" onClick={() => (applyFilters(), setFilter(!filter))}>Apply Filters</Button>
                </Col>
                <Col lg="2" md="3" sm="3" xs="4" style={{marginRight:"auto"}}>
                    <Button variant="info" onClick={()=>(resetFilters())}>Reset Filters</Button>
                </Col>
            </Row>

            <Row className="justify-content-center my-4">

                <Col lg="1" xs="4" className="me-4"></Col>
                <Col xs="auto" style={{ width: '80%' }}>
                    <h2>Search Results</h2>
                    {searchType === 'groups' ? (
                        <div style={{ width: '100%' }}>
                            <h3>Groups</h3>
                            {loading ? <LinearProgress /> : null}
                            {filteredGroups.length > 0 ? (
                                filteredGroups.map(group =>
                                    <GroupCard3 key={group.id} group={group} />
                                )
                            ) : (!loading &&
                                <p>No groups found</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3>Events</h3>
                            {loading ? <LinearProgress /> : null}
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event =>
                                    <EventCard3 key={event.id} event={event} />
                                )
                            ) : (!loading &&
                                <p>No events found</p>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
}
