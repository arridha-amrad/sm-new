import { Request, Response } from 'express';
import NotificationServices from '../services/NotificationServices';

class NotificationController {
  async read(req: Request, res: Response) {
    const { notificationIds }: { notificationIds: string[] } = req.body;
    try {
      notificationIds.forEach(
        async (id) =>
          await NotificationServices.update(id, { $set: { isRead: true } })
      );
      return res.status(200).send('notifications get read');
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new NotificationController();
