import { Request, Response } from 'express';
import { findUsers } from '../../services/UserServices';

export default async (req: Request, res: Response) => {
  const { username } = req.query;
  try {
    const searchResult = await findUsers({
      username: { $regex: username, $options: 'i' },
    });
    return res.status(200).json({ users: searchResult });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
