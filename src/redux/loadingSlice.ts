import type { RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface LoaderState {
  // <-- Make sure this is exported
  loading: boolean;
}

// Define the initial state using that type
const initialState: LoaderState = {
  loading: false,
};

export const loadingSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    removeLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setLoading, removeLoading } = loadingSlice.actions;

export const selectLoading = (state: RootState) => state.loader;

export default loadingSlice.reducer;
