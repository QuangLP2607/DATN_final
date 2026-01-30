import { useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Dropdown.module.scss";
import { Icon } from "@iconify/react";
import { useClickOutside } from "@/hooks/useClickOutside";

const cx = classNames.bind(styles);

export interface Option<T> {
  label: string;
  value: T;
}

interface DropdownProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  label?: string;
}

export function Dropdown<T>({
  value,
  onChange,
  options,
  label,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div className={cx("dropdown-wrapper")}>
      {label && <label className={cx("dropdown-label")}>{label}</label>}
      <div className={cx("dropdown")} ref={ref}>
        <div
          className={cx("dropdown__control")}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cx("dropdown__control-value")}>
            {selected?.label ?? "—"}
          </span>
          <span className={cx("dropdown__control-arrow", { open })}>
            <Icon icon="iconamoon:arrow-down-2-bold" />
          </span>
        </div>

        {open && (
          <ul className={cx("dropdown__menu")}>
            {options.map((opt, idx) => (
              <li
                key={idx}
                className={cx("dropdown__item", {
                  selected: opt.value === value,
                })}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
