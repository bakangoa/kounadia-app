import { createAction } from "@reduxjs/toolkit";
import { GetMosqueInput } from "../../application/get-mosque.usecase";
import { SearchMosqueInput } from "../../application/search-mosque.usecase";

export const searchMosqueAction = "mosque/search";
export const searchMosque = createAction<SearchMosqueInput>(searchMosqueAction);

export const getMosque = createAction<GetMosqueInput>("mosque/get");