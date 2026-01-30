import classNames from "classnames/bind";
import styles from "./ChatMessage.module.scss";
import { TooltipPortal } from "@/components/ui/Tooltip";
import type { Media } from "@/interfaces/media";
import { formatDate } from "@/utils/date";
import defaultAvatar from "@/assets/commons/avatar-default.svg";

const cx = classNames.bind(styles);

interface ChatBubbleProps {
  message: {
    id: string;
    sender_id: string;
    type: "text" | "image" | "video" | "file" | "deleted";
    content?: string;
    is_deleted?: boolean;
    medias?: Media[];
    createdAt: string;
  };
  isMe: boolean;
  showAvatar: boolean;
  senderName?: string;
  senderAvatar?: string;
  firstOfSender: boolean;
  lastOfSender: boolean;
}

export default function ChatMessage({
  message: m,
  isMe,
  showAvatar,
  senderName,
  senderAvatar,
  firstOfSender,
  lastOfSender,
}: ChatBubbleProps) {
  const contentClasses = cx("chat-message__content", {
    "chat-message__content--me": isMe,
    "chat-message__content--first": firstOfSender,
    "chat-message__content--last": lastOfSender,
  });

  return (
    <div
      className={cx(
        "chat-message",
        isMe ? "chat-message--me" : "chat-message--other",
      )}
    >
      {!isMe && showAvatar && senderAvatar && (
        <div className={cx("chat-message__avatar")}>
          <TooltipPortal text={senderName || "Unknown"} position="left">
            <img
              className={cx("chat-message__avatar-img")}
              src={senderAvatar || defaultAvatar}
              alt={senderName}
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
          </TooltipPortal>
        </div>
      )}

      <div className={cx("chat-message__container")}>
        {!isMe && showAvatar && senderName && (
          <div className={cx("chat-message__sender-name")}>{senderName}</div>
        )}

        <TooltipPortal
          text={formatDate(m.createdAt)}
          position={isMe ? "right" : "left"}
        >
          <div className={contentClasses}>
            {m.is_deleted ? (
              <i className={cx("chat-message__deleted")}>Tin nhắn đã bị xóa</i>
            ) : m.type === "text" ? (
              m.content
            ) : (
              m.medias?.map((media) =>
                media.file_type === "image" ? (
                  <img key={media.id} src={media.url} />
                ) : (
                  <span key={media.id}>{media.file_name}</span>
                ),
              )
            )}
          </div>
        </TooltipPortal>
      </div>
    </div>
  );
}
