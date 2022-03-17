import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotificationType } from '../../models/notification/INotificationModel';
import { editComment, findOneComment } from '../../services/CommentService';
import {
  createNotification,
  deleteNotification,
  findOneNotification,
} from '../../services/NotificationService';

export default async (req: Request, res: Response) => {
  const likeSender = req.userId;
  const { commentId } = req.params;
  try {
    let comment = await findOneComment(commentId);
    if (comment) {
      const isLiked = comment.likes.find(
        (user) => user._id?.toString() === likeSender
      );
      const updatedComment = await editComment(
        commentId,
        isLiked
          ? {
              $pull: { likes: likeSender },
            }
          : {
              $push: { likes: likeSender },
            }
      );
      // create notification if likeSender is not the postOwner
      if (likeSender !== comment.owner._id.toString()) {
      }
      return res.status(200).json({ comment: updatedComment });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
