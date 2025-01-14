import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for each folder
export interface Folder {
  files: string[]; // or if files are objects, use File[] instead
  allowedUsers: string[];
  _id: string;
  folderName: string;
  createdAt: string;
  updatedAt: string;
  parentFolder: string | null;
  // Add other properties if necessary
}

// Define a type for the slice state
export interface FolderState {
  userFolders: Folder[];
}

// Define the initial state using that type
const initialState: FolderState = {
  userFolders: [],
};

export const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFoldersInRedux: (state, action: PayloadAction<Folder[]>) => {
      state.userFolders = [...action.payload];
    },
    addFolderInRedux: (state, action: PayloadAction<Folder[]>) => {
      state.userFolders = [...state.userFolders, ...action.payload];
    },
    updateFolderInRedux: (state, action: PayloadAction<Folder>) => {
      const index = state.userFolders.findIndex(
        (folder) => folder._id === action.payload._id
      );
      if (index !== -1) {
        state.userFolders[index] = action.payload;
      }
    },
    removeAllFoldersFromRedux: (state) => {
      state.userFolders = [];
    },
    removeFolderFromRedux: (state, action: PayloadAction<string>) => {
      state.userFolders = state.userFolders.filter(
        (folder) => folder._id !== action.payload
      );
    },
    removeFileFromFolder: (
      state,
      action: PayloadAction<{ folderId: string | null; fileId: string }>
    ) => {
      const { folderId, fileId } = action.payload;
      const folder = state.userFolders.find(
        (folder) => folder._id === folderId
      );
      if (folder) {
        // Filter the files by matching the fileId with the entries in folder.files (which contains file IDs as strings)
        folder.files = folder.files.filter((file: string) => file !== fileId);
      }
    },

    addFileToFolder: (
      state,
      action: PayloadAction<{ folderId: string; fileId: string }>
    ) => {
      const { folderId, fileId } = action.payload;
      const folderIndex = state.userFolders.findIndex(
        (folder) => folder._id === folderId
      );
      if (folderIndex !== -1) {
        state.userFolders[folderIndex].files.push(fileId);
      }
    },
  },
});

export const {
  setFoldersInRedux,
  addFolderInRedux,
  updateFolderInRedux,
  removeFileFromFolder,
  removeAllFoldersFromRedux,
  removeFolderFromRedux,
  addFileToFolder, // Exporting the new reducer function
} = folderSlice.actions;

export const selectFolders = (state: RootState) => state.folders.userFolders;

export default folderSlice.reducer;
