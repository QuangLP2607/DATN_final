import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { socket } from "@/services/socket";
import { useClass } from "@/hooks/useClass";
import { useAuth } from "@/hooks/useAuth";
import mediaApi, { type UploadPurpose } from "@/services/mediaService";
import { Icon } from "@iconify/react";
import type { Media } from "@/interfaces/media";
import { TooltipPortal } from "@/components/ui/Tooltip";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessage from "./components/ChatMessage";
import type { JoinClassResponse, JoinClassMemberDTO } from "@/interfaces/chat";
import { formatDate } from "@/utils/date";

const cx = classNames.bind(styles);

const UPLOAD_PURPOSES: Record<"image" | "video" | "file", UploadPurpose> = {
  image: "chat/img",
  video: "chat/video",
  file: "chat/file",
};

type UploadType = keyof typeof UPLOAD_PURPOSES;

type Preview =
  | { type: "image"; url: string }
  | { type: "video"; url: string }
  | { type: "file"; name: string };

type PreviewItem = {
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

const Chat = () => {
  const { activeClass } = useClass();
  const { user } = useAuth();
  const classId = activeClass?.id;

  const [conversationId, setConversationId] = useState("");
  const [members, setMembers] = useState<JoinClassMemberDTO[]>([]);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [allMedia, setAllMedia] = useState<{ media: Media; msgId: string }[]>(
    []
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

  // ---------------- SOCKET INIT ----------------
  useEffect(() => {
    if (!classId) return;
    if (!socket.connected) socket.connect();

    const onConnect = () => {
      socket.emit("join_conversation", { class_id: classId });
    };

    socket.on("connect", onConnect);

    socket.on("server_error", (error: { message: string }) => {
      console.error("Server error:", error.message);
      alert(error.message);
    });

    socket.on("chat_joined", (data: JoinClassResponse) => {
      setConversationId(data.id);
      setMembers(data.members);
      socket.emit("load_messages", { conversation_id: data.id });
    });

    socket.on(
      "messages_loaded",
      ({
        messages: newMessages,
        next_cursor,
      }: {
        messages: ServerMessage[];
        next_cursor?: string;
      }) => {
        const ordered = [...newMessages].reverse();

        setMessages((prev) => {
          if (!prev.length) return ordered;
          const existed = new Set(prev.map((m) => m.id));
          const filtered = ordered.filter((m) => !existed.has(m.id));
          return [...filtered, ...prev];
        });

        setHasMore(Boolean(next_cursor));
        setLoadingMore(false);
      }
    );

    socket.on("new_message", (msg: ServerMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message_deleted", ({ message }: { message: ServerMessage }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      );
    });

    socket.on(
      "message_media_loaded",
      async ({ messageId, medias }: { messageId: string; medias: Media[] }) => {
        const withUrl = await Promise.all(
          medias.map(async (m) => {
            const res = await mediaApi.getViewUrl(m.id);
            return { ...m, url: res.url };
          })
        );
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, medias: withUrl } : m))
        );
      }
    );

    return () => {
      socket.off("connect", onConnect);
      socket.off("chat_joined");
      socket.off("messages_loaded");
      socket.off("new_message");
      socket.off("message_deleted");
      socket.off("message_media_loaded");
      socket.off("server_error");
    };
  }, [classId]);

  // ---------------- LOAD MEDIA ----------------
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.hasMedia && (!msg.medias || msg.medias.length === 0)) {
        socket.emit("load_message_media", { message_id: msg.id });
      }
    });
  }, [messages]);

  // ---------------- SCROLL ----------------
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
        : []
    );
    setAllMedia(list);
  }, [messages]);

  // ---------------- FILE SELECT ----------------
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

  // ---------------- UPLOAD FILE ----------------
  const uploadFile = async (file: File) => {
    const type: UploadType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : "file";

    const { uploadUrl, fileKey } = await mediaApi.getUploadUrl({
      domain_id: classId!,
      file_type: file.type,
      purpose: UPLOAD_PURPOSES[type],
    });

    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    const media = await mediaApi.create({
      file_key: fileKey,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
    });

    return { ...media, type };
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    setUploading(true);
    const filesToSend = [...pendingFiles];
    setPendingFiles([]);

    try {
      for (const item of filesToSend) {
        const media = await uploadFile(item.file);
        socket.emit("send_message", {
          conversation_id: conversationId,
          user_id: user.id,
          media_ids: [media.id],
          content: "",
        });
      }

      if (text.trim()) {
        socket.emit("send_message", {
          conversation_id: conversationId,
          user_id: user.id,
          content: text.trim(),
        });
        setText("");
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteMessage = (messageId: string) => {
    socket.emit("delete_message", {
      conversation_id: conversationId,
      user_id: user?.id,
      message_id: messageId,
    });
  };

  // ---------------- GET SENDER INFO ----------------
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

            const showAvatar =
              !isMe && (!prevMsg || prevMsg.sender_id !== m.sender_id);

            return (
              <ChatMessage
                key={m.id}
                message={m}
                isMe={isMe}
                showAvatar={showAvatar}
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
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              setShowScrollDown(false);
            }}
          >
            ⬇
          </button>
        )}

        {pendingFiles.length > 0 && (
          <div className={cx("preview-bar")}>
            {pendingFiles.map((item) => (
              <div key={item.id} className={cx("preview-item")}>
                {item.preview.type === "image" && (
                  <img src={item.preview.url} />
                )}
                {item.preview.type === "video" && (
                  <video src={item.preview.url} muted />
                )}
                {item.preview.type === "file" && (
                  <span>{item.preview.name}</span>
                )}
                <button onClick={() => removePreview(item.id)}>
                  <Icon icon="iconamoon:close" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={cx("chat__input")}>
          <label className={cx("upload-btn")}>
            <Icon icon="iconoir:media-image-list" />
            <input hidden type="file" multiple onChange={onSelectMedia} />
          </label>
          <input
            value={text}
            disabled={uploading}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={sendMessage}
            disabled={uploading || (!text.trim() && pendingFiles.length === 0)}
          >
            Gửi
          </button>
        </div>
      </div>
      <ChatSidebar items={allMedia} members={members} />
    </div>
  );
};

export default Chat;
