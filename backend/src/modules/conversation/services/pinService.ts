import { Types } from "mongoose";
import { ConversationPinModel } from "../../../models/ConversationPin";
import {
  PinnedMessageDTO,
  LoadPinnedMessagesResponse,
} from "../dto/conversationPin";

export default {
  getPins: async (
    conversation_id: string
  ): Promise<LoadPinnedMessagesResponse> => {
    const pins = await ConversationPinModel.find({
      conversation_id: new Types.ObjectId(conversation_id),
    }).lean();

    const pinned_messages: PinnedMessageDTO[] = pins.map((p) => ({
      message_id: p.message_id.toString(),
      pinned_by: p.pinned_by.toString(),
      pinned_at: p.pinned_at!,
    }));

    return { conversation_id, pinned_messages };
  },

  pinMessage: async (
    conversation_id: string,
    message_id: string,
    user_id: string
  ) => {
    const existing = await ConversationPinModel.findOne({
      conversation_id: new Types.ObjectId(conversation_id),
      message_id: new Types.ObjectId(message_id),
    });

    if (existing) return existing;

    const pin = await ConversationPinModel.create({
      conversation_id: new Types.ObjectId(conversation_id),
      message_id: new Types.ObjectId(message_id),
      pinned_by: new Types.ObjectId(user_id),
      pinned_at: new Date(),
    });

    return pin;
  },

  unpinMessage: async (conversation_id: string, message_id: string) => {
    return ConversationPinModel.deleteOne({
      conversation_id: new Types.ObjectId(conversation_id),
      message_id: new Types.ObjectId(message_id),
    });
  },
};
