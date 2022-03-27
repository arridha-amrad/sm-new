import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getSocket } from "../../mySocket";
import axiosInstance from "../../utils/axiosInterceptor";
import {
  Conversation,
  Message,
  SelectedConversation,
  SendChatDTO,
} from "./IChat";

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  selectedReceiverId: string | null;
  selectedReceiverUsername: string | null;
  messages: Message[];
  selectedConversationIndex: number | null;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  selectedConversationIndex: null,
  selectedReceiverId: null,
  selectedReceiverUsername: null,
};

export const sendMessageAction = createAsyncThunk(
  "chat/send",
  async (dto: SendChatDTO, thunkAPI) => {
    const socket = getSocket();
    const { isGroup, message, receiverId, conversationId, toUsername } = dto;
    try {
      const { data } = await axiosInstance.post(
        `/api/chat/send?conversationId=${conversationId}&isGroup=${isGroup}`,
        { message, receiverId }
      );
      socket?.emit(
        "sendMessageCS",
        data.conversation,
        data.message,
        toUsername
      );
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectConversation: (
      state,
      action: PayloadAction<SelectedConversation>
    ) => {
      const { receiverId, conversationIndex, receiverUsername, ...props } =
        action.payload;
      state.selectedConversation = props;
      state.selectedReceiverId = receiverId;
      state.selectedConversationIndex = conversationIndex;
      state.selectedReceiverUsername = receiverUsername;
    },
    updateConversations: (
      state,
      action: PayloadAction<SelectedConversation>
    ) => {
      const { conversationIndex, ...conv } = action.payload;
      state.conversations[state.selectedConversationIndex!] = conv;
      state.selectedConversation = conv;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversation: Conversation; message: Message }>
    ) => {
      const {
        conversation: { _id },
        message,
      } = action.payload;
      const conIndex = state.conversations.findIndex((c) => c._id === _id);
      if (conIndex < 0) {
        state.conversations.unshift(action.payload.conversation);
      } else {
        state.conversations[conIndex].lastMessage = message.text;
      }
      if (state.selectedConversation?._id === _id) {
        state.messages.push(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessageAction.fulfilled, (state, action) => {
      const { conversation, message } = action.payload;
      const conIndex = state.conversations.findIndex(
        (c) => c._id === conversation._id
      );
      if (conIndex >= 0) {
        state.conversations[conIndex].lastMessage = message.text;
      }
      state.messages.push(message);
    });
  },
});

export const {
  addMessage,
  addConversation,
  setConversations,
  selectConversation,
  setMessages,
  updateConversations,
} = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;

export default chatSlice.reducer;
