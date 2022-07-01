import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { initSocket } from '../../hooks/useSocket';
import { getSocket, setSocket } from '../../socket/mySocket';
import axiosInstance, { setToken } from '../../utils/axiosInterceptor';
import { AuthState, LoginDTO, RegisterDTO, User } from './IAuthentication';

const initialState: AuthState = {
  isLoadingAuth: true,
  loginUser: null,
  isAuthenticated: false,
};

const URL = '/api/auth';

export const forgotPasswordAction = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`${URL}/forgot-password`, {
        email,
      });
      return data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const registerAction = createAsyncThunk(
  'user/registration',
  async (body: RegisterDTO, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`${URL}/register`, body);
      return data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const loginAction = createAsyncThunk(
  '/login',
  async (body: LoginDTO, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`${URL}/login`, body);
      let currSocket = getSocket();
      if (!currSocket) {
        const socket = initSocket();
        setSocket(socket);
        currSocket = socket;
      }
      setToken(data.token);
      currSocket?.emit('addUserCS', data.user.username);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const logoutAction = createAsyncThunk('/logout', async () => {
  await axiosInstance.post(`${URL}/logout`);
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<User>) => {
      state.loginUser = action.payload;
      state.isLoadingAuth = false;
    },
    unsetLoadingAuth: (state) => {
      state.isLoadingAuth = false;
    },
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
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

export const { setAuthenticated, setLoginUser, unsetLoadingAuth } =
  userSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;

export default userSlice.reducer;
