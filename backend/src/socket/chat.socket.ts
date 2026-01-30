import { Server, Socket } from "socket.io";
import messagesService from "../modules/message/services";
import conversationServices from "../modules/conversation/services";

interface ClientPayload {
  conversation_id: string;
  user_id: string;
  message_id?: string;
  content?: string;
  reply_to?: string;
  media_ids?: string[];
  emoji?: string;
}

// -------------------- init socket --------------------
export function initChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // -------------------- join conversation --------------------
    socket.on("join_conversation", async ({ class_id }) => {
      try {
        const convo = await conversationServices.conversation.joinClass(
          class_id
        );
        console.log("convo", convo.members);
        socket.join(convo.id);

        socket.emit("chat_joined", {
          id: convo.id,
          members: convo.members,
        });
      } catch (err) {
        socket.emit("server_error", { message: "Cannot join class chat" });
      }
    });

    // -------------------- leave conversation --------------------
    socket.on("leave_conversation", ({ conversation_id }) =>
      socket.leave(conversation_id)
    );

    // -------------------- load messages --------------------
    socket.on(
      "load_messages",
      async (payload: { conversation_id: string; before?: string }) => {
        try {
          // gọi service để lấy tin nhắn
          const data = await messagesService.loadMessages.loadMessages(
            payload.conversation_id,
            20, // limit mặc định
            payload.before
          );

          socket.emit("messages_loaded", {
            messages: data.messages,
            next_cursor: data.next_cursor,
          });
        } catch (err) {
          console.error(err);
          socket.emit("server_error", { message: "Failed to load messages" });
        }
      }
    );

    // -------------------- send message --------------------
    socket.on("send_message", async (payload: ClientPayload) => {
      console.log("Received payload from FE:", payload);
      try {
        const message = await messagesService.message.sendMessage(
          payload.conversation_id,
          payload.user_id,
          "student",
          payload.content,
          payload.media_ids?.length ? "file" : "text",
          payload.reply_to,
          payload.media_ids
        );

        console.log("Message saved in DB:", message); // <--- debug message backend tạo ra

        io.to(payload.conversation_id).emit("new_message", message);
      } catch (err) {
        console.error(err);
        socket.emit("server_error", { message: "Failed to send message" });
      }
    });

    // -------------------- edit message --------------------
    socket.on("edit_message", async (payload: ClientPayload) => {
      if (!payload.message_id || !payload.content) return;
      try {
        await messagesService.message.editMessage(
          payload.message_id,
          payload.user_id,
          payload.content
        );
        io.to(payload.conversation_id).emit("message_edited", {
          message_id: payload.message_id,
          content: payload.content,
        });
      } catch (err) {
        console.error(err);
      }
    });

    // delete message
    socket.on("delete_message", async (payload: ClientPayload) => {
      if (!payload.message_id) return;
      try {
        await messagesService.message.deleteMessage(
          payload.message_id,
          payload.user_id
        );
        io.to(payload.conversation_id).emit("message_deleted", {
          message_id: payload.message_id,
        });
      } catch (err) {
        console.error(err);
      }
    });

    // react / remove reaction
    socket.on("react_message", async (payload: ClientPayload) => {
      if (!payload.message_id || !payload.emoji) return;
      try {
        await messagesService.reaction.reactMessage(
          payload.message_id,
          payload.user_id,
          payload.emoji
        );
        io.to(payload.conversation_id).emit("message_reacted", {
          message_id: payload.message_id,
          user_id: payload.user_id,
          emoji: payload.emoji,
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("remove_reaction", async (payload: ClientPayload) => {
      if (!payload.message_id || !payload.emoji) return;
      try {
        await messagesService.reaction.removeReaction(
          payload.message_id,
          payload.user_id,
          payload.emoji
        );
        io.to(payload.conversation_id).emit("reaction_removed", {
          message_id: payload.message_id,
          user_id: payload.user_id,
          emoji: payload.emoji,
        });
      } catch (err) {
        console.error(err);
      }
    });

    // mark as read
    socket.on("mark_read", async (payload: ClientPayload) => {
      if (!payload.message_id) return;
      try {
        await messagesService.read.markAsRead(
          payload.conversation_id,
          payload.user_id,
          payload.message_id
        );
        socket.to(payload.conversation_id).emit("conversation_read", {
          user_id: payload.user_id,
          last_read_message_id: payload.message_id,
        });
      } catch (err) {
        console.error(err);
      }
    });

    // pin / unpin messages
    socket.on("pin_message", async (payload: ClientPayload) => {
      if (!payload.message_id) return;
      try {
        const pin = await conversationServices.pin.pinMessage(
          payload.conversation_id,
          payload.message_id,
          payload.user_id
        );
        io.to(payload.conversation_id).emit("message_pinned", pin);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("unpin_message", async (payload: ClientPayload) => {
      if (!payload.message_id) return;
      try {
        await conversationServices.pin.unpinMessage(
          payload.conversation_id,
          payload.message_id
        );
        io.to(payload.conversation_id).emit("message_unpinned", {
          message_id: payload.message_id,
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () =>
      console.log(`User disconnected: ${socket.id}`)
    );
  });
}
