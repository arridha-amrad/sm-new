import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../authentication/IAuthentication";

interface ChatState {
  partners: User[];
  selectedPartner: User | null;
}

const initialState: ChatState = {
  partners: [],
  selectedPartner: null,
};

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
});

export const { addChattingPartner, selectPartner } = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;

export default chatSlice.reducer;
