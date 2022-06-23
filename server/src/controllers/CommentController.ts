import { Request, Response } from 'express';
import { NotificationType } from '../models/notification/INotificationModel';
import CommentServices from '../services/CommentServices';
import NotificationServices from '../services/NotificationServices';
import PostServices from '../services/PostServices';
import Helpers from '../utils/Helpers';

class CommentController {
  async create(req: Request, res: Response) {
    const { postId } = req.params;
    const loginUser = Helpers.getUserIdFromAccToken(req);
    const { body } = req.body;
    try {
      const post = await PostServices.findOne(postId);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      const newComment = await CommentServices.save({
        body,
        post: postId,
        owner: loginUser,
      });
      post.comments.push(newComment);
      await post.save();
      // create notification if the loginUser is not the postOwner
      let notification;
      if (post.owner._id.toString() !== loginUser) {
        notification = await NotificationServices.create({
          comment: newComment,
          owner: post.owner,
          post: post,
          sender: loginUser,
          type: NotificationType.COMMENT_POST,
        });
      }
      return res.status(200).json({ comment: newComment, notification });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async delete(req: Request, res: Response) {
    const userId = Helpers.getUserIdFromAccToken(req);
    const { commentId } = req.params;
    try {
      const comment = await CommentServices.findOne(commentId);
      if (comment) {
        if (comment.owner._id.toString() === userId) {
          await CommentServices.delete(commentId);
          return res.status(200).send('deleted');
        }
      }
      return res.sendStatus(404);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async like(req: Request, res: Response) {
    const likeSender = Helpers.getUserIdFromAccToken(req);
    const { commentId } = req.params;
    try {
      let comment = await CommentServices.findOne(commentId);
      if (!comment) {
        return res.status(404).send('comment not found');
      }
      const isLiked = comment.likes.find(
        (user) => user._id?.toString() === likeSender
      );
      const updatedComment = await CommentServices.update(
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
      let notification;
      if (likeSender !== comment.owner._id.toString()) {
        if (isLiked) {
          await NotificationServices.delete({
            owner: comment.owner,
            comment: comment.id,
            sender: likeSender,
            type: NotificationType.LIKE_COMMENT,
          });
        } else {
          notification = await NotificationServices.create({
            owner: comment.owner,
            comment: comment.id,
            sender: likeSender,
            type: NotificationType.LIKE_COMMENT,
          });
        }
      }
      return res.status(200).json({ comment: updatedComment, notification });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response) {
    const { commentId } = req.params;
    const { body } = req.body;
    try {
      const comment = await CommentServices.findOne(commentId);
      if (!comment) {
        return res.status(404).send('Comment not found');
      }
      comment.body = body;
      const updatedComment = await comment.save();
      return res.status(200).json({ comment: updatedComment });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new CommentController();
