import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axiosInstance from "../../utils/axiosInterceptor";
import { User } from "../authentication/IAuthentication";

interface UserState {
  searchUser: User[];
  isLoadingSearchUser: boolean;
}

const initialState: UserState = {
  searchUser: [],
  isLoadingSearchUser: false,
};

export const searchUserAction = createAsyncThunk(
  "user/search",
  async (username: string, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/user?username=${username}`
      );
      return data.users;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchUserAction.pending, (state) => {
      state.isLoadingSearchUser = true;
    });
    builder.addCase(searchUserAction.fulfilled, (state, action) => {
      state.searchUser = action.payload;
      state.isLoadingSearchUser = false;
    });
  },
});

export const user = (state: RootState) => state.user;

export default userSlice.reducer;
