import { createSlice } from "@reduxjs/toolkit";
import { SearchMosqueeOutput } from "../../application/search-mosquee.usecase";


interface MosqueeState {
    foundMosquees: SearchMosqueeOutput;
}

const slice = createSlice({
    name: "mosquee",
    initialState: {
        foundMosquees: {
            items: [],
            totalCount: 0,
            page: 1,
            pageSize: 10,
        },
    } as MosqueeState,
    reducers: {
        setFoundMosquees: (state, action: { payload: SearchMosqueeOutput }) => {
            state.foundMosquees = action.payload;
        },
    },
});

export const mosqueeActions = slice.actions;
export const mosqueeReducer = slice.reducer;