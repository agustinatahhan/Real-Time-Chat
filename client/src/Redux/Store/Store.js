import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import reducer from "../Reducer/reducer.js";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
