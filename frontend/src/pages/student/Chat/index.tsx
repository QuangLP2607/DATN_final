import { useEffect, useState, useRef, type ChangeEvent } from "react";
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { socket } from "@/services/socket";
import { useClass } from "@/hooks/useClass";
import { useAuth } from "@/hooks/useAuth";
import mediaApi, { type UploadPurpose } from "@/services/mediaService";
import type { Media } from "@/interfaces/media";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import type { JoinClassResponse, JoinClassMemberDTO } from "@/interfaces/chat";

const cx = classNames.bind(styles);

/* ---------------- CONSTANT ---------------- */

const UPLOAD_PURPOSES: Record<"image" | "video" | "file", UploadPurpose> = {
  image: "chat/img",
  video: "chat/video",
  file: "chat/file",
};

export type UploadType = "image" | "video" | "file";

export type Preview =
  | { type: "image"; url: string }
  | { type: "video"; url: string }
  | { type: "file"; name: string };

export type PreviewItem = {
  id: string;
  file: File;
  preview: Preview;
  status: "pending" | "sending" | "success" | "error";
};

interface ServerMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "student" | "teacher";
  type: "text" | "image" | "video" | "file" | "deleted";
  content?: string;
  hasMedia?: boolean;
  medias?: Media[];
  is_deleted?: boolean;
  createdAt: string;
}

interface SenderInfo {
  name: string;
  avatar: string;
}

/* ================= COMPONENT ================= */

