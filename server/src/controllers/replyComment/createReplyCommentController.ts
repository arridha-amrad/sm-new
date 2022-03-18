import { Request, Response } from 'express';
import { NotificationType } from '../../models/notification/INotificationModel';
import { findOneComment } from '../../services/CommentService';
import { createNotification } from '../../services/NotificationService';
import { makeReply } from '../../services/ReplyService';

export default async (req: Request, res: Response) => {
  const { body, receiverId } = req.body;
  const { commentId } = req.params;
  const replySender = req.userId;

  try {
    const newReply = await makeReply({
      body,
      comment: commentId,
      receiver: receiverId,
      sender: replySender,
    });
    const comment = await findOneComment(commentId);
    if (comment) {
      comment.replies.push(newReply);
      await comment.save();

      // create notification for receiver of reply
      const notification = await createNotification({
        reply: newReply,
        sender: replySender,
        comment: comment.id,
        type: NotificationType.REPLY_COMMENT,
        owner: receiverId,
      });
      return res.status(200).json({ reply: newReply, notification });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
