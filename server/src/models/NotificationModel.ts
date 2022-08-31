import { Schema, model, Model } from 'mongoose';
import { INotification, NotificationType } from '../types/ModelTypes';

const NotificationSchema = new Schema<INotification, Model<INotification>>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: NotificationType,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    reply: {
      type: Schema.Types.ObjectId,
      ref: 'Reply',
    },
    replyTwo: {
      type: Schema.Types.ObjectId,
      ref: 'Reply',
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = model<INotification>(
  'Notification',
  NotificationSchema
);

export default NotificationModel;
