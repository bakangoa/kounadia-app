import { createAction } from "@reduxjs/toolkit";
import { Href } from "expo-router";

export interface NavigateForwardPayload {
    routeName: Href;
    params?: any;
}
export const ForwardAction = "navigation/push";
export const forward = createAction<NavigateForwardPayload>(ForwardAction);

export const BackAction = "navigation/back";
export const back = createAction(BackAction);

export interface NavigateReplacePayload {
    routeName: Href;
    params?: any;
}
export const ReplaceAction = "navigation/replace";
export const replace = createAction<NavigateReplacePayload>(ReplaceAction);