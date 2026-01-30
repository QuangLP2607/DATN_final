import classNames from "classnames/bind";
import styles from "./Footer.module.scss";

import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export interface FooterProps {
  text?: string;
}

const Footer = ({ text }: FooterProps) => {
  return (
    <footer className={cx("footer")}>
      <div className={cx("footer__content")}>
        <Icon icon="solar:book-bold-duotone" className={cx("footer__icon")} />
        <span className={cx("footer__text")}>{text ?? "© 2025 JPedu"}</span>
      </div>
    </footer>
  );
};

export default Footer;
