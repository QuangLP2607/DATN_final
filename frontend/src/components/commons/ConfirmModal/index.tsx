import classNames from "classnames/bind";
import styles from "./ConfirmModal.module.scss";
import Overlay from "@/components/ui/Overlay";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  cancelVariant?: "primary" | "secondary" | "default" | "danger" | "success";
  confirmVariant?: "primary" | "secondary" | "default" | "danger" | "success";
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  cancelVariant = "default",
  confirmVariant = "danger",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <Overlay open={open} onClose={onCancel} closeOnBackdropClick={false}>
      <div className={cx("modal")}>
        {/* Header */}
        <div className={cx("header")}>
          <h3>{title}</h3>
          <button className={cx("close-btn")} onClick={onCancel}>
            <Icon icon="mdi:close" width={20} height={20} />
          </button>
        </div>
        <hr />
        {/* Message */}
        {message && <p className={cx("message")}>{message}</p>}

        {/* Footer actions */}
        <div className={cx("actions")}>
          <button className={cx("btn", cancelVariant)} onClick={onCancel}>
            {cancelText}
          </button>
          <button className={cx("btn", confirmVariant)} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
