import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for each upload
export interface SpecificUploads {
  allowedUsers: string[];
  authorName: string;
  category: string[];
  copyRightType: string;
  createdAt: string;
  downloadPermission: string;
  fileName: string;
  key: string;
  permission: string;
  publicationYear: string;
  searchVisibility: boolean;
  title: string;
  typeAccess: string;
  typeFile: string;
  updatedAt: string;
  url: string;
  userId: string;
  _id: string;
}

// Define a type for the slice state
export interface SpecificUploadState {
  specificUserUploads: SpecificUploads[];
  currentspecificUploadPage: number;
  totalSpecificUploads: number;
  totalSpecificUploadsPages: number;
}

// Define the initial state using that type
const initialState: SpecificUploadState = {
  specificUserUploads: [],
  currentspecificUploadPage: 1,
  totalSpecificUploads: 0,
  totalSpecificUploadsPages: 1,
};

export const specificUploadSlice = createSlice({
  name: "specific_uploads",
  initialState,
  reducers: {
    setSpecificUploadsInRedux: (
      state,
      action: PayloadAction<{
        specific_uploads: SpecificUploads[];
        currentspecificUploadPage: number;
        totalSpecificUploads: number;
        totalSpecificUploadsPages: number;
      }>
    ) => {
      // Replace the specific_uploads with the new data
      state.specificUserUploads = action.payload.specific_uploads;
      state.currentspecificUploadPage =
        action.payload.currentspecificUploadPage;
      state.totalSpecificUploads = action.payload.totalSpecificUploads;
      state.totalSpecificUploadsPages =
        action.payload.totalSpecificUploadsPages;
    },
    removeAllSpecificUploadsFromRedux: (state) => {
      state.specificUserUploads = [];
      state.currentspecificUploadPage = 1;
      state.totalSpecificUploads = 0;
      state.totalSpecificUploadsPages = 1;
    },
    addSpecificUpload: (state, action: PayloadAction<SpecificUploads>) => {
      state.specificUserUploads.push(action.payload);
      state.totalSpecificUploads += 1;
    },
    removeSpecificUpload: (state, action: PayloadAction<string>) => {
      state.specificUserUploads = state.specificUserUploads.filter(
        (upload) => upload._id !== action.payload
      );
      state.totalSpecificUploads -= 1;
    },
    updateSpecificUpload: (state, action: PayloadAction<SpecificUploads>) => {
      const index = state.specificUserUploads.findIndex(
        (upload) => upload._id === action.payload._id
      );
      if (index !== -1) {
        state.specificUserUploads[index] = action.payload;
      }
    },
  },
});

export const {
  setSpecificUploadsInRedux,
  removeAllSpecificUploadsFromRedux,
  addSpecificUpload,
  removeSpecificUpload,
  updateSpecificUpload,
} = specificUploadSlice.actions;

export const selectSpecificUploads = (state: RootState) =>
  state.specific_uploads.specificUserUploads;
export const selectCurrentspecificUploadPage = (state: RootState) =>
  state.specific_uploads.currentspecificUploadPage;
export const selectTotalSpecificUploads = (state: RootState) =>
  state.specific_uploads.totalSpecificUploads;
export const selectTotalSpecificUploadsPages = (state: RootState) =>
  state.specific_uploads.totalSpecificUploadsPages;

export default specificUploadSlice.reducer;
