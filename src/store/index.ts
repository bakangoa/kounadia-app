
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector, useStore } from "react-redux";
import { authReducer } from "../features/auth/presentation/redux/auth.slice";
import { mosqueReducer } from "../features/mosque/presentation/redux/mosque.slice";
import { expireMiddleware } from "../shared/redux/expiration.middleware";
import { statusManagerReducer } from "../shared/redux/status-manager.slice";
import { listenerMiddleware } from "./listener";

const reducers = combineReducers({
    status: statusManagerReducer,
    auth: authReducer,
    mosque: mosqueReducer
});

export const makeStore = () => {
    return configureStore({
        reducer: reducers,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false })
                .concat([
                    expireMiddleware,
                    listenerMiddleware.middleware
                ])
    });
};

export const store = makeStore();

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;