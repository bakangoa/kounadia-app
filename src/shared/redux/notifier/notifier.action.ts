import { createAction } from "@reduxjs/toolkit";


export const notifyErrorAction = createAction<string>("notifier/notifyError");
export const notifySuccessAction = createAction<string>("notifier/notifySuccess");
export const notifyInfoAction = createAction<string>("notifier/notifyInfo");