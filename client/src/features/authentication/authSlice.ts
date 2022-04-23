import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setToken } from "../../utils/axiosInterceptor";
import { AuthState, LoginDTO, RegisterDTO, User } from "./IAuthentication";
import { loginAPI, logoutAPI, registerAPI } from "./authApi";
import { setConversations } from "../chats/chatSlice";
import { getSocket, setSocket } from "../../mySocket";
import { io } from "socket.io-client";

const initialState: AuthState = {
  isLoadingAuth: true,
  loginUser: null,
};

export const registerAction = createAsyncThunk(
  "user/registration",
  async (body: RegisterDTO, thunkAPI) => {
    try {
      const { data } = await registerAPI(body);
      return data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const loginAction = createAsyncThunk(
  "user/login",
  async (body: LoginDTO, thunkAPI) => {
    let currSocket = getSocket()
    console.log("curr socket : ", currSocket);
    
    if(!currSocket?.id) {
      const socket = io("http://localhost:5000")
      setSocket(socket)
      currSocket = socket
    }
    try {
      const { data } = await loginAPI(body);
      setToken(data.token);
      thunkAPI.dispatch(setConversations(data.conversations));
      currSocket?.emit("addUserCS", data.user.username)
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const logoutAction = createAsyncThunk("user/logout", async () => {
  await logoutAPI();
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<User>) => {
      state.loginUser = action.payload;
      state.isLoadingAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.loginUser = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      const { user } = action.payload;
      state.isLoadingAuth = false;
      state.loginUser = user;
    });
  },
});

export const { setLoginUser } = userSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;

export default userSlice.reducer;
