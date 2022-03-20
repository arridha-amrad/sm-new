import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axiosInstance from "../../utils/axiosInterceptor";
import { SelectedPartner, SendChatDTO } from "./IChat";

interface ChatState {
  partners: SelectedPartner[];
  selectedPartner: SelectedPartner | null;
}

const initialState: ChatState = {
  partners: [],
  selectedPartner: null,
};

export const getChatPartnerAction = createAsyncThunk(
  "chat/get-partner",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/api/chat/partners");
      return data.partners;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const createChat = createAsyncThunk(
  "chat/send",
  async (dto: SendChatDTO, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/chat/send?chatId=${dto.chatId}&isGroup=${dto.isGroup}`,
        { message: dto.message, receiverId: dto.receiverId }
      );
      return data.chat;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChattingPartner: (state, action) => {
      const isUserExists = state.partners.find(
        (user) => user._id === action.payload._id
      );
      if (!isUserExists) {
        state.partners.unshift(action.payload);
      }
    },
    selectPartner: (state, action) => {
      state.selectedPartner = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatPartnerAction.fulfilled, (state, action) => {
      state.partners = action.payload;
    });
  },
});

export const { addChattingPartner, selectPartner } = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;

export default chatSlice.reducer;
