import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AxiosInterceptor from "../AxiosInterceptor";
import { RootState } from "./store";
import { toast } from "react-toastify";

export interface NotificationInterface {
  _id: string;
  notificationType: string;
  notificationTitle: string;
  notificationMessage: string;
  user: string;
  status: "read" | "unread"; // Changed IsRead to status
  IsRead: boolean;
  createdAt?: string;
}

export interface NotificationState {
  notifications: NotificationInterface[];
  unreadCount: number;
  isFetching: boolean;
  error: any;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isFetching: false,
  error: null,
};

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (type: "all" | "read" | "unread", { rejectWithValue }) => {
    let url = "/user/show-notifications";
    if (type === "read") url += "?type=read";
    if (type === "unread") url += "?type=unread";

    try {
      const response = await AxiosInterceptor.SECURE_API.get(url);
      if (response.data.status) {
        return response.data.notifications;
      } else {
        return rejectWithValue("Failed to fetch notifications");
      }
    } catch (error) {
      return rejectWithValue("Error fetching notifications");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.put(
        `/user/mark-read`,
        { notificationId: ids }
      );
      if (response.data.status) {
        return ids; // Return the array of notification ids
      } else {
        return rejectWithValue("Error marking notifications as read");
      }
    } catch (error) {
      return rejectWithValue("Error marking notifications as read");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await AxiosInterceptor.SECURE_API.put(`/user/mark-read`);
    } catch (error) {
      return rejectWithValue("Error marking all notifications as read");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.delete(
        `/user/remove-notifications`,
        {
          data: { notificationId: ids }, // Pass notificationId in the `data` field
        }
      );
      if (response?.data?.status) {
        return ids; // return the array of deleted notification
      } else {
        return rejectWithValue("Error deleting Notifications");
      }
    } catch (error) {
      return rejectWithValue("Error deleting Notifications");
    }
  }
);

export const deleteAllNotification = createAsyncThunk(
  "notifications/deleteAllNotification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.delete(
        `/user/remove-notifications`
      );
      if (response?.data?.status) {
        toast.success("Delete Successfully");
        return response.data;
      }
    } catch (error) {
      return rejectWithValue("Error deleting All Notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationInterface>) => {
      state.notifications.push(action.payload);
      // Increment unreadCount only if the added notification is unread
      if (!action.payload.IsRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<NotificationInterface[]>) => {
          state.isFetching = false;
          state.notifications = action.payload;
          // Calculate unreadCount based on the IsRead property
          state.unreadCount = action.payload.filter((n) => !n.IsRead).length;
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const ids = action.payload;
        state.notifications = state.notifications.map((notification) =>
          ids.includes(notification._id)
            ? { ...notification, IsRead: true } // Set IsRead to true for marked notifications
            : notification
        );
        // Recalculate unread count based on updated notifications
        state.unreadCount = state.notifications.filter((n) => !n.IsRead).length;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        console.error(state, action);
      })

      // Handle All Read Notification
      .addCase(markAllAsRead.fulfilled, (state) => {
        // const ids = action.payload;
        state.notifications = state.notifications.map((notification) => {
          return {
            ...notification,
            IsRead: true,
          };
        });
        // Recalculate unread count based on updated notifications
        state.unreadCount = state.notifications.filter((n) => !n.IsRead).length;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        console.error(state, action);
      })

      // Handle deleting Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const ids = action.payload;
        state.notifications = state.notifications.filter(
          (notification) => !ids.includes(notification._id)
        );
        // Recalculate unread count
        state.unreadCount = state.notifications.filter((n) => !n.IsRead).length;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        console.error(state, action);
      })

      // Handle deleting All Notification
      .addCase(deleteAllNotification.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(deleteAllNotification.rejected, (state, action) => {
        (state.error = action.payload), // Handle the error message
          console.error("Error:", action.payload);
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.notifications.unreadCount;

export default notificationSlice.reducer;
