import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import PostServices from '../services/PostServices';
import fs from 'fs';
import Cloudinary from '../utils/Cloudinary';
import Helpers from '../utils/Helpers';
import NotificationServices from '../services/NotificationServices';
import { NotificationType } from '../types/ModelTypes';

class PostController {
  async getMany(req: Request, res: Response) {
    try {
      const posts = await PostServices.findMany();
      return res.status(200).json({ posts });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const post = await PostServices.findOne(id);
      return res.status(200).json({ post });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async create(req: Request, res: Response) {
    const { body } = req.body;
    const reqFiles = req.files?.images;

    let files: UploadedFile[] = [];

    if (reqFiles as UploadedFile) {
      files.push(reqFiles as UploadedFile);
    }
    if (reqFiles as UploadedFile[]) {
      files = reqFiles as UploadedFile[];
    }

    if (files) {
      if (files.length > 5) {
        files.forEach((file) => fs.unlinkSync(file.tempFilePath));
        return res.status(400).send('maximum photo is 5');
      }

      const filteredImages = files.filter((file) => file.size > 1000 * 1000);

      if (filteredImages.length > 0) {
        files.forEach((file) => fs.unlinkSync(file.tempFilePath));
        return res.status(400).send('maximum a file size 1MB');
      }

      try {
        const imagesURL: string[] = [];
        for (let file of files) {
          const res = await Cloudinary.upload(file.tempFilePath, 'posts');
          if (res) {
            imagesURL.push(res?.url);
          }
        }
        const newPost = await PostServices.save({
          body,
          owner: req.app.locals.userId,
          images: imagesURL,
        });
        files.forEach((file) => fs.unlinkSync(file.tempFilePath));
        return res.status(200).json({ post: newPost });
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    }
  }

  async like(req: Request, res: Response) {
    const likeSender = Helpers.getUserIdFromAccToken(req);
    const { id: postId } = req.params;
    try {
      const post = await PostServices.findOne(postId);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      const isLiked = post?.likes.find(
        (user) => user._id?.toString() === likeSender
      );
      const updatedPost = await PostServices.update(
        postId,
        isLiked
          ? { $pull: { likes: likeSender } }
          : { $push: { likes: likeSender } }
      );

      // create notification if likeSender is not the post owner
      let notification = null;
      if (post.owner._id.toString() !== likeSender) {
        if (isLiked) {
          await NotificationServices.delete({
            owner: post.owner,
            post: post.id,
            sender: likeSender,
            type: NotificationType.LIKE_POST,
          });
        } else {
          notification = await NotificationServices.create({
            owner: post.owner,
            post: post.id,
            sender: likeSender,
            type: NotificationType.LIKE_POST,
          });
        }
      }
      return res.status(200).json({ post: updatedPost, notification });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response) {
    const { id: postId } = req.params;
    const loginUser = Helpers.getUserIdFromAccToken(req);
    try {
      const post = await PostServices.findOne(postId);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      if (post.owner._id.toString() !== loginUser) {
        return res.sendStatus(403).send('You are not the post owner');
      }
      const updatedPost = await PostServices.update(postId, { ...req.body });
      return res.status(200).json({ post: updatedPost });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async delete(req: Request, res: Response) {
    const { id: postId } = req.params;
    const loginUser = Helpers.getUserIdFromAccToken(req);
    try {
      const post = await PostServices.findOne(postId);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      if (post.owner._id.toString() !== loginUser) {
        return res.sendStatus(403);
      }
      const result = await PostServices.remove(postId);
      if (!result) {
        return res.sendStatus(404);
      }
      return res.status(200).send('deleted');
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new PostController();
