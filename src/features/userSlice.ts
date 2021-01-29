import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface USER {
    displayName: string;
    photoUrl: string;
    roomNo: string;
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: { uid: "", photoUrl: "", displayName: "", roomNo: "" },
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = { uid: "", photoUrl: "", displayName: "", roomNo: "" };
        },
        updateUserProfile: (state, action: PayloadAction<USER>) => {
            state.user.displayName = action.payload.displayName;
            state.user.photoUrl = action.payload.photoUrl;
            state.user.roomNo = action.payload.roomNo;
        },
    },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
