import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./dataSlices/categorySlice";
import pinReducer from "./dataSlices/pinDetailSlice";

export const store = configureStore({
    reducer:{
        categories: categoriesReducer,
        pin: pinReducer,
    }
})