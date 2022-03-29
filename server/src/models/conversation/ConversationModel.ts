import { Schema, Model, model } from 'mongoose';
import { IConversation } from './IConversation';

const ConversationSchema = new Schema<IConversation, Model<IConversation>>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    groupName: String,
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },

  { timestamps: true }
);

const Conversation = model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
