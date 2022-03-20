import { User } from "../authentication/IAuthentication";

export interface SendChatDTO {
  message: string;
  receiverId: string;
  chatId?: string;
  isGroup: boolean;
}

export type SelectedPartner = User & { chatId?: string };
