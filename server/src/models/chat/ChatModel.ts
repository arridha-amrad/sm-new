import { Schema, Model, model } from 'mongoose';
import { IChatModel } from './IChatModel';

const ChatSchema = new Schema<IChatModel, Model<IChatModel>>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    chatMessages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ChatMessage',
      },
    ],
    lastMessage: {
      type: String,
    },
  },

  { timestamps: true }
);

const ChatModel = model<IChatModel>('Chat', ChatSchema);

export default ChatModel;
