import { Request, Response } from 'express';
import { findOneComment, removeComment } from '../../services/CommentService';

export default async (req: Request, res: Response) => {
  const userId = req.userId;
  const { commentId } = req.params;
  try {
    const comment = await findOneComment(commentId);
    if (comment) {
      if (comment.owner._id.toString() === userId) {
        await removeComment(commentId);
        return res.status(200).send('deleted');
      }
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
