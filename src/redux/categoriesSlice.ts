import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for each category
export interface Category {
  allowedUsers: string[];
  _id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  parentFolder: string | null;
  files: string[]; // Or you can define this as File[] if files are objects
  createdBy: string;
}

// Define a type for the slice state
export interface CategoryState {
  userCategories: Category[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
}

// Define the initial state using that type
const initialState: CategoryState = {
  userCategories: [],
  currentPage: 1,
  totalPages: 1,
  totalCategories: 0,
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Set categories with pagination data
    setPaginatedCategoriesInRedux: (
      state,
      action: PayloadAction<{
        allCategoryDetails: Category[];
        currentPage: number;
        totalPages: number;
        totalCategories: number;
      }>
    ) => {
      if (Array.isArray(action.payload.allCategoryDetails)) {
        // Check if the current page is 1, prepend the 'All' category
        if (action.payload.currentPage === 1) {
          const allCategory = {
            _id: "",
            categoryName: "All", // Use translation if needed: translate('All', selectedLanguage)
            allowedUsers: [],
            createdAt: "",
            updatedAt: "",
            parentFolder: null,
            files: [],
            createdBy: "",
          };

          state.userCategories = [
            allCategory,
            ...action.payload.allCategoryDetails,
          ]; // Prepend 'All' category
        } else {
          state.userCategories = [...action.payload.allCategoryDetails];
        }
      } else {
        console.error("allCategoryDetails is not an array or is undefined");
      }

      // Set pagination details
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalCategories = action.payload.totalCategories;
    },

    // Reset categories (used when reloading or changing data)
    resetCategoriesInRedux: (state) => {
      state.userCategories = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalCategories = 0;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      // Push the new category to the list
      state.userCategories.push(action.payload);
      // Increment the total category count
      state.totalCategories += 1;
      // Check if a new page needs to be added based on your page size
      const pageSize = 10;
      if (state.totalCategories > state.totalPages * pageSize) {
        state.totalPages += 1; // Add a new page if total categories exceed the current pages' capacity
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.userCategories = state.userCategories.filter(
        (category) => category._id !== action.payload
      );
      state.totalCategories -= 1; // Decrease the total number of categories
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.userCategories.findIndex(
        (category) => category._id === action.payload._id
      );
      if (index !== -1) {
        state.userCategories[index] = action.payload;
      }
    },
  },
});

export const {
  setPaginatedCategoriesInRedux,
  resetCategoriesInRedux,
  addCategory,
  removeCategory,
  updateCategory,
} = categorySlice.actions;

export const selectCategories = (state: RootState) =>
  state.categories.userCategories;
export const selectCurrentCategoryPage = (state: RootState) =>
  state.categories.currentPage;
export const selectTotalCategoryPages = (state: RootState) =>
  state.categories.totalPages;
export const selectTotalCategories = (state: RootState) =>
  state.categories.totalCategories;

export default categorySlice.reducer;
