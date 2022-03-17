import { Request, Response } from 'express';
import { findNotificationsOfOneUser } from '../../services/NotificationService';
import { findUserById } from '../../services/UserServices';

export default async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await findUserById(
      userId,
      '_id username email avatarURL fullName'
    );
    if (user) {
      const notifications = await findNotificationsOfOneUser(user.id);
      return res.status(200).json({ user, notifications });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
