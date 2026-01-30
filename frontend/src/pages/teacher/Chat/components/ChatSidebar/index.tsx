import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChatSidebar.module.scss";
import type { Media } from "@/interfaces/media";
import type { JoinClassMemberDTO } from "@/interfaces/chat";
import mediaApi from "@/services/mediaService";
import { Icon } from "@iconify/react";
import ModalMediaViewer from "../ModalMediaViewer";
import Avatar from "@/assets/commons/avatar-default.svg";

const cx = classNames.bind(styles);

export interface ChatMediaSidebarItem {
  media: Media;
  msgId: string;
}

interface Props {
  items: ChatMediaSidebarItem[];
  members: JoinClassMemberDTO[];
}

type ViewKey = "main" | "members" | "pinned" | "media" | "file";

const ChatSidebar = ({ items, members }: Props) => {
  const [view, setView] = useState<ViewKey>("main");
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null);

  // Phân loại media/file
  const mediaItems = items.filter(
    ({ media }) =>
      media.file_type.startsWith("image/") ||
      media.file_type.startsWith("video/")
  );

  const fileItems = items.filter(
    ({ media }) =>
      !media.file_type.startsWith("image/") &&
      !media.file_type.startsWith("video/")
  );

  // format bytes
  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Download media
  const handleDownload = async (media: Media) => {
    const url = await mediaApi.getDownloadUrl(media.id);
    const a = document.createElement("a");
    a.href = url;
    a.download = media.file_name || "download";
    a.click();
  };

  // Render media item
  const renderMediaItem = ({ media }: ChatMediaSidebarItem) => (
    <div
      key={media.id}
      className={cx("panel__media-item")}
      onClick={() => setPreviewMedia(media)}
    >
      {media.file_type.startsWith("image/") ? (
        <img src={media.url} alt={media.file_name} />
      ) : (
        <video src={media.url} muted />
      )}
    </div>
  );
  console.log(members);
  // Render file item
  const renderFileItemRow = ({ media }: ChatMediaSidebarItem) => {
    const dotIndex = media.file_name.lastIndexOf(".");
    const name =
      dotIndex !== -1 ? media.file_name.slice(0, dotIndex) : media.file_name;
    const ext = dotIndex !== -1 ? media.file_name.slice(dotIndex) : "";

    return (
      <div key={media.id} className={cx("panel__file-item")}>
        <Icon
          icon="mdi:file-document-outline"
          className={cx("panel__file-icon")}
        />
        <div className={cx("panel__file-info")}>
          <span className={cx("panel__file-name")}>
            <span className={cx("panel__file-name-text")}>{name}</span>
            <span className={cx("panel__file-ext")}>{ext}</span>
          </span>
          <span className={cx("panel__file-size")}>
            {formatBytes(media.file_size)}
          </span>
        </div>
        <button
          className={cx("panel__download")}
          onClick={() => handleDownload(media)}
        >
          <Icon icon="mdi:download" />
        </button>
      </div>
    );
  };

  return (
    <aside className={cx("panel")}>
      {/* HEADER */}
      <div className={cx("panel__header")}>
        {view !== "main" && (
          <button
            className={cx("panel__back-btn")}
            onClick={() => setView("main")}
          >
            <Icon icon="mdi:arrow-left" />
          </button>
        )}
        <h4 className={cx("panel__header-title")}>
          {view === "main"
            ? "Thông tin đoạn chat"
            : view === "media"
            ? "Ảnh / Video"
            : view === "file"
            ? "File"
            : view === "members"
            ? "Thành viên"
            : "Tin đã ghim"}
        </h4>
      </div>

      {/* MAIN MENU */}
      {view === "main" && (
        <div className={cx("panel__menu")}>
          <button onClick={() => setView("members")}>
            <Icon icon="mdi:account-multiple" /> Thành viên
          </button>
          <button onClick={() => setView("media")}>
            <Icon icon="mdi:image-multiple" /> Ảnh / Video
          </button>
          <button onClick={() => setView("file")}>
            <Icon icon="mdi:file-document-outline" /> File
          </button>
          <button onClick={() => setView("pinned")}>
            <Icon icon="mdi:pin-outline" /> Tin đã ghim
          </button>
        </div>
      )}

      {/* CONTENT */}
      <div className={cx("panel__content")}>
        {view === "media" && (
          <div className={cx("panel__media-list")}>
            {mediaItems.length ? (
              mediaItems.map(renderMediaItem)
            ) : (
              <p className={cx("panel__empty")}>Không có ảnh/video</p>
            )}
          </div>
        )}

        {view === "file" && (
          <div className={cx("panel__file-list")}>
            {fileItems.length ? (
              fileItems.map(renderFileItemRow)
            ) : (
              <p className={cx("panel__empty")}>Không có file</p>
            )}
          </div>
        )}

        {view === "members" && (
          <div className={cx("panel__members-list")}>
            {members.length ? (
              members.map((member) => (
                <div key={member.id} className={cx("member-item")}>
                  {/* <img
                    src={member.avatar_url}
                    alt={member.username || member.email}
                    className={cx("member-item-avatar")}
                  /> */}

                  <img
                    src={member.avatar_url || "/assets/avatar-placeholder.svg"}
                    alt={member.username || member.email}
                    className={cx("member-item-avatar")}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = Avatar;
                    }}
                  />

                  <span className={cx("member-item-name")}>
                    {member.username || member.email}
                  </span>
                </div>
              ))
            ) : (
              <p className={cx("panel__empty")}>Chưa có thành viên</p>
            )}
          </div>
        )}

        {view === "pinned" && (
          <div className={cx("panel__pinned-list")}>
            <p className={cx("panel__empty")}>Chưa có tin nhắn được ghim</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {previewMedia && (
        <ModalMediaViewer
          mediaItems={mediaItems.map((i) => i.media)}
          currentMedia={previewMedia}
          onClose={() => setPreviewMedia(null)}
          onChange={(media) => setPreviewMedia(media)}
        />
      )}
    </aside>
  );
};

export default ChatSidebar;
