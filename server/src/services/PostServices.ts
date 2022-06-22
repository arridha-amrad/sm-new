import { IPostModel } from '../models/post/IPostModel';
import PostModel from '../models/post/PostModel';
import { AnyKeys, UpdateQuery } from 'mongoose';

class PostServices {
  async save(data: AnyKeys<IPostModel>) {
    try {
      const newPost = new PostModel(data);
      const savedPost = await newPost.save();
      return savedPost.populate('owner', 'username avatarURL');
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async findMany() {
    try {
      return PostModel.find()
        .populate('owner', 'username avatarURL')
        .populate('likes', 'username avatarURL')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'desc' } },
          populate: [
            {
              path: 'replies',
              populate: [
                {
                  path: 'sender',
                  select: 'username avatarURL',
                },
                {
                  path: 'likes',
                  select: 'username avatarURL',
                },
              ],
            },
            { path: 'owner', select: 'username avatarURL' },
            { path: 'likes', select: 'username avatarURL' },
          ],
        })
        .sort({ createdAt: 'desc' });
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async findOne(postId: string) {
    try {
      return PostModel.findById(postId)
        .populate('owner', 'username avatarURL')
        .populate('likes', 'username avatarURL')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'desc' } },
          populate: [
            {
              path: 'replies',
              populate: {
                path: 'sender',
                select: 'username avatarURL',
              },
            },
            { path: 'owner', select: 'username avatarURL' },
            { path: 'likes', select: 'username avatarURL' },
          ],
        });
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async remove(postId: string) {
    try {
      return PostModel.findByIdAndDelete(postId);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async update(postId: string, update?: UpdateQuery<IPostModel> | undefined) {
    try {
      return PostModel.findByIdAndUpdate(postId, update, { new: true })
        .populate('likes', 'username avatarURL')
        .populate('owner', 'username');
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}

export default new PostServices();
