import { Request, Response } from 'express';
import { findConversations } from '../../services/ConversationService';
import { findUnreadMessages } from '../../services/MessageService';
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
      const conversations = await findConversations(user.id);
      return res.status(200).json({ user, notifications, conversations });
    }
    return res.sendStatus(404);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
