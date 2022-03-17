import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/authentication/authSlice";
import postReducer from "../features/post/postSlice";
import commentReducer from "../features/comment/commentSlice";
import notifReducer from "../features/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
    notification: notifReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
