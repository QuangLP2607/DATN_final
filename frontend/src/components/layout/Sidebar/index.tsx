import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { Icon } from "@iconify/react";
import SidebarLogo from "./components/SidebarLogo";
import Item from "./components/SidebarItem";
import Overlay from "@/components/ui/Overlay";

const cx = classNames.bind(styles);

/* ================= TYPES ================= */
export interface DropdownConfig<T> {
  options: readonly T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  getLabel: (option: T) => string;
}

export interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  items?: MenuItem[];
  dropdown?: DropdownConfig<unknown>;
}

export interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

interface SidebarProps {
  menuGroups: MenuGroup[];
  logo?: { small: string; large: string };
}

/* ================= SIDEBAR ================= */
export default function Sidebar({ menuGroups, logo }: SidebarProps) {
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar-collapsed") !== "false";
    } catch {
      return true;
    }
  });

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  const closeSidebar = () => setCollapsed(true);

  return (
    <div className={cx("sidebar-wrapper")}>
      {/* ================= OVERLAY (mobile only) ================= */}
      {isMobile && (
        <Overlay
          className={cx("sidebar-overlay")}
          open={!collapsed}
          onClose={closeSidebar}
        />
      )}

      {/* ================= TOGGLE BUTTON ================= */}
      <button className={cx("sidebar-toggle")} onClick={toggleSidebar}>
        <Icon
          className={cx("sidebar-toggle-icon")}
          icon={
            collapsed ? "line-md:menu-fold-right" : "line-md:menu-fold-left"
          }
        />
      </button>

      {/* ================= SIDEBAR ================= */}
      <aside className={cx("sidebar", { collapsed })}>
        {/* LOGO */}
        <SidebarLogo logo={logo} collapsed={collapsed} />

        {/* MENU */}
        <ul className={cx("sidebar-menu")}>
          {menuGroups.map((group, idx) => {
            const hasTitle = Boolean(group.title);
            return (
              <li key={idx} className={cx("menu-group")}>
                <div className={cx("menu-group__title", { hasTitle })}>
                  <hr />
                  {hasTitle && <span>{group.title}</span>}
                </div>
                <ul className={cx("menu-group__list")}>
                  {group.items.map((item, i) => (
                    <Item
                      key={i}
                      data={item}
                      collapsed={collapsed}
                      path={pathname}
                      onExpand={toggleSidebar}
                    />
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
