import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    type: "",
    title: "",
    body: "",
    show: false,
};

export const modalSlice = createSlice({
    name: "modal",
    initialState: {
        //user: null,
        value: initialStateValue
    },
    reducers: {
        showModal: (state) => {
        state.value.show = true;
        console.log("SHOW MODAL")
        },
        closeModal: (state) => {
        state.value.show = false;
        console.log("CLOSE MODAL");
        },

        renderModalType: (state, action) => {
            state.value.type = action.payload.type;
        },
    },
    });

export const {showModal, closeModal, renderModalType} = modalSlice.actions;

export default modalSlice.reducer;