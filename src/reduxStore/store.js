import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./dataSlices/categorySlice";

export const store = configureStore({
    reducer:{
        categories: categoriesReducer,
    }
})