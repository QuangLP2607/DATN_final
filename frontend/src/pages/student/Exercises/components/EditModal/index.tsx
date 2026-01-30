import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./EditModal.module.scss";
import { Icon } from "@iconify/react";

import mediaApi from "@/services/mediaService";
import lectureVideoApi, {
  type LectureWithUrls,
} from "@/services/lectureService";

import Overlay from "@/components/ui/Overlay";

const cx = classNames.bind(styles);

interface Props {
  lecture: LectureWithUrls;
  onClose: () => void;
  onUpdated: (updatedLecture: LectureWithUrls) => void;
  onCancelWithoutThumbnail?: (lecture: LectureWithUrls) => void;
  onError?: (message: string) => void;
}

const EditModal = ({
  lecture,
  onClose,
  onUpdated,
  onCancelWithoutThumbnail,
  onError,
}: Props) => {
  const [name, setName] = useState(lecture.video.file_name);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const previewUrl = thumbnailFile
    ? URL.createObjectURL(thumbnailFile)
    : lecture.thumbnail?.url;

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSaving(true);
    try {
      // 1️⃣ Cập nhật tên video
      const updatedVideo = await mediaApi.update(lecture.video.id, {
        file_name: name.trim(),
      });

      let updatedThumbnail = lecture.thumbnail;

      // 2️⃣ Nếu có file thumbnail mới, upload
      if (thumbnailFile) {
        const newThumbnail = await mediaApi.replaceMedia(
          lecture.thumbnail?.id ?? null,
          thumbnailFile,
          {
            domain_id: lecture.video.id,
            file_type: thumbnailFile.type,
            purpose: "video/thumbnail",
          }
        );

        await lectureVideoApi.update(lecture.id, {
          thumbnail_id: newThumbnail.id,
        });

        updatedThumbnail = newThumbnail;
      }

      // 3️⃣ Trả về lecture đã update
      onUpdated({
        ...lecture,
        video: updatedVideo,
        thumbnail: updatedThumbnail,
      });

      onClose();
    } catch (err: unknown) {
      console.error(err);

      // 4️⃣ Xử lý lỗi để show alert
      let errorMessage = "Cập nhật bài giảng thất bại";

      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }

      onError?.(errorMessage);
      setSaving(false);
    }
  };

  return (
    <Overlay open onClose={onClose} closeOnBackdropClick={false}>
      <div className={cx("modal")}>
        {/* Header */}
        <div className={cx("modal__header")}>
          <h3 className={cx("modal__header-title")}>Chỉnh sửa video</h3>
          <button className={cx("modal__header-close")} onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        {/* Body */}
        <div className={cx("modal__body")}>
          <div className={cx("field")}>
            <label className={cx("field-label")}>Tiêu đề video</label>
            <input
              className={cx("field-input")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tiêu đề video"
            />
          </div>

          {previewUrl && (
            <div className={cx("thumbnail")}>
              <img
                className={cx("thumbnail-image")}
                src={previewUrl}
                alt="preview"
              />
            </div>
          )}

          <div className={cx("field")}>
            <label className={cx("field-label")}>Chọn thumbnail</label>
            <input
              className={cx("field-input")}
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={cx("modal__actions")}>
          <button
            className={cx("action-btn--cancel")}
            onClick={() => {
              if (!thumbnailFile && onCancelWithoutThumbnail) {
                onCancelWithoutThumbnail(lecture);
              }
              onClose();
            }}
          >
            Cancel
          </button>

          <button
            className={cx("action-btn--save")}
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default EditModal;
