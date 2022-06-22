import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotificationType } from '../../models/notification/INotificationModel';
import {
  createNotification,
  deleteNotification,
  findOneNotification,
  findOneNotificationAndDelete,
} from '../../services/NotificationServices';
import { findOneReply, updateReply } from '../../services/ReplyService';

export default async (req: Request, res: Response) => {
  const likeSender = req.userId;
  const { replyId } = req.params;

  try {
    const reply = await findOneReply(replyId);
    if (reply) {
      const isLiked = reply?.likes.find(
        (userId) => userId.toString() === likeSender
      );
      const updatedReply = await updateReply(
        replyId,
        isLiked
          ? {
              $pull: { likes: likeSender },
            }
          : { $push: { likes: likeSender } }
      );

      let notification;
      if (likeSender !== reply.sender._id.toString()) {
        if (isLiked) {
          await findOneNotificationAndDelete({
            owner: reply.sender,
            reply: reply.id,
            sender: likeSender,
            type: NotificationType.LIKE_REPLY,
          });
        } else {
          notification = await createNotification({
            owner: reply.sender,
            reply: reply.id,
            sender: likeSender,
            type: NotificationType.LIKE_REPLY,
          });
        }
      }
      return res.status(200).json({ reply: updatedReply, notification });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
