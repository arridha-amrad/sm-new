import { Schema, Model, model } from 'mongoose';
import { IMessage } from './IMessage';

const MessageSchema = new Schema<IMessage, Model<IMessage>>(
  {
    text: {
      type: String,
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Message = model<IMessage>('Message', MessageSchema);

export default Message;
