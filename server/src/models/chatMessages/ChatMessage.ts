import { Schema, Model, model } from 'mongoose';
import { IChatMessage } from './IChatMessages';

const ChatMessageSchema = new Schema<IChatMessage, Model<IChatMessage>>(
  {
    body: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const ChatMessageModel = model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessageModel;
