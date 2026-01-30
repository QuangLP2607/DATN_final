import { Icon } from "@iconify/react";
import styles from "./UserMenu.module.scss";
import classNames from "classnames/bind";
import defaultAvatar from "@/assets/commons/avatar-default.svg";

const cx = classNames.bind(styles);

interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  avatarUrl?: string | null;
  menuItems?: MenuItem[];
  open: boolean;
  onToggle: () => void;
  onLogout?: () => void;
}

export default function UserMenu({
  avatarUrl,
  menuItems = [],
  open,
  onToggle,
  onLogout,
}: Props) {
  return (
    <div
      className={cx("avatar")}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <img
        className={cx("avatar-img")}
        src={avatarUrl || defaultAvatar}
        alt="Avatar"
        onError={(e) => {
          e.currentTarget.src = defaultAvatar;
        }}
      />

      {/* Dropdown */}
      {open && (
        <div className={cx("avatar__dropdown")}>
          {menuItems.map((item, idx) => {
            const Comp = item.href ? "a" : "div";
            return (
              <Comp
                key={idx}
                href={item.href}
                className={cx("avatar__dropdown-item")}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  onToggle();
                }}
              >
                <Icon icon={item.icon} /> {item.label}
              </Comp>
            );
          })}

          <div
            className={cx("avatar__dropdown-item")}
            onClick={(e) => {
              e.stopPropagation();
              onLogout?.();
              onToggle();
            }}
          >
            <Icon icon="material-symbols:logout" width={18} height={18} /> Đăng
            xuất
          </div>
        </div>
      )}
    </div>
  );
}
