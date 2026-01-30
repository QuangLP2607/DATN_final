import { Types } from "mongoose";
import { MessageModel } from "../../../models/Message";
import { MessageMediaModel } from "../../../models/MessageMedia";
import { MessageReactionModel } from "../../../models/MessageReaction";
import { IMedia } from "../../../interfaces/media";
import { fetchS3Url } from "../../../utils/s3UrlCache";
import {
  MessageDTO,
  MessageMediaDTO,
  MessageReactionDTO,
  MessageReplyDTO,
  LoadMessagesResponse,
} from "../dto";

export default {
  loadMessages: async (
    conversation_id: string,
    limit = 20,
    before?: string
  ): Promise<LoadMessagesResponse> => {
    const match: any = { conversation_id: new Types.ObjectId(conversation_id) };
    if (before) match._id = { $lt: new Types.ObjectId(before) };

    const messagesRaw = await MessageModel.find(match)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const messageIds = messagesRaw.map((m) => m._id);

    // media
    const mediaRaw = await MessageMediaModel.find({
      message_id: { $in: messageIds },
    })
      .populate<{ media_id: IMedia }>(
        "media_id",
        "file_key file_name file_type"
      )
      .lean();

    const mediaMap: Record<string, MessageMediaDTO[]> = {};
    for (const mm of mediaRaw) {
      const mediaDoc = mm.media_id;
      if (!mediaDoc) continue;

      const msgId = mm.message_id.toString();
      if (!mediaMap[msgId]) mediaMap[msgId] = [];

      const url = mediaDoc.file_key ? await fetchS3Url(mediaDoc.file_key) : "";

      mediaMap[msgId].push({
        id: mediaDoc._id.toString(),
        url,
        type: mediaDoc.file_type === "image" ? "image" : "file",
        filename: mediaDoc.file_name,
      });
    }

    // reactions
    const reactionsRaw = await MessageReactionModel.find({
      message_id: { $in: messageIds },
    }).lean();

    const reactionsMap: Record<string, MessageReactionDTO[]> = {};
    for (const r of reactionsRaw) {
      const key = r.message_id.toString();
      if (!reactionsMap[key]) reactionsMap[key] = [];

      const existing = reactionsMap[key].find((e) => e.emoji === r.emoji);
      if (existing) {
        existing.count += 1;
        existing.reacted_by_user_ids.push(r.user_id.toString());
      } else {
        reactionsMap[key].push({
          emoji: r.emoji,
          count: 1,
          reacted_by_user_ids: [r.user_id.toString()],
        });
      }
    }

    // replies
    const replyIds = messagesRaw
      .filter((m) => m.reply_to)
      .map((m) => m.reply_to);
    const replyRaw = replyIds.length
      ? await MessageModel.find({ _id: { $in: replyIds } })
          .select("_id sender_id content")
          .lean()
      : [];

    const replyMap: Record<string, MessageReplyDTO> = {};
    for (const r of replyRaw) {
      replyMap[r._id.toString()] = {
        id: r._id.toString(),
        sender_id: r.sender_id.toString(),
        content: r.content,
      };
    }

    const messages: MessageDTO[] = messagesRaw.map((m) => ({
      id: m._id.toString(),
      sender_id: m.sender_id.toString(),
      sender_role: m.sender_role,
      type: m.type,
      content: m.content,
      is_deleted: m.is_deleted,
      createdAt: m.createdAt!,
      edited_at: m.edited_at,
      reply_to: m.reply_to ? replyMap[m.reply_to.toString()] : undefined,
      media: mediaMap[m._id.toString()] || [],
      reactions: reactionsMap[m._id.toString()] || [],
    }));

    const next_cursor = messages.length
      ? messages[messages.length - 1].id
      : undefined;
    const total = await MessageModel.countDocuments({
      conversation_id: new Types.ObjectId(conversation_id),
    });

    return { messages, total, next_cursor };
  },
};
