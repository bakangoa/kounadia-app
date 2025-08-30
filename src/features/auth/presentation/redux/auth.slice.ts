import { createSlice } from "@reduxjs/toolkit";


const initialState: {
    loginPhone: string | null;
    session: {
        token: string;
    } | null;
} = {
    loginPhone: null,
    session: null
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoginPhone: (state, action: { payload: string }) => {
            state.loginPhone = action.payload;
        },
        setSession: (state, action: { payload: { token: string } }) => {
            state.session = action.payload;
        }
    }
});

export const AuthActions = slice.actions;
export const authReducer = slice.reducer;