import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    groupsAsAdmin: [],
    groupsAsMember: [],
    groupUpdated: false,
};

export const groupsSlice = createSlice({
    name: "groups",
    initialState: {

        value: initialStateValue
    },
    reducers: {
        setGroupsAsAdmin: (state, action) => {
            state.value.groupsAsAdmin = action.payload;
        },
        setGroupsAsMember: (state, action) => {
            state.value.groupsAsMember = action.payload;
        }, 
        addGroup: (state, action) => {
            //state.value.groupsAsMember.push(action.payload);
        }, 
        removeGroup: (state, action) => {
            state.value.groupsAsMember = state.value.groupsAsMember.filter((group) => group.id !== action.payload.id);
        }, 

        updateGroup: (state) => {
            state.value.groupUpdated = !state.value.groupUpdated;
        },
        
    },
    });

export const { setGroupsAsAdmin, setGroupsAsMember, addGroup, removeGroup, updateGroup } = groupsSlice.actions;

    export default groupsSlice.reducer;