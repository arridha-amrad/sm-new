import { Request, Response } from 'express';
import { findOnePost } from '../../services/PostService';

export default async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await findOnePost(postId);
    return res.status(200).json({ post });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
