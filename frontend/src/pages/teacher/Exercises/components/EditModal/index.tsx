import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./EditModal.module.scss";
import quizApi, {
  type UpdateQuizPayload,
  type CreateQuizPayload,
} from "@/services/quizService";
import mediaApi from "@/services/mediaService";
import { Icon } from "@iconify/react";
import Overlay from "@/components/ui/Overlay";
import Empty from "@/components/ui/Empty";
import type { EditableQuiz } from "../../List";

const cx = classNames.bind(styles);

// ================= Types =================
type QuizStatus = "draft" | "published" | "closed";

interface Props {
  quiz: EditableQuiz;
  onClose: () => void;
  onUpdated: () => void;
}

interface QuizForm {
  title: string;
  duration: number;
  status: QuizStatus;
}

// ================= Component =================
const ExerciseEditModal = ({ quiz, onClose, onUpdated }: Props) => {
  const isEdit = Boolean(quiz.id);

  const [form, setForm] = useState<QuizForm>({
    title: "",
    duration: 1,
    status: "draft",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ================= Sync state when quiz changes =================
  useEffect(() => {
    setForm({
      title: quiz.title,
      duration: quiz.duration ?? 1,
      status: quiz.status ?? "draft",
    });

    setPreviewUrl(quiz.thumbnail_url ?? null);
    setThumbnailFile(null);
  }, [quiz]);

  // ================= Handle preview when select file =================
  useEffect(() => {
    if (!thumbnailFile) return;

    const objectUrl = URL.createObjectURL(thumbnailFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

  const handleChange = <K extends keyof QuizForm>(
    field: K,
    value: QuizForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ================= Submit =================
  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    try {
      let quizId = quiz.id;
      let thumbnailId: string | undefined;

      // ================= CREATE mới =================
      if (!isEdit) {
        const payload: CreateQuizPayload = {
          title: form.title.trim(),
          duration: form.duration,
          class_id: quiz.class_id,
        };

        const createdQuiz = await quizApi.create(payload);
        quizId = createdQuiz.id;
      }

      // ================= UPLOAD thumbnail (khi đã có quizId) =================
      if (thumbnailFile && quizId) {
        const media = await mediaApi.uploadMedia(thumbnailFile, {
          domain_id: quizId,
          file_type: thumbnailFile.type,
          purpose: "quiz/thumbnail",
        });

        thumbnailId = media.id;
      }

      // ================= UPDATE (edit hoặc gán thumbnail sau create) =================
      if (isEdit || thumbnailId) {
        const payload: UpdateQuizPayload = {
          title: form.title.trim(),
          duration: form.duration,
          status: form.status,
          ...(thumbnailId && { thumbnail_id: thumbnailId }),
        };

        await quizApi.update(quizId!, payload);
      }

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Save quiz failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ================= Render =================
  return (
    <Overlay open onClose={onClose} closeOnBackdropClick={false}>
      <div className={cx("modal")}>
        <div className={cx("modal__header")}>
          <h3 className={cx("modal__header-title")}>
            {isEdit ? "Chỉnh sửa quiz" : "Tạo quiz mới"}
          </h3>
          <button
            className={cx("modal__header-close")}
            onClick={onClose}
            type="button"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>

        <hr />

        <div className={cx("modal__body")}>
          <label className={cx("field")}>
            <span className={cx("field-label")}>Tiêu đề</span>
            <input
              className={cx("field-input")}
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Nhập tiêu đề quiz"
            />
          </label>

          <div className={cx("thumbnail")}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Thumbnail preview"
                className={cx("thumbnail-image")}
              />
            ) : (
              <Empty icon="mdi:image-outline" />
            )}
          </div>

          <label className={cx("field")}>
            <span className={cx("field-label")}>Thumbnail</span>
            <input
              className={cx("field-input")}
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className={cx("field-row")}>
            <label className={cx("field")}>
              <span className={cx("field-label")}>Thời gian (phút)</span>
              <input
                className={cx("field-input")}
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) =>
                  handleChange("duration", Math.max(1, Number(e.target.value)))
                }
              />
            </label>

            {isEdit && (
              <label className={cx("field")}>
                <span className={cx("field-label")}>Trạng thái</span>
                <select
                  className={cx("field-input")}
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as QuizStatus)
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            )}
          </div>
        </div>

        <div className={cx("modal__actions")}>
          <button
            onClick={onClose}
            className={cx("action-btn--cancel")}
            disabled={saving}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={cx("action-btn--save")}
            disabled={saving || !form.title.trim()}
            type="button"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default ExerciseEditModal;
