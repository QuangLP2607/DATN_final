import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./SidebarLogo.module.scss";
const cx = classNames.bind(styles);

interface SidebarLogoProps {
  logo?: { small: string; large: string };
  collapsed?: boolean;
}

export default function SidebarLogo({ logo, collapsed }: SidebarLogoProps) {
  if (!logo) return null;

  return (
    <Link to="/" className={cx("sidebar-logo", { collapsed })}>
      <img src={logo.small} className={cx("sidebar-logo__img", "is-small")} />
      <img src={logo.large} className={cx("sidebar-logo__img", "is-large")} />
    </Link>
  );
}
