import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInterceptor from "../AxiosInterceptor";

export interface Following {
  following: {
    _id: string;
    name: string;
  };
}

export interface FollowingState {
  following: Following[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FollowingState = {
  following: [],
  isLoading: false,
  error: null,
};

export const fetchFollowing = createAsyncThunk(
  'following/fetchFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.get('/user/connections');
      return response.data.userFollowing;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

export const unfollowUser = createAsyncThunk(
    'following/unfollowUser',
    async (userId: string, { rejectWithValue }) => {
      try {
        await AxiosInterceptor.SECURE_API.delete(`/user/unfollow/${userId}`);
        return userId; // Return the userId to remove from state
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
      }
    }
  );

const followingSlice = createSlice({
  name: 'following',
  initialState,
  reducers: {
    clearFollowingErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.following = action.payload;
        state.error = null;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.following = [];
      }).addCase(unfollowUser.pending, (state) => {
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        // Remove the unfollowed user from the state
        state.following = state.following.filter(
          item => item.following._id !== action.payload
        );
        state.error = null;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
 
  },
});

export const { clearFollowingErrors } = followingSlice.actions;
export default followingSlice.reducer;