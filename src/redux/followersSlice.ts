import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInterceptor from "../AxiosInterceptor";

export interface Follower {
  _id: string;
  name: string;
}

export interface FollowersState {
  followers: Follower[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FollowersState = {
  followers: [],
  isLoading: false,
  error: null,
};

export const fetchFollowers = createAsyncThunk(
  'followers/fetchFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.get('/user/connections');
      return response.data.userFollowers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const removeFollower = createAsyncThunk(
    'userList/removeFollower',
    async (userId: string, { rejectWithValue }) => {
      try {
        await AxiosInterceptor.SECURE_API.delete(`/user/remove-follower/${userId}`);
        return userId; // Return the userId to remove from state
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove follower');
      }
    }
  );


const followersSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    clearFollowersErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload;
        state.error = null;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.followers = [];
      }) .addCase(removeFollower.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFollower.fulfilled, (state, action) => {
        // Remove the follower from the state
        state.followers = state.followers.filter(follower => follower._id !== action.payload);
        state.error = null;
      })
      .addCase(removeFollower.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearFollowersErrors } = followersSlice.actions;
export default followersSlice.reducer;