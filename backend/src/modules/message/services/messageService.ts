import { Types } from "mongoose";
import { MessageModel } from "../../../models/Message";
import { MessageDTO, MessageReplyDTO, MessageMediaDTO } from "../dto";
import mediaService from "./mediaService";

export default {
  sendMessage: async (
    conversation_id: string,
    sender_id: string,
    sender_role: "teacher" | "student",
    content?: string,
    type: "text" | "image" | "file" = "text",
    reply_to?: string,
    media_ids?: string[]
  ): Promise<MessageDTO> => {
    const message = await MessageModel.create({
      conversation_id: new Types.ObjectId(conversation_id),
      sender_id: new Types.ObjectId(sender_id),
      sender_role,
      content,
      type,
      reply_to: reply_to ? new Types.ObjectId(reply_to) : undefined,
      is_deleted: false,
    });

    let media: MessageMediaDTO[] = [];
    if (media_ids?.length) {
      media = await mediaService.attachMediaToMessage(media_ids, message._id);
    }

    let reply: MessageReplyDTO | undefined;
    if (reply_to) {
      const replyMsg = await MessageModel.findById(reply_to).select(
        "_id sender_id content"
      );
      if (replyMsg) {
        reply = {
          id: replyMsg._id.toString(),
          sender_id: replyMsg.sender_id.toString(),
          content: replyMsg.content,
        };
      }
    }

    return {
      id: message._id.toString(),
      sender_id,
      sender_role,
      type,
      content,
      is_deleted: false,
      createdAt: message.createdAt!,
      edited_at: message.edited_at,
      media,
      reactions: [],
      reply_to: reply,
    };
  },

  editMessage: async (
    message_id: string,
    sender_id: string,
    content: string
  ) => {
    await MessageModel.updateOne(
      { _id: message_id, sender_id: sender_id },
      { content, edited_at: new Date() }
    );
  },

  deleteMessage: async (message_id: string, sender_id: string) => {
    await MessageModel.updateOne(
      { _id: message_id, sender_id: sender_id },
      { is_deleted: true, deleted_at: new Date() }
    );
  },
};
