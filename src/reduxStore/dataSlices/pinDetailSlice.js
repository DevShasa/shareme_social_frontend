import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../sanity/client";
import { pinDetailQuery, getSimilarPins  } from "../../utils/sanityDataFetch";

const initialState = {
    pin: null,
    pinComments: [],
    similarPins: [],
    pinRequestStatus: 'idle', //idle, pending, success, failed
    similarPinsRquestStatus: 'idle'
}

export const getPinDetails = createAsyncThunk('pin/getPinData', async(pinId, {rejectWithValue})=>{
    try{
        const query = pinDetailQuery(pinId)
        const response = await client.fetch(query)
        return response
    }catch(error){
        console.log('error---->', error)
        console.log('data---->', error.response.data)
        return rejectWithValue(error.response.data)
    }
}) 

export const getPinsWithSimilarCategory = createAsyncThunk('pin/getSmiliarPins', async({categoryTitle, pinId}, {rejectWithValue}) =>{
    try{
        const query = getSimilarPins( categoryTitle, pinId)
        const response = await client.fetch(query)
        return response
    }catch(error){
        console.log('error---->', error)
        console.log('data---->', error.response.data)
        return rejectWithValue(error.response.data)
    }
})

const pinSlice = createSlice({
    name: "pin",
    initialState,
    extraReducers: (builder)=>{
        builder
            .addCase(getPinDetails.pending, (state, action)=>{
                state.pinRequestStatus = "pending"
            })
            .addCase(getPinDetails.fulfilled, (state, action)=>{
                state.pinRequestStatus = "success"
                state.pin = action.payload[0]
                state.pinComments = action.payload[0].comments ? action.payload[0].comments : []
            })
            .addCase(getPinsWithSimilarCategory.pending, (state, action)=>{
                state.similarPinsRquestStatus = "pending"
            })
            .addCase(getPinsWithSimilarCategory.fulfilled, (state, action)=>{
                state.similarPinsRquestStatus = "success"
                state.similarPins = action.payload
            })
    }

})

export default pinSlice.reducer
export const detail = (state) => state.pin.pin
export const comments = (state)=> state.pin.pinComments
export const similar = (state) => state.pin.similarPins
export const pinLoadingStatus = (state) => state.pin.pinRequestStatus
export const similarPinsStatus = (state) => state.pin.similarPinsRquestStatus