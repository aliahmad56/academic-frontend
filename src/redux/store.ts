import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./authSlice";
import languageSlice from "./languageSlice";
import checkoutSlice from "./checkoutSlice";
import paypalCheckoutSlice from "./paypalCheckoutSlice";
import loadingSlice from "./loadingSlice";
import fileSlice from "./fileSlice";
import specificFileSlice from "./specificFileSlice";
import folderSlice from "./folderSlice";
import categorySlice from "./categoriesSlice";
import uploadSlice from "./uploadSlice";
import specificUploads from "./specificUploadSlice";
import notificationSlice from "./notificationSlice";
import registrationSlice from "./registrationSlice";
import settingsReducer from "./settingsFormSlice";
import userListReducer from './userListSlice';
import followersReducer from './followersSlice';
import followingReducer from './followingSlice';





// Create separate persist configs for each slice
const authPersistConfig = {
  key: "auth",
  storage,
};

const languagePersistConfig = {
  key: "language",
  storage,
};

const checkoutPersistConfig = {
  key: "checkout",
  storage,
};

const paypalCheckoutPersistConfig = {
  key: "paypalCheckout",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const languageReducer = persistReducer(languagePersistConfig, languageSlice);
const persistedCheckoutReducer = persistReducer(
  checkoutPersistConfig,
  checkoutSlice
);
const persistedpaypalCheckoutReducer = persistReducer(
  paypalCheckoutPersistConfig,
  paypalCheckoutSlice
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    language: languageReducer,
    checkout: persistedCheckoutReducer,
    paypalCheckout: persistedpaypalCheckoutReducer,
    loader: loadingSlice,
    files: fileSlice,
    specific_files: specificFileSlice,
    folders: folderSlice,
    categories: categorySlice,
    uploads: uploadSlice,
    specific_uploads: specificUploads,
    notifications:notificationSlice,
    registration: registrationSlice,
    settings: settingsReducer,
  userList: userListReducer,
  followers: followersReducer,
  following: followingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
