import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axiosInstance from "../../utils/axiosInterceptor";
import { User } from "../authentication/IAuthentication";
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
  messages: Message[];
}

const initialState: ChatState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  selectedReceiverId: null,
};

export const sendMessageAction = createAsyncThunk(
  "chat/send",
  async (dto: SendChatDTO, thunkAPI) => {
    const { isGroup, message, receiverId, conversationId } = dto;
    try {
      const { data } = await axiosInstance.post(
        `/api/chat/send?conversationId=${conversationId}&isGroup=${isGroup}`,
        { message, receiverId }
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
      const { receiverId, ...props } = action.payload;
      state.selectedConversation = props;
      state.selectedReceiverId = receiverId;
    },
    updateConversations: (
      state,
      action: PayloadAction<SelectedConversation>
    ) => {
      const { receiverId, ...conv } = action.payload;

      // const convUser = conv.users.map((user) => user.username);
      // const users = state.conversations[0].users.map((user) => user.username);

      const getUsername = (users: User[]) => {
        let res: string[] = [];
        users.map((user) => res.push(user.username));
        return res.sort().join(",");
      };

      const cIdx = state.conversations.findIndex(
        (c) => getUsername(c.users) === getUsername(conv.users)
      );

      console.log("cIdx : ", cIdx);

      if (cIdx >= 0) {
        state.conversations.splice(cIdx, 1, conv);
        state.selectedConversation = action.payload;
      }
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
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessageAction.fulfilled, (state, action) => {
      state.messages.push(action.payload.message);
    });
  },
});

export const {
  addConversation,
  setConversations,
  selectConversation,
  setMessages,
  updateConversations,
} = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;

export default chatSlice.reducer;
