// slice fetches data for user page
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../sanity/client";
import {
	fetchPinsCreatedByUser,
	fetchPinsSavedByUser,
} from "../../utils/sanityDataFetch";

const initialState = {
	userCreatedPins: [],
	userSavedPins: [],
	userPinsStatus: "idle", // idle | pending | success
	userSavedPinsStatus: "idle", // idle | pending | success
};

// fetch pins created by user
export const getUserPins = createAsyncThunk(
	"userPins/fetchCreated",
	async (user_id, { rejectWithValue }) => {
		try {
			const query = fetchPinsCreatedByUser(user_id);
			const results = await client.fetch(query);
			return results;
		} catch (error) {
			console.log("getUserPins Error----->", error);
			console.log("getUserPins Error Data----->", error.response.data);
			return rejectWithValue(error.response.data);
		}
	}
);

export const getUserSavedPins = createAsyncThunk(
	"userPins/getSavedPins",
	async (user_id, { rejectWithValue }) => {
		try {
			const query = fetchPinsSavedByUser(user_id);
			const results = await client.fetch(query);
			return results;
		} catch (error) {
			console.log("getUserPins Error----->", error);
			console.log("getUserPins Error Data----->", error.response.data);
			return rejectWithValue(error.response.data);
		}
	}
);

const userPinsSlice = createSlice({
	name: "userPins",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(getUserPins.pending, (state) => {
				state.userPinsStatus = "pending";
			})
			.addCase(getUserPins.fulfilled, (state, action) => {
				state.userPinsStatus = "success";
				state.userCreatedPins = action.payload ? action.payload : [];
			})
			.addCase(getUserSavedPins.pending, (state) => {
				state.userSavedPinsStatus = "pending";
			})
			.addCase(getUserSavedPins.fulfilled, (state, action) => {
				state.userSavedPinsStatus = "success";
				state.userSavedPins = action.payload ? action.payload : [];
			});
	},
});

export default userPinsSlice.reducer;
export const userPins = (state) => state.userPins.userCreatedPins;
export const userSaved = (state) => state.userPins.userSavedPins;
export const userPinsStatus = (state) => state.userPins.userPinsStatus;
export const savedPinsStatus = (state) => state.userPins.userSavedPinsStatus;
