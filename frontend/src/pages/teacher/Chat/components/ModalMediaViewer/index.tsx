import { useCallback, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./ModalMediaViewer.module.scss";
import { Icon } from "@iconify/react";
import type { Media } from "@/interfaces/media";
import mediaApi from "@/services/mediaService";
import Overlay from "@/components/ui/Overlay";

const cx = classNames.bind(styles);

interface ModalMediaViewerProps {
  mediaItems: Media[];
  currentMedia: Media;
  onClose: () => void;
  onChange: (media: Media) => void;
}

export default function ModalMediaViewer({
  mediaItems,
  currentMedia,
  onClose,
  onChange,
}: ModalMediaViewerProps) {
  const currentIndex = useMemo(
    () => mediaItems.findIndex((m) => m.id === currentMedia.id),
    [mediaItems, currentMedia]
  );

  const handleDownload = useCallback(async (media: Media) => {
    const url = await mediaApi.getDownloadUrl(media.id);
    const a = document.createElement("a");
    a.href = url;
    a.download = media.file_name || "download";
    a.click();
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onChange(mediaItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      onChange(mediaItems[currentIndex + 1]);
    }
  };

  // map wheel dọc -> scroll ngang thumbnails
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.currentTarget.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  if (!currentMedia) return null;

  return (
    <Overlay open onClose={onClose} closeOnBackdropClick lockScroll>
      <div className={cx("modal")}>
        {/* HEADER */}
        <div className={cx("header")}>
          <h3 title={currentMedia.file_name}>{currentMedia.file_name}</h3>

          <button className={cx("close-btn")} onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <hr />

        {/* MAIN MEDIA */}
        <div className={cx("modal__media")}>
          {currentMedia.file_type.startsWith("image/") ? (
            <img src={currentMedia.url} alt={currentMedia.file_name} />
          ) : (
            <video src={currentMedia.url} controls autoPlay />
          )}

          {/* PREV */}
          <button
            className={cx("nav-btn", "prev")}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <Icon icon="mdi:chevron-left" />
          </button>

          {/* NEXT */}
          <button
            className={cx("nav-btn", "next")}
            onClick={handleNext}
            disabled={currentIndex === mediaItems.length - 1}
          >
            <Icon icon="mdi:chevron-right" />
          </button>

          {/* DOWNLOAD */}
          <button
            className={cx("modal__media-download")}
            onClick={() => handleDownload(currentMedia)}
          >
            <Icon icon="mdi:download" />
          </button>
        </div>

        <hr />

        {/* THUMBNAILS */}
        <div className={cx("modal-thumbnails")} onWheel={handleWheel}>
          {mediaItems.map((item) => (
            <img
              key={item.id}
              src={item.url}
              className={cx(
                "modal-thumbnail",
                item.id === currentMedia.id && "active"
              )}
              onClick={() => onChange(item)}
            />
          ))}
        </div>
      </div>
    </Overlay>
  );
}
