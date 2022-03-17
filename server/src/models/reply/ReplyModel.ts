import { Schema, model, Model } from 'mongoose';
import { IReplyModel } from './IReplyModel';

const ReplySchema = new Schema<IReplyModel, Model<IReplyModel>>(
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

const ReplyModel = model<IReplyModel>('Reply', ReplySchema);

export default ReplyModel;
