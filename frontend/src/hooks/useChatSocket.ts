import { useEffect, useRef, useState } from "react";
import { socket } from "@/services/socket";
import mediaApi from "@/services/mediaService";
import type { ServerMessage } from "../types";
import type { Media } from "@/interfaces/media";

export const useChatSocket = ({
  classId,
  classStatus,
}: {
  classId?: string;
  classStatus?: string;
}) => {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMoreRef = useRef(false);

  /* INIT */
  useEffect(() => {
    if (!classId || classStatus !== "active") return;

    if (!socket.connected) socket.connect();

    socket.emit("join_class", { classId });

    socket.on("chat_joined", ({ conversationId }) => {
      setConversationId(conversationId);
      socket.emit("load_messages", { conversationId });
    });

    socket.on("messages_loaded", ({ messages, hasMore }) => {
      setMessages((prev) => {
        if (!prev.length) return messages;
        const existed = new Set(prev.map((m) => m.id));
        return [...messages.filter((m) => !existed.has(m.id)), ...prev];
      });
      setHasMore(hasMore);
      isLoadingMoreRef.current = false;
    });

    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));

    socket.on("message_deleted", ({ message }) =>
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      )
    );

    socket.on(
      "message_media_loaded",
      async ({ messageId, medias }: { messageId: string; medias: Media[] }) => {
        const withUrl = await Promise.all(
          medias.map(async (m) => ({
            ...m,
            url: (await mediaApi.getViewUrl(m.id)).url,
          }))
        );
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, medias: withUrl } : m))
        );
      }
    );

    return () => socket.removeAllListeners();
  }, [classId, classStatus]);

  /* LAZY MEDIA */
  useEffect(() => {
    messages.forEach((m) => {
      if (m.hasMedia && !m.medias?.length) {
        socket.emit("load_message_media", { messageId: m.id });
      }
    });
  }, [messages]);

  return {
    conversationId,
    messages,
    hasMore,
    setMessages,
    isLoadingMoreRef,
  };
};
