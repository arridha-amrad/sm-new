import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getSocket } from '../../socket/mySocket';
import axiosInstance from '../../utils/axiosInterceptor';
import {
  IConversation,
  IMessage,
  SelectedConversation,
  SendChatDTO,
} from './IChat';

interface ChatState {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  selectedReceiverId: string | null;
  selectedReceiverUsername: string | null;
  messages: IMessage[];
  selectedConversationIndex: number | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  selectedConversationIndex: null,
  selectedReceiverId: null,
  selectedReceiverUsername: null,
};

export const sendMessageAction = createAsyncThunk(
  'chat/send',
  async (dto: SendChatDTO, thunkAPI) => {
    const socket = getSocket();
    const { isGroup, message, receiverId, conversationId, toUsername } = dto;
    try {
      const { data } = await axiosInstance.post(
        `/api/chat/send?conversationId=${conversationId}&isGroup=${isGroup}`,
        { message, receiverId }
      );
      const { conversation, message: resMessage } = data;
      socket?.emit('sendMessageCS', {
        conversation,
        message: resMessage,
        toUsername,
      });
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetSelectedConversation: (state) => {
      state.selectedConversation = null;
      state.selectedConversationIndex = null;
      state.selectedReceiverId = null;
      state.selectedReceiverUsername = null;
    },
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
      state.conversations[conversationIndex].totalUnreadMessage = 0;
    },
    updateConversations: (
      state,
      action: PayloadAction<SelectedConversation>
    ) => {
      const { conversationIndex, ...conv } = action.payload;
      state.conversations[state.selectedConversationIndex!] = conv;
      state.selectedConversation = conv;

      // override
      state.conversations[
        state.selectedConversationIndex!
      ].totalUnreadMessage = 0;
    },
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    addConversation: (state, action: PayloadAction<IConversation>) => {
      state.conversations.unshift(action.payload);
    },
    receiveMessage: (
      state,
      action: PayloadAction<{ conversation: IConversation; message: IMessage }>
    ) => {
      const {
        conversation: { _id },
        message,
      } = action.payload;
      const conIndex = state.conversations.findIndex((c) => c._id === _id);
      if (conIndex < 0) {
        state.conversations.unshift(action.payload.conversation);
      } else {
        state.conversations[conIndex].lastMessage = message;
        state.conversations[conIndex].totalUnreadMessage += 1;
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
        state.conversations[conIndex].lastMessage = message;
        state.conversations[conIndex].totalUnreadMessage = 0;
      }
      state.messages.push(message);
    });
  },
});

export const {
  receiveMessage,
  resetSelectedConversation,
  addConversation,
  setConversations,
  selectConversation,
  setMessages,
  updateConversations,
} = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;

export default chatSlice.reducer;
