import { Request, Response } from 'express';
import { IMessage } from '../types/ModelTypes';
import ChatServices from '../services/ChatServices';
import Helpers from '../utils/Helpers';

class ChatController {
   async getOneConversation(req: Request, res: Response) {
      const { receiverId } = req.query;
      const loginUserId = Helpers.getUserIdFromAccToken(req);
      try {
         const conversation = await ChatServices.findConversation({
            $and: [
               {
                  users: {
                     $elemMatch: { $eq: loginUserId },
                  },
               },
               {
                  users: {
                     $elemMatch: { $eq: receiverId },
                  },
               },
            ],
         });
         let messages: IMessage[] = [];
         if (conversation) {
            messages = await ChatServices.findMessages({
               conversationId: conversation?.id,
            });
         }
         return res.status(200).json({ messages });
      } catch (err) {
         console.log(err);
         return res.sendStatus(500);
      }
   }

   async getManyConversations(req: Request, res: Response) {
      const userId = Helpers.getUserIdFromAccToken(req);
      try {
         const conversations = await ChatServices.findConversations(userId);
         return res.status(200).json({ conversations });
      } catch (err: any) {
         console.log(err);
         return res.sendStatus(500);
      }
   }

   async getMessages(req: Request, res: Response) {
      const { conversationId } = req.query;
      const loginUserId = Helpers.getUserIdFromAccToken(req);
      try {
         let messages: IMessage[] = [];
         if (conversationId !== 'undefined') {
            const data = await ChatServices.findMessages({ conversationId });
            data.forEach(async (d) => {
               if (d.receiver.toString() === loginUserId) {
                  d.isRead = true;
                  await d.save();
               }
            });
            messages = data;
         }
         return res.status(200).json({ messages });
      } catch (err) {
         console.log(err);
         return res.sendStatus(500);
      }
   }

   async sendMessage(req: Request, res: Response) {
      const { conversationId, isGroup } = req.query;
      const chatSender = Helpers.getUserIdFromAccToken(req);
      const { message, receiverId } = req.body;
      try {
         let conversation = await ChatServices.findConversation({
            $and: [{ users: chatSender }, { users: receiverId }],
         });

         if (!conversation) {
            conversation = await ChatServices.createConversation({
               users: [chatSender, receiverId],
            });
         }

         const newMessage = await ChatServices.createMessage({
            conversationId: conversation?.id,
            sender: chatSender,
            receiver: receiverId,
            text: message,
         });

         conversation!.lastMessage = newMessage?.id!;
         const upcon = await conversation?.save();

         const populatedConversation = await ChatServices.findConversationById(
            upcon?.id
         );

         const unreadMessages = await ChatServices.findUnreadMessages(
            upcon?.id,
            receiverId
         );

         const data = {
            ...populatedConversation?.toObject(),
            totalUnreadMessage: unreadMessages.length,
         };

         if (conversationId !== 'undefined') {
            const data = await ChatServices.findMessages({ conversationId });
            data.forEach(async (d) => {
               if (d.receiver.toString() === chatSender) {
                  d.isRead = true;
                  await d.save();
               }
            });
         }

         return res
            .status(200)
            .json({ conversation: data, message: newMessage });
      } catch (err: any) {
         console.log(err);
         return res.sendStatus(500);
      }
   }
}

export default new ChatController();
