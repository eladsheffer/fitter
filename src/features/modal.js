import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    type: "",
    title: "",
    body: "",
    show: false,
    groupId: null,
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
        state.value.groupId = null;
        console.log("CLOSE MODAL");
        },

        renderModalType: (state, action) => {
            state.value.type = action.payload.type;
        },
        
        setGroupId: (state, action) => {
            state.value.groupId = action.payload.groupId;
        },
    },
    });

export const {showModal, closeModal, renderModalType, setGroupId} = modalSlice.actions;

export default modalSlice.reducer;