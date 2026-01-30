import { Icon } from "@iconify/react";
import styles from "./NotificationMenu.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface NotificationItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

interface Props {
  notifications?: NotificationItem[];
  open: boolean;
  onToggle: () => void;
}

export default function NotificationMenu({
  notifications = [],
  open,
  onToggle,
}: Props) {
  return (
    <div
      className={cx("notification")}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {/* Icon toggle */}
      <div className={cx("notification__trigger")}>
        <Icon className={cx("notification-icon")} icon="iconoir:bell" />
        {notifications.length > 0 && (
          <span className={cx("notification-dot")}>{notifications.length}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className={cx("notification__dropdown")}>
          {notifications.length === 0 ? (
            <div className={cx("notification__dropdown-item")}>
              Không có thông báo
            </div>
          ) : (
            notifications.map((n) => {
              const Comp = n.href ? "a" : "div";
              return (
                <Comp
                  key={n.id}
                  href={n.href}
                  className={cx("notification__dropdown-item")}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={cx("notification__dropdown-title")}>
                    {n.title}
                  </div>
                  {n.description && (
                    <div className={cx("notification__dropdown-desc")}>
                      {n.description}
                    </div>
                  )}
                </Comp>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
