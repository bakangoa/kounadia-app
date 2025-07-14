import { createAction } from "@reduxjs/toolkit";
import { SearchMosqueeInput } from "../../application/search-mosquee.usecase";

export const searchMosqueeAction = "mosquee/search";
export const searchMosquee = createAction<SearchMosqueeInput>(searchMosqueeAction);