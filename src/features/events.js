import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    eventsAsHost: [],
    eventsAsParticipant: [],
    eventUpdated: false,
};

export const eventsSlice = createSlice({
    name: "events",
    initialState: {

        value: initialStateValue
    },
    reducers: {
        setEventsAsHost: (state, action) => {
            state.value.eventsAsHost = action.payload;
        },
        setEventsAsParticipant: (state, action) => {
            state.value.eventsAsParticipant = action.payload;
        }, 
        addEvent: (state, action) => {
            //state.value.eventsAsParticipant.push(action.payload);
        },
        removeEvent: (state, action) => {
            state.value.eventsAsParticipant = state.value.eventsAsParticipant.filter((event) => event.id !== action.payload.id);
        },

        updateEvent: (state) => {
            state.value.eventUpdated = !state.value.eventUpdated;
        },
    },
    });

export const { setEventsAsHost, setEventsAsParticipant, updateEvent } = eventsSlice.actions;

    export default eventsSlice.reducer;