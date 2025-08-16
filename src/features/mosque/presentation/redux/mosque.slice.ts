import { createSlice } from "@reduxjs/toolkit";
import { GetMosqueOutput } from "../../application/get-mosque.usecase";
import { SearchMosqueOutput } from "../../application/search-mosque.usecase";


interface MosqueState {
    foundMosques: SearchMosqueOutput;
    selectedMosqueId: string | null;
    selectedMosque: GetMosqueOutput;
}

const slice = createSlice({
    name: "mosque",
    initialState: {
        foundMosques: {
            items: [],
            totalCount: 0,
            page: 1,
            pageSize: 10,
        },
        selectedMosqueId: null,
        selectedMosque: null
    } as MosqueState,
    reducers: {
        setFoundMosques: (state, action: { payload: SearchMosqueOutput }) => {
            state.foundMosques = action.payload;
        },
        setSelectedMosqueId: (state, action: { payload: string }) => {
            state.selectedMosqueId = action.payload;
        },
        setSelectedMosque: (state, action: { payload: GetMosqueOutput }) => {
            state.selectedMosque = action.payload;
        }
    },
});

export const mosqueActions = slice.actions;
export const mosqueReducer = slice.reducer;