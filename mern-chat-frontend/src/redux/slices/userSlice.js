import { createSlice  } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addNotifications: (state, { payload }) => {
            // if this room already has unread msg
            if(state.newMessages[payload]) { 
                state.newMessages[payload] += 1;
            } 
            // else if this room has no unread msg before
            else { 
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            delete state.newMessages[payload];
        },
        addAvatarPicture: (state, { payload }) => {
            state.picture = payload;
        }
    },

    extraReducers: (builder) => {
        // save user after signup
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, { payload }) => payload);
        // save user after login
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
        // logout: destroy user session
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    }
});


export const { addNotifications, resetNotifications, addAvatarPicture } = userSlice.actions;
export default userSlice.reducer;