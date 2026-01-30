import type { ReactNode } from "react";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import styles from "./Empty.module.scss";

const cx = classNames.bind(styles);

interface EmptyProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function Empty({
  icon = "mdi:inbox-outline",
  title,
  description,
  action,
  className,
}: EmptyProps) {
  return (
    <div className={cx("empty", className)}>
      <Icon icon={icon} className={cx("icon")} />

      <h3 className={cx("title")}>{title}</h3>

      {description && <p className={cx("description")}>{description}</p>}

      {action && <div className={cx("action")}>{action}</div>}
    </div>
  );
}
