import { useState, useEffect, type ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import ConfirmModal from "@/components/commons/ConfirmModal";
import ThemeSwitch from "@/components/commons/ThemeSwitch";
import NotificationMenu from "./components/NotificationMenu";
import UserMenu from "./components/UserMenu";
import UploadProgress from "@/components/ui/UploadProgress";

const cx = classNames.bind(styles);

export interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

export interface HeaderProps {
  menuItems?: MenuItem[];
  avatarUrl?: string | null;
  logout?: () => void;
  notifications?: NotificationItem[];
  extraRight?: ReactNode;
}

export default function Header({
  menuItems = [],
  avatarUrl,
  logout,
  notifications = [],
  extraRight,
}: HeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openMenu, setOpenMenu] = useState<"user" | "notify" | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={cx("header")}>
      <div className={cx("header__left")}>{/* Logo/title */}</div>

      <div className={cx("header__actions")}>
        {extraRight && <div className={cx("header__extra")}>{extraRight}</div>}

        <ThemeSwitch />

        <NotificationMenu
          notifications={notifications}
          open={openMenu === "notify"}
          onToggle={() =>
            setOpenMenu((prev) => (prev === "notify" ? null : "notify"))
          }
        />

        <UserMenu
          avatarUrl={avatarUrl}
          menuItems={menuItems}
          open={openMenu === "user"}
          onToggle={() =>
            setOpenMenu((prev) => (prev === "user" ? null : "user"))
          }
          onLogout={() => setShowLogoutConfirm(true)}
        />
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout?.();
          setShowLogoutConfirm(false);
        }}
      />
      <UploadProgress />
    </div>
  );
}
