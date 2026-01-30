import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import { useTheme } from "@/hooks/useTheme";
import styles from "./ThemeSwitch.module.scss";

const cx = classNames.bind(styles);

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={cx("theme-switch", { dark: theme === "dark" })}
      onClick={toggleTheme}
    >
      <span className={cx("icon", "icon-sun")}>
        <Icon icon="material-symbols:light-mode" />
      </span>
      <span className={cx("icon", "icon-moon")}>
        <Icon icon="material-symbols:dark-mode" />
      </span>
      <div className={cx("thumb")} />
    </div>
  );
}
