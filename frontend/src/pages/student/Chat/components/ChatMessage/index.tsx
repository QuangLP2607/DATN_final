import classNames from "classnames/bind";
import styles from "./ChatMessage.module.scss";
import { TooltipPortal } from "@/components/ui/Tooltip";
import type { Media } from "@/interfaces/media";
import { formatDate } from "@/utils/date";

import MessageActions from "../MessageActions";

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
  senderName?: string;
  senderAvatar?: string;
  firstOfSender: boolean;
  lastOfSender: boolean;
  onAddReaction?: (msgId: string, emoji: string) => void;
}

export default function ChatMessage({
  message: m,
  isMe,
  senderName,
  senderAvatar,
  firstOfSender,
  lastOfSender,
  onAddReaction,
}: ChatBubbleProps) {
  const contentClasses = cx("message__content", {
    me: isMe,
    first: firstOfSender,
    last: lastOfSender,
  });

  return (
    <div className={cx("message", isMe && "message--me")}>
      {/* Avatar */}
      <div className={cx("message__avatar")}>
        {!isMe && lastOfSender && senderAvatar && (
          <TooltipPortal text={senderName || "Unknown"} position="left">
            <img
              className={cx("message__avatar-img")}
              src={senderAvatar}
              alt={senderName}
            />
          </TooltipPortal>
        )}
      </div>

      {/* Container */}
      <div className={cx("message__container")}>
        {/* Sender Name */}
        {!isMe && firstOfSender && senderName && (
          <div className={cx("message__sender-name")}>{senderName}</div>
        )}

        {/* Bubble + Actions */}

        <div className={cx("message__bubble-wrapper")}>
          <TooltipPortal
            text={formatDate(m.createdAt)}
            position={isMe ? "left" : "right"}
          >
            <div className={contentClasses}>
              {m.is_deleted ? (
                <i className={cx("message__deleted")}>Tin nhắn đã bị xóa</i>
              ) : m.type === "text" ? (
                m.content
              ) : (
                m.medias?.map((media) =>
                  media.file_type === "image" ? (
                    <img key={media.id} src={media.url} alt={media.file_name} />
                  ) : (
                    <span key={media.id}>{media.file_name}</span>
                  )
                )
              )}
            </div>
          </TooltipPortal>
          <div className={cx("message__actions")}>
            <MessageActions
              messageId={m.id}
              isMe={isMe}
              align={isMe ? "left" : "right"}
              onAddReaction={onAddReaction}
              onPin={(id) => console.log("Pin", id)}
              onRecall={(id) => console.log("Recall", id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
