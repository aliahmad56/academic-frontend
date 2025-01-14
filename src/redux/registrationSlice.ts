import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  { AxiosError } from 'axios'; // Ensure axios and AxiosError are imported
import AxiosInterceptor from "../AxiosInterceptor";


// Define the type for the form data
interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: any;
  address: string;
  affiliation: string;
  researchInterests: string;
  language: string;
  academicQualification: string;
  researchPublication: string;
  membership: string;
}

// Define the state interface
export  interface RegistrationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Set the initial state
const initialState: RegistrationState = {
  loading: false,
  error: null,
  success: false,
};

// Create asyncThunk for the POST request
export const submitRegistration = createAsyncThunk(
  'registration/submitRegistration',
  async (data: RegistrationData, { rejectWithValue }) => {
    let url = "/researcher/registration"
    try {
      const response = await AxiosInterceptor.SECURE_API.post(url, data); // Replace with actual endpoint
      return response.data; // Success, return the response data
    } catch (error) {
      // Type cast the error to `AxiosError` if using axios
      const axiosError = error as AxiosError;

      // Check if there's a response error from the API
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data); // Reject with error message
      }

      // Fallback in case there's no response
      return rejectWithValue('Something went wrong'); // Handle network or other issues
    }
  }
);

// Create the slice
const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitRegistration.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Since the error is now a string, cast it
        state.success = false;
      });
  },
});

export default registrationSlice.reducer;
