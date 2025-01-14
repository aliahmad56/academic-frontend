import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for each file
export interface SpecificFile {
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
export interface SpecificFileState {
  userSpecificFiles: SpecificFile[];
  currentPage: number;
  totalFiles: number;
  totalPages: number;
}

// Define the initial state using that type
const initialState: SpecificFileState = {
  userSpecificFiles: [],
  currentPage: 1,
  totalFiles: 0,
  totalPages: 1,
};

export const specificFileSlice = createSlice({
  name: "specifc_files",
  initialState,
  reducers: {
    setSpecificFilesInRedux: (
      state,
      action: PayloadAction<{
        specific_files: SpecificFile[];
        currentPage: number;
        totalFiles: number;
        totalPages: number;
      }>
    ) => {
      const newSpecificFiles = action.payload.specific_files.filter(
        (newFile) =>
          !state.userSpecificFiles.some(
            (existingFile) => existingFile._id === newFile._id
          )
      );
      state.userSpecificFiles = [
        ...state.userSpecificFiles,
        ...newSpecificFiles,
      ];
      state.currentPage = action.payload.currentPage;
      state.totalFiles = action.payload.totalFiles;
      state.totalPages = action.payload.totalPages;
    },

    setPaginatedSpecificFilesInRedux: (
      state,
      action: PayloadAction<{
        specific_files: SpecificFile[];
        currentPage: number;
        totalFiles: number;
        totalPages: number;
      }>
    ) => {
      state.userSpecificFiles = [...action.payload.specific_files];
      state.currentPage = action.payload.currentPage;
      state.totalFiles = action.payload.totalFiles;
      state.totalPages = action.payload.totalPages;
    },
    updateSpecificFileInRedux: (state, action: PayloadAction<SpecificFile>) => {
      const index = state.userSpecificFiles.findIndex(
        (file) => file._id === action.payload._id
      );
      if (index !== -1) {
        state.userSpecificFiles[index] = action.payload;
      }
    },
    removeAllSpecificFilesFromRedux: (state) => {
      state.userSpecificFiles = [];
      state.currentPage = 1;
      state.totalFiles = 0;
      state.totalPages = 1;
    },
    removeSpecificFileFromRedux: (state, action: PayloadAction<string>) => {
      state.userSpecificFiles = state.userSpecificFiles.filter(
        (file) => file._id !== action.payload
      );
      state.totalFiles -= 1;
    },
  },
});

export const {
  setSpecificFilesInRedux,
  setPaginatedSpecificFilesInRedux,
  updateSpecificFileInRedux,
  removeAllSpecificFilesFromRedux,
  removeSpecificFileFromRedux,
} = specificFileSlice.actions;

export const selectSpecificFiles = (state: RootState) =>
  state.specific_files.userSpecificFiles;
export const selectSpecificCurrentPage = (state: RootState) =>
  state.specific_files.currentPage;
export const selectSpecificTotalFiles = (state: RootState) =>
  state.specific_files.totalFiles;
export const selectSpecificTotalPages = (state: RootState) =>
  state.specific_files.totalPages;

export default specificFileSlice.reducer;
