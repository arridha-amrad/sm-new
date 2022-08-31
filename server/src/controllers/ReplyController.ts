import { Request, Response } from 'express';
import { NotificationType } from '../types/ModelTypes';
import CommentServices from '../services/CommentServices';
import NotificationServices from '../services/NotificationServices';
import ReplyServices from '../services/ReplyServices';
import Helpers from '../utils/Helpers';

class ReplyController {
  async create(req: Request, res: Response) {
    const { isReplyToReply, answeredReplyId } = req.query;
    const { body, receiverId } = req.body;
    const { commentId } = req.params;
    const replySender = Helpers.getUserIdFromAccToken(req);
    try {
      const newReply = await ReplyServices.save({
        body,
        comment: commentId,
        receiver: receiverId,
        sender: replySender,
      });
      const comment = await CommentServices.findOne(commentId);
      if (!comment) {
        return res.status(404).send('Comment not found');
      }
      comment.replies.push(newReply);
      await comment.save();
      // create notification for receiver of reply
      let notification;
      if (isReplyToReply === 'true') {
        console.log('making reply to reply');
        const reply = await ReplyServices.findOne(answeredReplyId as string);
        notification = await NotificationServices.create({
          reply,
          replyTwo: newReply,
          sender: replySender,
          comment: comment.id,
          type: NotificationType.REPLY_REPLY,
          owner: receiverId,
        });
      } else {
        notification = await NotificationServices.create({
          reply: newReply,
          sender: replySender,
          comment: comment.id,
          type: NotificationType.REPLY_COMMENT,
          owner: receiverId,
        });
      }
      return res.status(200).json({ reply: newReply, notification });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async delete(req: Request, res: Response) {
    const { replyId } = req.params;
    const loginUser = Helpers.getUserIdFromAccToken(req);
    try {
      const reply = await ReplyServices.findOne(replyId);
      if (!reply) {
        return res.status(404).send('Reply not found');
      }
      if (reply.sender.toString() !== loginUser) {
        return res.status(400).send('Permission denied');
      }
      await NotificationServices.deleteMany({
        reply: replyId,
      });
      const comment = await CommentServices.findOne(reply.comment.toString());
      comment?.replies.filter((reply) => reply.id !== replyId);
      if (comment) {
        await comment.save();
      }
      await ReplyServices.delete(replyId);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async like(req: Request, res: Response) {
    const likeSender = Helpers.getUserIdFromAccToken(req);
    const { replyId } = req.params;

    try {
      const reply = await ReplyServices.findOne(replyId);
      if (!reply) {
        return res.status(404).send('Reply not found');
      }
      const isLiked = reply?.likes.find(
        (userId) => userId.toString() === likeSender
      );
      const updatedReply = await ReplyServices.update(
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
          await NotificationServices.delete({
            owner: reply.sender,
            reply: reply.id,
            sender: likeSender,
            type: NotificationType.LIKE_REPLY,
          });
        } else {
          notification = await NotificationServices.create({
            owner: reply.sender,
            reply: reply.id,
            sender: likeSender,
            type: NotificationType.LIKE_REPLY,
          });
        }
      }
      return res.status(200).json({ reply: updatedReply, notification });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new ReplyController();
