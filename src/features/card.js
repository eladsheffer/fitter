import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    group: null,
    event: null,
    type: "",
    title: "",
    body: "",
    isMember: false,
    isAdmin: false,
};

export const cardSlice = createSlice({
    name: "card",
    initialState: {
        value: initialStateValue
    },
    reducers: {
        makeAdmin: (state) => {
            state.value.isAdmin = true;
        },
        makeMember: (state) => {
            state.value.show = true;
        },
        removeAdmin: (state) => {
            state.value.isAdmin = false;
        },
        removeMember: (state) => {
            state.value.show = false;
        },
        setGroup: (state, action) => {
            state.value.group = action.payload.group;
        },
        setEvent: (state, action) => {
            state.value.event = action.payload.event;
        },


        renderCardType: (state, action) => {
            state.value.type = action.payload.type;
        },
    },
});

export const { renderCardType, makeAdmin, makeMember, removeAdmin, removeMember, setGroup, setEvent } = cardSlice.actions;

export default cardSlice.reducer;