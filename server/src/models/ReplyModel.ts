import { Schema, model, Model } from 'mongoose';
import { IReply } from '../types/ModelTypes';

const ReplySchema = new Schema<IReply, Model<IReply>>(
  {
    body: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ReplyModel = model<IReply>('Reply', ReplySchema);

export default ReplyModel;
