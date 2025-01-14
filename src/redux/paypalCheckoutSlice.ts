import type { RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface PayPalCheckoutState {
  plan: string;
  price: number;
  priceId: string;
  storage: number;
}

// Define the initial state using that type
const initialState: PayPalCheckoutState = {
  plan: "",
  price: 0,
  priceId: "",
  storage: 0,
};

export const paypalCheckoutSlice = createSlice({
  name: "paypalCheckout",
  initialState,
  reducers: {
    storePayPalPlanInfo: (
      state,
      action: PayloadAction<{
        plan: string;
        price: number;
        priceId: string;
        storage: number;
      }>
    ) => {
      state.plan = action.payload.plan;
      state.price = action.payload.price;
      state.priceId = action.payload.priceId;
      state.storage = action.payload.storage;
    },
    clearPayPalInfo: (state) => {
      state.plan = "";
      state.price = 0;
      state.priceId = "";
      state.storage = 0;
    },
  },
});

// Export actions
export const { storePayPalPlanInfo, clearPayPalInfo } =
  paypalCheckoutSlice.actions;

// Selector to get PayPal checkout state
export const selectPayPalCheckout = (state: RootState) => state.paypalCheckout;

// Export reducer
export default paypalCheckoutSlice.reducer;
