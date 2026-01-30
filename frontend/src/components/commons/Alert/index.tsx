import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Alert.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export type AlertType = "success" | "error" | "warning";

export interface AlertData {
  title?: string;
  content: string;
  type: AlertType;
  duration?: number;
}

export interface AlertProps {
  alert: AlertData;
  clearAlert: () => void;
}

const iconMap: Record<AlertType, string> = {
  success: "ix:success-filled",
  error: "ix:error-filled",
  warning: "ix:info-filled",
};

export default function Alert({ alert, clearAlert }: AlertProps) {
  const icon = iconMap[alert.type];
  const duration = alert.duration ?? 3000;

  useEffect(() => {
    const timer = setTimeout(clearAlert, duration);
    return () => clearTimeout(timer);
  }, [alert, clearAlert, duration]);

  return (
    <div className={cx("alert", alert.type, "show")}>
      <Icon icon={icon} className={cx("alert-icon")} />
      <div className={cx("alert-wrapper")}>
        {alert.title && <div className={cx("alert-title")}>{alert.title}</div>}
        <span className={cx("alert-content")}>{alert.content}</span>
      </div>
      <button className={cx("close")} onClick={clearAlert}>
        &times;
      </button>
      <div
        className={cx("progress")}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}
