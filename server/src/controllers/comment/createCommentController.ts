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
      if (post.owner._id.toString() !== commentUser) {
      }
      return res.status(200).json({ comment: newComment });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
