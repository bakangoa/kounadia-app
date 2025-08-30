import { createAction } from "@reduxjs/toolkit";
import { LoginInput } from "../../application/login.usecase";
import { RegisterInput } from "../../application/register.usecase";


export const loginAction = createAction<LoginInput>("auth/login");
export const registerAction = createAction<RegisterInput>("auth/register");
