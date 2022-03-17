import { Request, Response } from 'express';
import { NotificationType } from '../../models/notification/INotificationModel';
import {
  createNotification,
  findOneNotificationAndDelete,
} from '../../services/NotificationService';
import { editPost, findOnePost } from '../../services/PostService';

export default async (req: Request, res: Response) => {
  const likeSender = req.userId;
  const { postId } = req.params;
  try {
    const post = await findOnePost(postId);
    if (post) {
      const isLiked = post?.likes.find(
        (user) => user._id?.toString() === likeSender
      );
      const updatedPost = await editPost(
        postId,
        isLiked
          ? { $pull: { likes: likeSender } }
          : { $push: { likes: likeSender } }
      );

      // create notification if likeSender is not the post owner
      let notification;
      if (post?.owner._id.toString() !== likeSender) {
        if (isLiked) {
          await findOneNotificationAndDelete({
            owner: post.owner,
            post: post.id,
            sender: likeSender,
            type: NotificationType.LIKE_POST,
          });
        } else {
          notification = await createNotification({
            owner: post.owner,
            post: post.id,
            sender: likeSender,
            type: NotificationType.LIKE_POST,
          });
        }
      }
      return res.status(200).json({ post: updatedPost, notification });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
