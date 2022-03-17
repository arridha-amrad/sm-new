import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../../app/store";
import axiosInstance from "../../utils/axiosInterceptor";
import {
  INotification,
  NotificationState,
  NotificationType,
} from "./INotification";

const initialState: NotificationState = {
  notifications: [],
};

export const readNotificationAction = createAsyncThunk(
  "notification/read",
  async (notificationIds: string[], thunkAPI) => {
    try {
      await axiosInstance.put("/api/notification/mark-read", {
        notificationIds,
      });
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      const notification = action.payload as INotification;

      const filter = (ntf: INotification) => {
        let res;
        if (
          notification.type === NotificationType.LIKE_POST ||
          notification.type === NotificationType.COMMENT_POST
        ) {
          res = ntf.post?._id === notification.post?._id;
        }
        if (
          notification.type === NotificationType.LIKE_COMMENT ||
          notification.type === NotificationType.REPLY_COMMENT
        ) {
          res = ntf.comment?._id === notification.comment?._id;
        }
        if (notification.type === NotificationType.LIKE_REPLY) {
          res = ntf.reply?._id === notification.reply?._id;
        }
        return res;
      };

      const index = state.notifications.findIndex(
        (ntf) =>
          ntf.type === notification.type &&
          ntf.sender.username === notification.sender.username &&
          filter(ntf as INotification)
      );

      if (index < 0) {
        state.notifications.unshift(
          notification as WritableDraft<INotification>
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readNotificationAction.fulfilled, (state) => {
      state.notifications.map((ntf) => (ntf.isRead = true));
    });
  },
});

export const selectNotification = (state: RootState) =>
  state.notification.notifications;

export const { setNotifications, addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
