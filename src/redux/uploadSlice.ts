import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for each upload
export interface Upload {
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
export interface UploadState {
  userUploads: Upload[];
  currentUploadPage: number;
  totalUploads: number;
  totalUploadPages: number;
}

// Define the initial state using that type
const initialState: UploadState = {
  userUploads: [],
  currentUploadPage: 1,
  totalUploads: 0,
  totalUploadPages: 1,
};

export const uploadSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    setUploadsInRedux: (
      state,
      action: PayloadAction<{
        uploads: Upload[];
        currentUploadPage: number;
        totalUploads: number;
        totalUploadPages: number;
      }>
    ) => {
      // Replace the uploads with the new data
      state.userUploads = action.payload.uploads;
      state.currentUploadPage = action.payload.currentUploadPage;
      state.totalUploads = action.payload.totalUploads;
      state.totalUploadPages = action.payload.totalUploadPages;
    },
    removeAllUploadsFromRedux: (state) => {
      state.userUploads = [];
      state.currentUploadPage = 1;
      state.totalUploads = 0;
      state.totalUploadPages = 1;
    },
    addUpload: (state, action: PayloadAction<Upload>) => {
      state.userUploads.push(action.payload);
      state.totalUploads += 1;
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      state.userUploads = state.userUploads.filter(
        (upload) => upload._id !== action.payload
      );
      state.totalUploads -= 1;
    },

    updateUpload: (state, action: PayloadAction<Upload>) => {
      const index = state.userUploads.findIndex(
        (upload) => upload._id === action.payload._id
      );
      if (index !== -1) {
        // Merge the new data with the existing file data
        state.userUploads[index] = {
          ...state.userUploads[index], // Keep the existing file data
          ...action.payload, // Override with the new data, but keep fileName if not provided
        };
      }
    },
  },
});

export const {
  setUploadsInRedux,
  removeAllUploadsFromRedux,
  addUpload,
  removeUpload,
  updateUpload,
} = uploadSlice.actions;

export const selectUploads = (state: RootState) => state.uploads.userUploads;
export const selectCurrentUploadPage = (state: RootState) =>
  state.uploads.currentUploadPage;
export const selectTotalUploads = (state: RootState) =>
  state.uploads.totalUploads;
export const selectTotalUploadPages = (state: RootState) =>
  state.uploads.totalUploadPages;

export default uploadSlice.reducer;
