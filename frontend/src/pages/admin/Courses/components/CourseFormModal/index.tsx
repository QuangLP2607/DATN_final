import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Overlay from "@/components/ui/Overlay";
import courseApi, {
  type CreateCoursePayload,
  type UpdateCoursePayload,
} from "@/services/courseService";
import type { SearchCourseResponse } from "@/services/courseService";
import { type AlertData } from "@/components/commons/Alert";
import styles from "./CourseFormModal.module.scss";

const cx = classNames.bind(styles);

interface Props {
  open: boolean;
  course?: SearchCourseResponse;
  onClose: () => void;
  onSuccess?: () => void;
  setAlert: (alert: AlertData) => void;
}

type FormType = CreateCoursePayload | UpdateCoursePayload;

type FormState = Required<FormType>;

export default function CourseFormModal({
  open,
  course,
  onClose,
  onSuccess,
  setAlert,
}: Props) {
  const [form, setForm] = useState<FormState>({
    code: "",
    name: "",

    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (course) {
      setForm({
        code: course.code,
        name: course.name,
        status: course.status,
      });
    } else {
      setForm({ code: "", name: "", status: "active" });
    }
  }, [course, open]);

  // VALIDATION
  const validate = (): boolean => {
    if (!form.code.trim() || form.code.trim().length < 1) {
      setAlert({
        type: "error",
        title: "Lỗi dữ liệu",
        content: "Mã khóa học phải ít nhất 1 ký tự",
        duration: 5000,
      });
      return false;
    }
    if (!form.name.trim() || form.name.trim().length < 3) {
      setAlert({
        type: "error",
        title: "Lỗi dữ liệu",
        content: "Tên khóa học phải ít nhất 3 ký tự",
        duration: 5000,
      });
      return false;
    }
    const activeClasses = course?.active_classes ?? 0;
    if (form.status === "inactive" && activeClasses > 0) {
      setAlert({
        type: "error",
        title: "Không thể tạm dừng",
        content: "Không thể tạm dừng khi còn lớp đang dạy",
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (course) {
        await courseApi.update(course.id, form as UpdateCoursePayload);
        setAlert({
          type: "success",
          title: "Cập nhật thành công",
          content: "Khóa học đã được cập nhật",
        });
      } else {
        await courseApi.create(form as CreateCoursePayload);
        setAlert({
          type: "success",
          title: "Tạo thành công",
          content: "Khóa học mới đã được tạo",
        });
      }
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      let message = "Đã có lỗi xảy ra";
      if (error instanceof Error) message = error.message;
      setAlert({
        type: "error",
        title: "Lỗi hệ thống",
        content: message,
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay open={open} onClose={onClose} closeOnBackdropClick={false}>
      <div className={cx("modal")}>
        {/* HEADER */}
        <div className={cx("modal__header")}>
          <h3>{course ? "Chỉnh sửa khóa học" : "Thêm khóa học"}</h3>
          <button onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className={cx("modal__body")}>
          <div className={cx("field")}>
            <label>Mã khóa học</label>
            <input
              value={form.code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value }))
              }
            />
          </div>

          <div className={cx("field")}>
            <label>Tên khóa học</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className={cx("field")}>
            <label>Trạng thái</label>
            <div className={cx("radio-group")}>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={form.status === "active"}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, status: "active" }))
                  }
                />
                Hoạt động
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={form.status === "inactive"}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, status: "inactive" }))
                  }
                />
                Tạm dừng
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={cx("modal__footer")}>
          <button onClick={onClose} disabled={submitting}>
            Hủy
          </button>
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Đang xử lý..." : course ? "Lưu" : "Tạo"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
