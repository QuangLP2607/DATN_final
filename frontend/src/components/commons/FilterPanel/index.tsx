import { useState, useRef, type ReactNode } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import classNames from "classnames/bind";
import styles from "./FilterPanel.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

interface FilterPanelProps {
  title?: string;
  children: ReactNode;
  onClear?: () => void;
  onApply?: () => void;
}

export default function FilterPanel({
  title = "Bộ lọc",
  children,
  onClear,
  onApply,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(panelRef, () => setOpen(false));

  return (
    <div className={cx("filter-panel")} ref={panelRef}>
      {/* Toggle button */}
      <button
        className={cx("filter-panel__toggle")}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon icon="mdi:filter-variant" />
        {title}
      </button>

      {/* Panel content */}
      {open && (
        <div className={cx("filter-panel__content")}>
          {children}
          <hr />
          {(onClear || onApply) && (
            <div className={cx("filter-panel__actions")}>
              {onClear && (
                <button className={cx("btn", "btn--ghost")} onClick={onClear}>
                  Xoá lọc
                </button>
              )}
              {onApply && (
                <button
                  className={cx("btn", "btn--primary")}
                  onClick={() => {
                    onApply();
                    setOpen(false);
                  }}
                >
                  Áp dụng
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
