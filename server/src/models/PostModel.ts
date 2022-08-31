import { Schema, Model, model } from 'mongoose';
import { IPost } from '../types/ModelTypes';

const PostSchema = new Schema<IPost, Model<IPost>>(
  {
    images: [String],
    body: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
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

const PostModel = model<IPost>('Post', PostSchema);

export default PostModel;
