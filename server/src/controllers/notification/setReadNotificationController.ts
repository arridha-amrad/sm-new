import { Request, Response } from 'express';
import { findByIdAndUpdate } from '../../services/NotificationService';

export default async (req: Request, res: Response) => {
  const { notificationIds }: { notificationIds: string[] } = req.body;
  try {
    notificationIds.forEach(
      async (id) => await findByIdAndUpdate(id, { $set: { isRead: true } })
    );
    return res.status(200).send('notifications get read');
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
