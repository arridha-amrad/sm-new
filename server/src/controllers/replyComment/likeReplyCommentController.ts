import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotificationType } from '../../models/notification/INotificationModel';
import {
  createNotification,
  deleteNotification,
  findOneNotification,
} from '../../services/NotificationService';
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

      if (likeSender !== reply.sender._id.toString()) {
      }
      return res.status(200).json({ reply: updatedReply });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
