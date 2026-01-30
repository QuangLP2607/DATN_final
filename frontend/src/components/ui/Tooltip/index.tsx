import { type ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames/bind";
import styles from "./Tooltip.module.scss";

const cx = classNames.bind(styles);

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function TooltipPortal({
  children,
  text,
  position = "top",
  delay = 300,
}: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const margin = 8;

    let top = 0,
      left = 0;

    switch (position) {
      case "top":
        top = rect.top - margin;
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - margin;
        break;
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + margin;
        break;
    }

    setCoords({ top, left });
  }, [hovered, position]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHovered(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(false);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
    >
      {children}

      {createPortal(
        <div
          className={cx("tooltip-portal", { visible: hovered })}
          data-position={position}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
          }}
        >
          {text}
        </div>,
        document.body
      )}
    </div>
  );
}
