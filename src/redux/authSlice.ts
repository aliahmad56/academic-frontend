import type { RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  researcher: string | null;
  _id: string | null;
  name: string | null;
  email: string | null;
  password: string | null;
  resetPasswordOtp: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlatform: string | null;
  usedStorage: number | null;
  storageLimit: number | null;
  profilepic?: string | null;
  referralCode: string | null;
  availReferralCode: string | null;
}

export interface AuthState {
  name: string;
  email: string;
  accessToken: string;
  isGuest: boolean;
  userProfile: UserProfile | null;
}

const initialState: AuthState = {
  name: "",
  email: "",
  accessToken: "",
  isGuest: true,
  userProfile: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        accessToken: string;
        isGuest: boolean;
        userProfile: UserProfile;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.isGuest = action.payload.isGuest;
      state.userProfile = action.payload.userProfile;
    },
    logout: (state) => {
      state.name = "";
      state.email = "";
      state.accessToken = "";
      state.isGuest = true;

      // If userProfile exists and has subscriptionStatus, preserve it
      if (state.userProfile?.subscriptionStatus) {
        state.userProfile = {
          ...state.userProfile, // Preserve the other properties
          subscriptionStatus: state.userProfile.subscriptionStatus, // Ensure subscriptionStatus is preserved
          researcher: null,
          _id: null,
          name: null,
          email: null,
          password: null,
          resetPasswordOtp: null,
          subscriptionId: null,
          usedStorage: null,
          storageLimit: null,
        };
      } else {
        state.userProfile = null; // Nullify userProfile if subscriptionStatus doesn't exist
      }
    },
    removeSubscription: (state) => {
      if (state.userProfile) {
        state.userProfile.subscriptionStatus = "canceled";
        state.userProfile.subscriptionStatus = null;
        state.userProfile.subscriptionPlatform = null;
      }
    },
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      if (state.userProfile) {
        state.userProfile = {
          ...state.userProfile,
          ...action.payload,
        };
      }
    },
    updateUsedStorage: (state, action: PayloadAction<number | null>) => {
      if (state.userProfile) {
        // Ensure usedStorage is not null by using a default value of 0 if it is null
        const currentUsedStorage = state.userProfile.usedStorage ?? 0;
        state.userProfile.usedStorage =
          currentUsedStorage + (action.payload ?? 0);
      }
    },
  },
});

export const {
  login,
  logout,
  updateUserProfile,
  updateUsedStorage,
  removeSubscription,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
