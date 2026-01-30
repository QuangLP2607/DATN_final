import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import classNames from "classnames/bind";
import styles from "./ChatInput.module.scss";
import { Icon } from "@iconify/react";
import type { PreviewItem } from "../../index";
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
} from "emoji-picker-react";
import { useClickOutside } from "@/hooks/useClickOutside";

const cx = classNames.bind(styles);

interface ChatInputProps {
  text: string;
  setText: (val: string) => void;
  pendingFiles: PreviewItem[];
  uploading: boolean;
  sendMessage: () => void;
  onSelectMedia: (e: ChangeEvent<HTMLInputElement>) => void;
  removePreview: (id: string) => void;
}

const ChatInput = ({
  text,
  setText,
  pendingFiles,
  uploading,
  sendMessage,
  onSelectMedia,
  removePreview,
}: ChatInputProps) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  useClickOutside(emojiRef, () => {
    setShowEmoji(false);
  });

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText(text + emojiData.emoji);
  };

  return (
    <>
      {pendingFiles.length > 0 && (
        <div className={cx("preview-bar")}>
          {pendingFiles.map((item) => (
            <div key={item.id} className={cx("preview-item")}>
              {item.preview.type === "image" && <img src={item.preview.url} />}
              {item.preview.type === "video" && (
                <video src={item.preview.url} muted />
              )}
              {item.preview.type === "file" && (
                <div className={cx("file")}>
                  <Icon
                    className={cx("file-icon")}
                    icon="solar:document-text-linear"
                  />
                  <span className={cx("file-name")}>{item.preview.name}</span>
                </div>
              )}
              <button onClick={() => removePreview(item.id)}>
                <Icon icon="iconamoon:close" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={cx("chat__input")}>
        {/* Upload file */}
        <label className={cx("upload-btn")}>
          <Icon icon="iconoir:media-image-list" />
          <input hidden type="file" multiple onChange={onSelectMedia} />
        </label>

        {/* Message input */}
        <input
          className={cx("message-input")}
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
          className={cx("send-btn")}
          onClick={sendMessage}
          disabled={uploading || (!text.trim() && pendingFiles.length === 0)}
        >
          Gửi
        </button>

        {/* Emoji picker toggle */}
        <div ref={emojiRef} className={cx("emoji-container")}>
          <button
            type="button"
            className={cx("emoji-btn")}
            onClick={() => setShowEmoji((prev) => !prev)}
          >
            <Icon icon="mdi:emoticon-outline" />
          </button>

          {showEmoji && (
            <div className={cx("emoji-wrapper")}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                emojiStyle={EmojiStyle.FACEBOOK}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatInput;
