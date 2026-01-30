import { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./MessageActions.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

const QUICK_EMOJIS = ["😀", "😂", "😍", "😢", "😮", "😡"];

type OpenAction = "menu" | "emoji" | null;

interface Props {
  messageId: string;
  isMe: boolean;
  align: "left" | "right";
  onAddReaction?: (msgId: string, emoji: string) => void;
  onPin?: (msgId: string) => void;
  onRecall?: (msgId: string) => void;
}

export default function MessageActions({
  messageId,
  isMe,
  align,
  onAddReaction,
  onPin,
  onRecall,
}: Props) {
  const [openAction, setOpenAction] = useState<OpenAction>(null);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (action: OpenAction) => {
    setOpenAction((prev) => (prev === action ? null : action));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenAction(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={cx(
        "actions",
        align === "left" ? "actions--left" : "actions--right",
        { open: openAction }
      )}
      data-open={openAction ? "true" : "false"}
    >
      {/* Emoji */}
      <div className={cx("action")}>
        <button className={cx("action-btn")} onClick={() => toggle("emoji")}>
          <Icon icon="iconoir:emoji" width="18" />
        </button>

        {openAction === "emoji" && (
          <div className={cx("action-open", "action-emoji")}>
            {QUICK_EMOJIS.map((e) => (
              <button
                key={e}
                className={cx("emoji-item")}
                onClick={() => {
                  onAddReaction?.(messageId, e);
                  setOpenAction(null);
                }}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu */}
      <div className={cx("action")}>
        <button className={cx("action-btn")} onClick={() => toggle("menu")}>
          <Icon icon="tabler:dots-vertical" />
        </button>

        {openAction === "menu" && (
          <div className={cx("action-open", "action-menu")}>
            <button onClick={() => onPin?.(messageId)}>Ghim</button>
            {isMe && (
              <button onClick={() => onRecall?.(messageId)}>Thu hồi</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
