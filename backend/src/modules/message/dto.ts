import { IMessage } from "../../interfaces/message";
import { IMessageMedia } from "../../interfaces/messageMedia";
import { IMessageReaction } from "../../interfaces/messageReaction";

// reaction
export type MessageReactionDTO = Pick<IMessageReaction, "emoji"> & {
  count: number;
  reacted_by_user_ids: string[];
};

// media
export type MessageMediaDTO = Omit<Pick<IMessageMedia, "id">, "id"> & {
  id: string;
  url: string;
  type: "image" | "file";
  filename?: string;
};

// reply
export type MessageReplyDTO = Omit<
  Pick<IMessage, "id" | "sender_id" | "content">,
  "id" | "sender_id"
> & {
  id: string;
  sender_id: string;
  content?: string;
};

// main message
export type MessageDTO = Omit<
  Pick<
    IMessage,
    | "id"
    | "sender_id"
    | "sender_role"
    | "type"
    | "content"
    | "is_deleted"
    | "createdAt"
    | "edited_at"
  >,
  "id" | "sender_id"
> & {
  id: string;
  sender_id: string;
  reply_to?: MessageReplyDTO;
  media?: MessageMediaDTO[];
  reactions?: MessageReactionDTO[];
};

// response khi load messages
export type LoadMessagesResponse = {
  messages: MessageDTO[];
  total: number;
  next_cursor?: string;
};
