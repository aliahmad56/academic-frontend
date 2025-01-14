// src/store/slices/userListSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInterceptor from "../AxiosInterceptor";

// Types
interface User {
  _id: string;
  name: string;
  isFollowed?: boolean;
  profilepic?: string;  // Add this
}

export interface UserListState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserListState = {
  users: [],
  isLoading: false,
  error: null,
};

// API Endpoints
const API_URL_GET = '/user/display';
const API_URL_POST = '/user/do-follow';

// Async Thunk
export const fetchUserList = createAsyncThunk(
  'userList/fetchUserList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.get(API_URL_GET);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const followUser = createAsyncThunk(
  'userList/followUser',
  async (body:{ followingId: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.post(API_URL_POST, body);
      return response.data.user;
    } catch (error: any) {
      
      const errorResponse = rejectWithValue(error.response?.message || 'Failed to follow users');
      console.log('rejectWIthValue', errorResponse)
      return errorResponse
    }
  }
);


// Slice
const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    clearUserListErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'An error occurred';
        state.users = [];
      })   .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        // Update the followed user's status in the list
        state.users = state.users.map(user => {
          if (user._id === action.payload.following) {
            return {
              ...user,
              isFollowed: true
            };
          }
          return user;
        });
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
     
  },
});

export const { clearUserListErrors } = userListSlice.actions;
export default userListSlice.reducer;