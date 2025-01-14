import type { RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface LanguageState {
  selectedLanguage: string;
}

// Define the initial state using that type
const initialState: LanguageState = {
  selectedLanguage: "en", // Default language
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    clearLanguageInfo: (state) => {
      state.selectedLanguage = "";
    },
  },
});

export const { setLanguage, clearLanguageInfo } = languageSlice.actions;

export const selectLanguage = (state: RootState) =>
  state.language.selectedLanguage;

export default languageSlice.reducer;