const Chat = () => {
  const { activeClass } = useClass();
  const { user } = useAuth();
  const classId = activeClass?.id;

  const [conversationId, setConversationId] = useState("");
  const [members, setMembers] = useState<JoinClassMemberDTO[]>([]);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [allMedia, setAllMedia] = useState<{ media: Media; msgId: string }[]>(
    [],
  );
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PreviewItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const prevScrollHeight = useRef(0);
  const prevMessageCount = useRef(0);
  const hasInitialScroll = useRef(false);

  const isAtBottom = () => {
    const el = messagesRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 50;
  };

  /* ---------------- SOCKET INIT ---------------- */

  useEffect(() => {
    if (!classId) return;
    if (!socket.connected) socket.connect();

    const onConnect = () => {
      socket.emit("join_conversation", { class_id: classId });
    };

    socket.on("connect", onConnect);

    socket.on("chat_joined", (data: JoinClassResponse) => {
      setConversationId(data.id);
      setMembers(data.members);
      socket.emit("load_messages", { conversation_id: data.id });
    });

    socket.on("messages_loaded", ({ messages: newMessages, next_cursor }) => {
      const ordered = [...newMessages].reverse();

      setMessages((prev) => {
        if (!prev.length) return ordered;
        const existed = new Set(prev.map((m) => m.id));
        const filtered = ordered.filter((m) => !existed.has(m.id));
        return [...filtered, ...prev];
      });

      setHasMore(Boolean(next_cursor));
      setLoadingMore(false);
    });

    socket.on("new_message", (msg: ServerMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message_deleted", ({ message }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m)),
      );
    });

    socket.on("message_media_loaded", async ({ messageId, medias }) => {
      const withUrl = await Promise.all(
        medias.map(async (m: Media) => {
          const res = await mediaApi.getViewUrl(m.id);
          return { ...m, url: res.url };
        }),
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, medias: withUrl } : m)),
      );
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("chat_joined");
      socket.off("messages_loaded");
      socket.off("new_message");
      socket.off("message_deleted");
      socket.off("message_media_loaded");
    };
  }, [classId]);

  /* ---------------- LOAD MEDIA ---------------- */

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.hasMedia && (!msg.medias || msg.medias.length === 0)) {
        socket.emit("load_message_media", { message_id: msg.id });
      }
    });
  }, [messages]);

  /* ---------------- SCROLL ---------------- */

  const handleScroll = () => {
    const el = messagesRef.current;
    if (!el) return;

    if (!loadingMore && hasMore && el.scrollTop <= 10 && messages.length) {
      isLoadingMoreRef.current = true;
      prevScrollHeight.current = el.scrollHeight;
      setLoadingMore(true);

      socket.emit("load_messages", {
        conversation_id: conversationId,
        before: messages[0].id,
      });
    }

    if (isAtBottom()) setShowScrollDown(false);
  };

  useEffect(() => {
    if (!isLoadingMoreRef.current) return;
    const el = messagesRef.current;
    if (!el) return;

    const diff = el.scrollHeight - prevScrollHeight.current;
    el.scrollTop = diff;
    isLoadingMoreRef.current = false;
  }, [messages]);

  useEffect(() => {
    if (!messages.length || hasInitialScroll.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    hasInitialScroll.current = true;
  }, [messages]);

  useEffect(() => {
    const isNewMessage =
      messages.length > prevMessageCount.current && !isLoadingMoreRef.current;

    if (isNewMessage) {
      if (isAtBottom()) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        setShowScrollDown(true);
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const list = messages.flatMap((m) =>
      !m.is_deleted && m.medias
        ? m.medias.map((media) => ({ media, msgId: m.id }))
        : [],
    );
    setAllMedia(list);
  }, [messages]);

  /* ---------------- FILE SELECT ---------------- */

  const onSelectMedia = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const items: PreviewItem[] = files.map((file) => {
      if (file.type.startsWith("image/"))
        return {
          id: crypto.randomUUID(),
          file,
          preview: { type: "image", url: URL.createObjectURL(file) },
          status: "pending",
        };
      if (file.type.startsWith("video/"))
        return {
          id: crypto.randomUUID(),
          file,
          preview: { type: "video", url: URL.createObjectURL(file) },
          status: "pending",
        };
      return {
        id: crypto.randomUUID(),
        file,
        preview: { type: "file", name: file.name },
        status: "pending",
      };
    });

    setPendingFiles((prev) => [...prev, ...items]);
    e.target.value = "";
  };

  const removePreview = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  /* ---------------- UPLOAD ---------------- */

  const uploadFile = async (file: File): Promise<Media> => {
    const type: UploadType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "file";

    return mediaApi.uploadMedia(file, {
      domain_id: classId!,
      file_type: file.type,
      purpose: UPLOAD_PURPOSES[type],
    });
  };

  const uploadFiles = async (files: PreviewItem[]): Promise<Media[]> => {
    return Promise.all(files.map((item) => uploadFile(item.file)));
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!text.trim() && pendingFiles.length === 0) return;

    setUploading(true);

    try {
      const medias = pendingFiles.length ? await uploadFiles(pendingFiles) : [];

      socket.emit("send_message", {
        conversation_id: conversationId,
        user_id: user.id,
        content: text.trim() || undefined,
        media_ids: medias.length ? medias.map((m) => m.id) : undefined,
      });

      setText("");
      setPendingFiles([]);
    } catch (err) {
      console.error(err);
      alert("Gửi tin nhắn thất bại");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SENDER INFO ---------------- */

  const getSender = (sender_id: string): SenderInfo => {
    const member = members.find((m) => m.id === sender_id);
    return {
      name: member?.username || "Unknown",
      avatar: member?.avatar_url || "/default-avatar.png",
    };
  };

  if (!classId) return <p>Chưa có lớp</p>;

  return (
    <div className={cx("chat-wrapper")}>
      <div className={cx("chat")}>
        <div
          ref={messagesRef}
          className={cx("chat__messages")}
          onScroll={handleScroll}
        >
          {messages.map((m, index) => {
            const isMe = user?.id === m.sender_id;
            const sender = getSender(m.sender_id);
            const prevMsg = messages[index - 1];
            const nextMsg = messages[index + 1];

            return (
              <ChatMessage
                key={m.id}
                message={m}
                isMe={isMe}
                senderName={sender.name}
                senderAvatar={sender.avatar}
                firstOfSender={!prevMsg || prevMsg.sender_id !== m.sender_id}
                lastOfSender={!nextMsg || nextMsg.sender_id !== m.sender_id}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {showScrollDown && (
          <button
            className={cx("chat__scroll-down")}
            onClick={() =>
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ⬇
          </button>
        )}

        <ChatInput
          text={text}
          setText={setText}
          pendingFiles={pendingFiles}
          uploading={uploading}
          sendMessage={sendMessage}
          onSelectMedia={onSelectMedia}
          removePreview={removePreview}
        />
      </div>

      <ChatSidebar items={allMedia} members={members} />
    </div>
  );
};

export default Chat;
