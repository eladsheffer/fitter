import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = null;{
    //user: null,
    //name: "", email: "", password: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState: {
        //user: null,
        value: initialStateValue
    },
    reducers: {
        login: (state, action) => {
        state.value = action.payload;
        },
        logout: (state) => {
        state.value = initialStateValue
        },
    },
    });

export const { login, logout } = userSlice.actions;

    export default userSlice.reducer;