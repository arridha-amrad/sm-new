import { Request, Response } from 'express';
import { findOneComment } from '../../services/CommentService';

export default async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { body } = req.body;
  try {
    const comment = await findOneComment(commentId);
    if (comment) {
      comment.body = body;
      const updatedComment = await comment.save();
      return res.status(200).json({ comment: updatedComment });
    }
    return res.sendStatus(400);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
