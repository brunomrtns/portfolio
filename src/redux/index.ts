import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import projectsReducer from "./projects-slice";
import languageReducer from "./language-slice";
import chatReducer from "./slices/chat-slice";
import authReducer from "./slices/auth-slice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    language: languageReducer,
    chat: chatReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
