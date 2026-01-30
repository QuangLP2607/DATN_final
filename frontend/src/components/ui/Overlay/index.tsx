import type { ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./Overlay.module.scss";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const cx = classNames.bind(styles);

interface OverlayProps {
  open: boolean;
  onClose?: () => void;
  closeOnBackdropClick?: boolean;
  lockScroll?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function Overlay({
  open,
  onClose,
  closeOnBackdropClick = true,
  lockScroll = true,
  children,
  className,
}: OverlayProps) {
  useBodyScrollLock(open && lockScroll);

  if (!open) return null;

  const handleClick = () => {
    if (closeOnBackdropClick) onClose?.();
  };

  return (
    <div className={cx("overlay", className)} onClick={handleClick}>
      {children && <div onClick={(e) => e.stopPropagation()}>{children}</div>}
    </div>
  );
}
