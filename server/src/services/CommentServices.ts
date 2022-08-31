import CommentModel from '../models/CommentModel';
import { AnyKeys, UpdateQuery } from 'mongoose';
import { IComment } from '../types/ModelTypes';

class CommentServices {
  async save(comment: AnyKeys<IComment>) {
    try {
      const newComment = new CommentModel(comment);
      await newComment.save();
      return newComment.populate('owner', 'username avatarURL');
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(commentId: string) {
    try {
      return CommentModel.findById(commentId)
        .populate('owner', 'username avatarURL')
        .populate('replies');
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(commentId: string) {
    try {
      return CommentModel.findByIdAndDelete(commentId);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(commentId: string, comment: UpdateQuery<IComment>) {
    try {
      return CommentModel.findByIdAndUpdate(commentId, comment, { new: true });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new CommentServices();
