import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = false;

export const modalSlice = createSlice({
    name: "modal",
    initialState: {
        //user: null,
        value: initialStateValue
    },
    reducers: {
        showModal: (state) => {
        state.value = true;
        },
        closeModal: (state) => {
        state.value = initialStateValue
        },
    },
    });

export const {showModal, closeModal} = modalSlice.actions;

export default modalSlice.reducer;