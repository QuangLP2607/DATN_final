import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SearchBar.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onEnter?: () => void;
  className?: string;
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onEnter,
  className,
}: SearchBarProps) {
  const [active, setActive] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onEnter?.();
  };

  const handleIconClick = () => {
    onEnter?.();
  };

  return (
    <div className={cx("search-bar", { active }, className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        placeholder={placeholder}
        className={cx("search-bar__input")}
      />
      <span className={cx("search-bar__icon")} onClick={handleIconClick}>
        <Icon icon="tabler:search" />
      </span>
    </div>
  );
}

export default SearchBar;
