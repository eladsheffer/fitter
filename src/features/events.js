import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    eventsAsHost: [],
    eventsAsParticipant: [],
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
    },
    });

export const { setEventsAsHost, setEventsAsParticipant } = eventsSlice.actions;

    export default eventsSlice.reducer;