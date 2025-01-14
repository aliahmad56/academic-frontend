import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for each file
export interface File {
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
export interface FileState {
  userFiles: File[];
  currentPage: number;
  totalFiles: number;
  totalPages: number;
}

// Define the initial state using that type
const initialState: FileState = {
  userFiles: [],
  currentPage: 1,
  totalFiles: 0,
  totalPages: 1,
};

export const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFilesInRedux: (
      state,
      action: PayloadAction<{
        files: File[];
        currentPage: number;
        totalFiles: number;
        totalPages: number;
      }>
    ) => {
      const newFiles = action.payload.files.filter(
        (newFile) =>
          !state.userFiles.some(
            (existingFile) => existingFile._id === newFile._id
          )
      );
      state.userFiles = [...state.userFiles, ...newFiles];
      state.currentPage = action.payload.currentPage;
      state.totalFiles = action.payload.totalFiles;
      state.totalPages = action.payload.totalPages;
    },
    setPaginatedFilesInRedux: (
      state,
      action: PayloadAction<{
        files: File[];
        currentPage: number;
        totalFiles: number;
        totalPages: number;
      }>
    ) => {
      state.userFiles = [...action.payload.files];
      state.currentPage = action.payload.currentPage;
      state.totalFiles = action.payload.totalFiles;
      state.totalPages = action.payload.totalPages;
    },
    updateFileInRedux: (state, action: PayloadAction<File>) => {
      const index = state.userFiles.findIndex(
        (file) => file._id === action.payload._id
      );
      if (index !== -1) {
        state.userFiles[index] = action.payload;
      }
    },
    removeAllFilesFromRedux: (state) => {
      state.userFiles = [];
      state.currentPage = 1;
      state.totalFiles = 0;
      state.totalPages = 1;
    },
    removeFileFromReduxById: (state, action: PayloadAction<string>) => {
      // let userFile = state.userFiles;
      state.userFiles = state.userFiles.filter(
        (file) => file._id !== action.payload
      );
    },
    removeFileFromRedux: (state, action: PayloadAction<string>) => {
      state.userFiles = state.userFiles.filter(
        (file) => file._id !== action.payload
      );
      state.totalFiles -= 1;
    },
  },
});

export const {
  setFilesInRedux,
  setPaginatedFilesInRedux,
  updateFileInRedux,
  removeAllFilesFromRedux,
  removeFileFromRedux,
  removeFileFromReduxById,
} = fileSlice.actions;

export const selectFiles = (state: RootState) => state.files.userFiles;
export const selectCurrentFilePage = (state: RootState) =>
  state.files.currentPage;
export const selectTotalFiles = (state: RootState) => state.files.totalFiles;
export const selectTotalFilePages = (state: RootState) =>
  state.files.totalPages;

export default fileSlice.reducer;
