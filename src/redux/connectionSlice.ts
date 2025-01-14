import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import AxiosInterceptor from "../AxiosInterceptor";

export interface ConnectionState {
    users: User[];
    isLoading: boolean;
    error: string | null;
  }

interface User {
  _id: string;
  name: string;
}


// Define the initial state
const initialState: ConnectionState = {
  users: [],
  isLoading: false,
  error: null,
};

const API_URL_GET = '/api/user/display';

// Define the async thunk for fetching the data
export const fetchConnections = createAsyncThunk('connection/fetchConnections', async () => {
  const response = await AxiosInterceptor.SECURE_API.get(API_URL_GET);
  return response.data.user; // Assuming the API response contains the 'user' field
});

// Create the slice
const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload; // Update the users with the API response
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default connectionSlice.reducer;
