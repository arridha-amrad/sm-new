import ReplyModel from '../models/ReplyModel';
import { AnyKeys } from 'mongoose';
import { IReplyModel } from '../types/ModelTypes';
import { UpdateQuery } from 'mongoose';

class ReplyServices {
  async save(data: AnyKeys<IReplyModel>) {
    const newReply = new ReplyModel(data);
    const reply = await newReply.save();
    const populatedReply = await reply.populate('sender', 'username avatarURL');
    return populatedReply;
  }

  async delete(replyId: string) {
    try {
      return ReplyModel.findByIdAndDelete(replyId);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(replyId: string) {
    try {
      return ReplyModel.findById(replyId);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(replyId: string, update?: UpdateQuery<IReplyModel>) {
    try {
      return ReplyModel.findByIdAndUpdate(replyId, update, { new: true });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new ReplyServices();
