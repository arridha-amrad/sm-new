import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotificationType } from '../../models/notification/INotificationModel';
import { findOneComment } from '../../services/CommentService';
import {
  createNotification,
  findOneNotification,
} from '../../services/NotificationService';
import { makeReply } from '../../services/ReplyService';

export default async (req: Request, res: Response) => {
  const { body, receiver } = req.body;
  const { commentId } = req.params;
  const replySender = req.userId;

  try {
    const newReply = await makeReply({
      body,
      comment: commentId,
      receiver,
      sender: replySender,
    });
    const comment = await findOneComment(commentId);
    if (comment) {
      comment.replies.push(newReply);
      await comment.save();

      // create notification for receiver of reply
      const notification = await findOneNotification({
        comment: comment.id,
        type: NotificationType.REPLY_COMMENT,
        owner: receiver,
      });
    }
    return res.status(200).json({ reply: newReply });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
