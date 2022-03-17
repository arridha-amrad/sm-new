import { Request, Response } from 'express';
import { findPosts } from '../../services/PostService';

export default async (_: Request, res: Response) => {
  try {
    const posts = await findPosts();
    return res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
