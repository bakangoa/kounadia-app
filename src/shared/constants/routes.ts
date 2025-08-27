import { Href } from "expo-router";

export const routes: { [key: string]: Href } = {
    HOME: "/home",
    ADD: "/add",
    ADD_FORM: "/add-form",
    MOSQUE_DETAILS: "/mosque/[id]",
    LOGIN: "/login",
    REGISTER: "/register"
}