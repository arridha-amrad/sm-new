import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { save } from '../../services/PostService';
import { upload } from '../../utils/CloudinaryUploader';

export default async (req: Request, res: Response) => {
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
        const res = await upload(file.tempFilePath, 'posts');
        if (res) {
          imagesURL.push(res?.url);
        }
      }
      const newPost = await save({
        body,
        owner: req.userId,
        images: imagesURL,
      });
      files.forEach((file) => fs.unlinkSync(file.tempFilePath));
      return res.status(200).json({ post: newPost });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
};
