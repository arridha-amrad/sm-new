import { Request, Response } from 'express';
import { editPost, findOnePost } from '../../services/PostService';

export default async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await findOnePost(postId);
    if (post?.owner._id.toString() === req.userId) {
      const updatedPost = await editPost(postId, { ...req.body });
      return res.status(200).json({ post: updatedPost });
    }
    return res.sendStatus(403);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
