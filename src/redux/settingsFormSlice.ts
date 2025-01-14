import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInterceptor from "../AxiosInterceptor";
import  { AxiosError } from 'axios'; 

interface ApiResponse {
  status: boolean;
  message: string;
  profil: {
    emailPreferences: {
      preferenceKey: boolean;
      frequency: string;
      emailLanguage: string;
    };
    notifications: {
      notificationKey: boolean;
      notificationLanguage: string;
    };
    _id: string;
    user: string;
    __v: number;
    readingHistory: boolean;
    resercherPassword: string;
  };
}

export type SettingsPayload = {
  readingHistory: boolean;
  emailPreferences: {
    preferenceKey: boolean;
    frequency: string;
    emailLanguage: string;
  };
  notifications: {
    notificationKey: boolean;
    notificationLanguage: string;
  };
  resercherPassword: string;
};

interface SettingsState {
  isLoading: boolean;
  success: boolean;
  error: null | any;
  status: null | any;
  UserSettings: ApiResponse['profil'];
}

// Update your initial state
const initialState: SettingsState = {
  isLoading: false,
  success: false,
  error: null,
  status: null,
  UserSettings: {
    emailPreferences: {
      preferenceKey: false,
      frequency: "weekly",
      emailLanguage: "english"
    },
    notifications: {
      notificationKey: false,
      notificationLanguage: "english"
    },
    _id: "",
    user: "",
    __v: 0,
    readingHistory: false,
    resercherPassword: ""
  }
};
const API_URL_GET = '/user/profile';
const API_URL_PUT = '/user/profile-setting';


export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.get<ApiResponse>(API_URL_GET);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
            if (axiosError.response) {
              return rejectWithValue(axiosError.response.data);
    }
  }
}
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData : SettingsPayload, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.put(API_URL_PUT, settingsData);
      return response.data;
    } catch (error) {
            const axiosError = error as AxiosError;
      
            if (axiosError.response) {
              return rejectWithValue(axiosError.response.data);
    }
    }
  }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      resetState(state) {
        state.isLoading = false;
        state.error = null;
        state.success = false;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.profil) {
          state.UserSettings = action.payload.profil;
        } else {
          state.error = 'Payload is undefined or invalid';
        }
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
        .addCase(updateSettings.pending, (state) => {
          state.isLoading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(updateSettings.fulfilled, (state) => {
          state.isLoading = false;
          state.success = true;
        })
        .addCase(updateSettings.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { resetState } = settingsSlice.actions;
  export type { SettingsState };
  
  export default settingsSlice.reducer;