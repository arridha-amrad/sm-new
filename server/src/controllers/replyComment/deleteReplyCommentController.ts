import { Request, Response } from 'express';
import { findOneComment } from '../../services/CommentService';
import { deleteReply, findOneReply } from '../../services/ReplyService';

export default async (req: Request, res: Response) => {
  const { replyId } = req.params;
  const loginUser = req.userId;
  try {
    const reply = await findOneReply(replyId);
    if (reply) {
      if (reply.sender.toString() === loginUser) {
        const comment = await findOneComment(reply.comment.toString());
        if (comment) {
          comment.replies.filter((reply) => reply.id !== replyId);
          await comment.save();
          await deleteReply(replyId);
          return res.sendStatus(200);
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
