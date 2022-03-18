import NotificationModel from '../models/notification/NotificationModel';
import { AnyKeys, FilterQuery, UpdateQuery } from 'mongoose';
import { INotificationModel } from '../models/notification/INotificationModel';

export const createNotification = async (data: AnyKeys<INotificationModel>) => {
  const newNotification = new NotificationModel(data);
  const result = await newNotification.save();
  return NotificationModel.findById(result.id)
    .populate('sender', 'username avatarURL')
    .populate('comment', 'body createdAt')
    .populate('post', 'body createdAt')
    .populate('reply', 'body createdAt');
};

export const findOneNotification = async (
  filter: FilterQuery<INotificationModel>
) => {
  return NotificationModel.findOne(filter)
    .populate('sender', 'username avatarURL')
    .populate('comment', 'body createdAt')
    .populate('post', 'body createdAt')
    .populate('reply', 'body createdAt');
};

export const deleteNotification = async (id: string) => {
  return NotificationModel.findByIdAndDelete(id);
};

export const findNotificationsOfOneUser = async (userId: string) => {
  return NotificationModel.find({ owner: userId })
    .sort({ updatedAt: 'desc' })
    .populate('sender', 'username avatarURL')
    .populate('comment', 'body createdAt')
    .populate('post', 'body createdAt')
    .populate('reply', 'body createdAt');
};

export const findByIdAndUpdate = async (
  notifId: string,
  update: UpdateQuery<INotificationModel>
) => {
  return NotificationModel.findByIdAndUpdate(notifId, update);
};

export const findOneNotificationAndDelete = async (
  filter: FilterQuery<INotificationModel>
) => {
  return NotificationModel.findOneAndDelete(filter);
};

export const deleteNotifications = async (
  filter: FilterQuery<INotificationModel>
) => {
  return NotificationModel.deleteMany(filter);
};
