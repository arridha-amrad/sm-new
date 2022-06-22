import NotificationModel from '../models/notification/NotificationModel';
import { AnyKeys, FilterQuery, UpdateQuery } from 'mongoose';
import { INotificationModel } from '../models/notification/INotificationModel';

class NotificationServices {
  async findMany(userId: string) {
    try {
      return NotificationModel.find({ owner: userId })
        .sort({ updatedAt: 'desc' })
        .populate('sender', 'username avatarURL')
        .populate('comment', 'body createdAt')
        .populate('post', 'body createdAt')
        .populate('reply', 'body createdAt')
        .populate('replyTwo', 'body createdAt');
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(filter: FilterQuery<INotificationModel>) {
    try {
      return NotificationModel.findOne(filter)
        .populate('sender', 'username avatarURL')
        .populate('comment', 'body createdAt')
        .populate('post', 'body createdAt')
        .populate('reply', 'body createdAt');
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(data: AnyKeys<INotificationModel>) {
    try {
      const newNotification = new NotificationModel(data);
      const result = await newNotification.save();
      return NotificationModel.findById(result.id)
        .populate('sender', 'username avatarURL')
        .populate('comment', 'body createdAt')
        .populate('post', 'body createdAt')
        .populate('reply', 'body createdAt')
        .populate('replyTwo', 'body createdAt');
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(notifId: string, update: UpdateQuery<INotificationModel>) {
    try {
      return NotificationModel.findByIdAndUpdate(notifId, update);
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(filter: FilterQuery<INotificationModel>) {
    try {
      return NotificationModel.findOneAndDelete(filter);
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteMany(filter: FilterQuery<INotificationModel>) {
    try {
      return NotificationModel.deleteMany(filter);
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new NotificationServices();
