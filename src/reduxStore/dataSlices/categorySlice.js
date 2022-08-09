import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../sanity/client";
import { fetchCategories } from "../../utils/sanityDataFetch";

const initialState = {
    categories: [],
    status: "idle", // idle, pending, success, failed
    error: null,
}

export const getAllCategories = createAsyncThunk('categories/fetchAll', async(_, {rejectWithValue})=>{
    try{
        const fetchQuery = fetchCategories()
        const response = await client.fetch(fetchQuery)
        return response
    }catch(error){
        console.log('error---->', error)
        console.log('data---->', error.response.data)
        return rejectWithValue(error.response.data)
    }
})

const categoriesSlice = createSlice({
    name:'categories',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
            .addCase(getAllCategories.pending, (state, action)=>{
                state.status = "pending"
            })
            .addCase(getAllCategories.fulfilled, (state,action)=>{
                state.categories = action.payload
                state.status = "success"
            })
            .addCase(getAllCategories.rejected, (state, action)=>{
                state.status = "failed"
                state.error = action.payload;
            });
    }
});

export default categoriesSlice.reducer
export const categoriesFromStore = (state) => state.categories.categories
export const categoryFetchStatus = (state) => state.categories.status
export const categoryFetchError = (state) => state.categories.error