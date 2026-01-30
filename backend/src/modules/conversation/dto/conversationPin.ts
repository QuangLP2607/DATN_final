import { IConversationPin } from "../../../interfaces/conversationPin";

export type PinnedMessageDTO = Omit<
  Pick<IConversationPin, "message_id" | "pinned_by" | "pinned_at">,
  "message_id" | "pinned_by"
> & {
  message_id: string;
  pinned_by: string;
};

export type LoadPinnedMessagesResponse = {
  conversation_id: string;
  pinned_messages: PinnedMessageDTO[];
};
