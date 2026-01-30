export type MessageType = "text" | "image" | "file" | "deleted";
export type SenderRole = "teacher" | "student";

import { type MessageMedia } from "./messegeMedia";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: SenderRole;
  type: MessageType;
  content?: string;
  is_deleted: boolean;
  deleted_at?: string;
  edited_at?: string;
  createdAt: string;
  updatedAt: string;
  medias?: MessageMedia[];
}
