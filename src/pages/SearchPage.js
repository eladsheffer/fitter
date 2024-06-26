import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import EventCard from '../components/EventCard';
import { Button, Row, Col, Container, ToggleButton, ButtonGroup } from 'react-bootstrap';
import { getData } from '../features/apiService';
import SearchFilter from '../components/SearchFilter';

export default function SearchPage() {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { groupsData = [], eventsData = [] } = location.state || {};
    const [groups, setGroups] = useState(groupsData);
    const [events, setEvents] = useState(eventsData);
    const [filteredGroups, setFilteredGroups] = useState(groupsData);
    const [filteredEvents, setFilteredEvents] = useState(eventsData);
    const key = queryParams.get('key');
    const [searchType, setSearchType] = useState('groups');
    const [selectedGroupFilters, setSelectedGroupFilters] = useState({
        location: [],
        gender : [],
    });
    const [selectedEventFilters, setSelectedEventFilters] = useState({
        location: [],
        sport_type: [],
        gender: [],
    });

    // Group filters
    const groupLocationsArray = groups.map(group => group.location).filter(location => location !== null && location !== '');
    const groupLocations = [...new Set(groupLocationsArray)];
    const groupGendersArray = groups.map(group => group.gender)
    const groupGenders = [...new Set(groupGendersArray)];

    // Event filters
    const eventLocationsArray = events.map(event => event.location).filter(location => location !== null && location !== '');
    const eventLocations = [...new Set(eventLocationsArray)];
    const eventSportsTypesArray = events.map(event => event.sport_type).filter(sportType => sportType !== null && sportType !== '');
    const eventSportsTypes = [...new Set(eventSportsTypesArray)];
    const eventGendersArray = events.map(event => event.gender)
    const eventGenders = [...new Set(eventGendersArray)];

    const fetchGroups = async () => {
        let groupsData = await getData(serverUrl + `groups/?search=${key}`);
        setGroups(groupsData.results);
        setFilteredGroups(groupsData.results);
    };

    const fetchEvents = async () => {
        let eventsData = await getData(serverUrl + `events/?search=${key}`);
        setEvents(eventsData.results);
        setFilteredEvents(eventsData.results);
    };

    useEffect(() => {
        if (searchType === 'groups') {
            fetchGroups();
        } else {
            fetchEvents();
        }
    }, [searchType]);

    useEffect(() => {
        applyFilters();
    }, [selectedGroupFilters, selectedEventFilters, groups, events]);

    const handleFilterChange = (filterType, value) => {
        if (searchType === 'groups') {
            setSelectedGroupFilters(prevFilters => {
                const updatedFilters = { ...prevFilters };
                // Update the group filter
                if (updatedFilters[filterType].includes(value)) {
                    updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
                } else {
                    updatedFilters[filterType].push(value);
                }
                return updatedFilters;
            });
        } else {
            setSelectedEventFilters(prevFilters => {
                const updatedFilters = { ...prevFilters };
                // Update the event filter
                if (updatedFilters[filterType].includes(value)) {
                    updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
                } else {
                    updatedFilters[filterType].push(value);
                }
                return updatedFilters;
            });
        }
    };

    const applyFilters = () => {
        if (searchType === 'groups') {
            let filtered = groups;
            // Apply group filters
            Object.keys(selectedGroupFilters).forEach(filterType => {
                if (selectedGroupFilters[filterType].length > 0) {
                    filtered = filtered.filter(group => selectedGroupFilters[filterType].includes(group[filterType]));
                }
            });
            setFilteredGroups(filtered);
        } else {
            let filtered = events;
            // Apply event filters
            Object.keys(selectedEventFilters).forEach(filterType => {
                if (selectedEventFilters[filterType].length > 0) {
                    filtered = filtered.filter(event => selectedEventFilters[filterType].includes(event[filterType]));
                }
            });
            setFilteredEvents(filtered);
        }
    };

    // const resetFilters = () => {
    //     if (searchType === 'groups') {
    //         setSelectedGroupFilters({
    //             location: [],
    //             gender: [],
    //         });
    //     }
    //     if (searchType === 'events') {
    //         setSelectedEventFilters({
    //             location: [],
    //             sport_type: [],
    //             gender: [],
    //         });
    //     }
    // }


    return (
        <Container>
            <Row className="my-4 justify-content-center">
                <Col xs="auto" className="text-center">
                    <h1>Search Page</h1>
                    <p>Search key: {key}</p>
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
                            onChange={() => setSearchType('events')}
                        >
                            Events
                        </ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto" className="text-start mx-5" style={{ width: '20%' }}>
                    <h2>Filters</h2>
                    {searchType === 'groups' ?
                        (
                            <>
                                {groupLocations.length > 0 && <SearchFilter title="Locations" data={groupLocations} filterType="location" onFilterChange={handleFilterChange} />}
                                {groupGenders.length > 0 && <SearchFilter title="Gender" data={groupGenders} filterType="gender" onFilterChange={handleFilterChange} />}
                            </>
                        ) :
                        (
                            <>
                                {eventLocations.length > 0 && <SearchFilter title="Locations" data={eventLocations} filterType="location" onFilterChange={handleFilterChange} />}
                                {eventSportsTypes.length > 0 && <SearchFilter title="Sport Types" data={eventSportsTypes} filterType="sport_type" onFilterChange={handleFilterChange} />}
                                {eventGenders.length > 0 && <SearchFilter title="Gender" data={eventGenders} filterType="gender" onFilterChange={handleFilterChange} />}
                            </>
                        )}
                </Col>
                <Col xs="auto" style={{ width: '65%' }}>
                    <h2>Search Results</h2>
                    {searchType === 'groups' ? (
                        <div style={{ width: '100%' }}>
                            <h3>Groups</h3>
                            {filteredGroups.length > 0 ? (
                                filteredGroups.map(group =>
                                    <GroupCard key={group.id} group={group} />
                                )
                            ) : (
                                <p>No groups found</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3>Events</h3>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event =>
                                    <EventCard key={event.id} event={event} />
                                )
                            ) : (
                                <p>No events found</p>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
