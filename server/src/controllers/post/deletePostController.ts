import { Request, Response } from 'express';
import { findOnePost, removePost } from '../../services/PostService';

export default async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await findOnePost(postId);
    if (post?.owner._id.toString() === req.userId) {
      const result = await removePost(postId);
      if (!result) {
        return res.sendStatus(404);
      }
      return res.status(200).send('deleted');
    }
    return res.sendStatus(403);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
