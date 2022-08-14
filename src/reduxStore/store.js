import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./dataSlices/categorySlice";
import pinReducer from "./dataSlices/pinDetailSlice";
import userPinsReducer from "./dataSlices/userDetailSlice";

export const store = configureStore({
    reducer:{
        categories: categoriesReducer,
        pin: pinReducer,
        userPins: userPinsReducer
    }
})