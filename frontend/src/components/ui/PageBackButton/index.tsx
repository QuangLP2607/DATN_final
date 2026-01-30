import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import classNames from "classnames/bind";
import styles from "./PageBackButton.module.scss";

const cx = classNames.bind(styles);

interface PageBackButtonProps {
  onClick?: () => void;
  icon?: string;
  className?: string;
  title?: string;
}

export const PageBackButton = ({
  onClick,
  icon = "akar-icons:arrow-left",
  className,
  title,
}: PageBackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(-1);
  };

  return (
    <div className={cx("backButtonWrapper")}>
      <button
        className={cx("backButton", className)}
        onClick={handleClick}
        type="button"
        aria-label={title || "Go back"}
      >
        <Icon className={cx("backButton__icon")} icon={icon} />
      </button>
      {title && <span className={cx("backButton__title")}>{title}</span>}
    </div>
  );
};
