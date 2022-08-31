import { Schema, Model, model } from 'mongoose';
import { IComment } from '../types/ModelTypes';

const CommentSchema = new Schema<IComment, Model<IComment>>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    body: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reply',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CommentModel = model<IComment>('Comment', CommentSchema);

export default CommentModel;
