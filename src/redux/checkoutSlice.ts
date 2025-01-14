import type { RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface CheckoutState {
  priceId: string;
  planId: string;
  planName: string;
  planBudget: number;
  storageLimit: number;
  platform: string;
  interval: number;
}

// Define the initial state using that type
const initialState: CheckoutState = {
  planId: "",
  priceId: "",
  planName: "",
  storageLimit: 0,
  planBudget: 0,
  platform: "",
  interval: 0,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    storePlanInfo: (
      state,
      action: PayloadAction<{
        planId: string;
        planName: string;
        priceId: string;
        storageLimit: number;
        planBudget: number;
        interval: number;
        platform: string;
      }>
    ) => {
      state.planId = action.payload.planId;
      state.priceId = action.payload.priceId;
      state.planName = action.payload.planName;
      state.planBudget = action.payload.planBudget;
      state.storageLimit = action.payload.storageLimit;
      state.interval = action.payload.interval;
      state.platform = action.payload.platform;
    },
    clearInfo: (state) => {
      state.planId = "";
      state.planBudget = 0;
      state.priceId = "";
      state.storageLimit = 0;
      state.interval = 0;
      state.platform = "";
    },
  },
});

// Export actions
export const { storePlanInfo, clearInfo } = checkoutSlice.actions;

// Selector to get checkout state
export const selectCheckout = (state: RootState) => state.checkout;

// Export reducer
export default checkoutSlice.reducer;
