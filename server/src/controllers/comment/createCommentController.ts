import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotificationType } from '../../models/notification/INotificationModel';
import { addComment } from '../../services/CommentService';
import {
  createNotification,
  findOneNotification,
} from '../../services/NotificationService';
import { findOnePost } from '../../services/PostService';

export default async (req: Request, res: Response) => {
  const { postId } = req.params;
  const commentUser = req.userId;
  const { body } = req.body;

  try {
    const post = await findOnePost(postId);
    if (post) {
      const newComment = await addComment({
        body,
        post: postId,
        owner: commentUser,
      });
      post.comments.push(newComment);
      await post.save();

      // create notification if the commentUser is not the postOwner
      let notification;
      if (post.owner._id.toString() !== commentUser) {
        notification = await createNotification({
          comment: newComment,
          owner: post.owner,
          post: post,
          sender: commentUser,
          type: NotificationType.COMMENT_POST,
        });
      }
      return res.status(200).json({ comment: newComment, notification });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
