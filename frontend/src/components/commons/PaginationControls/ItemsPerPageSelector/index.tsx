import { useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ItemsPerPageSelector.module.scss";
import { Icon } from "@iconify/react";
import { useClickOutside } from "@/hooks/useClickOutside";

const cx = classNames.bind(styles);

interface Option<T extends number> {
  label: string;
  value: T;
}

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export default function ItemsPerPageSelector({
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20],
  className,
}: ItemsPerPageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [upwards, setUpwards] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: Option<number>[] = itemsPerPageOptions.map((v) => ({
    label: String(v),
    value: v,
  }));

  const selected = options.find((o) => o.value === itemsPerPage);

  useClickOutside(ref, () => setOpen(false));

  const toggleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuHeight = options.length * 36;
      setUpwards(spaceBelow < menuHeight && spaceAbove > spaceBelow);
    }
    setOpen((v) => !v);
  };

  return (
    <div className={cx("dropdown", { up: upwards }, className)} ref={ref}>
      <label className={cx("dropdown__label")}>Hiển thị:</label>

      <button
        type="button"
        className={cx("dropdown__control")}
        onClick={toggleOpen}
      >
        <span className={cx("dropdown__value")}>{selected?.label}</span>

        <span className={cx("dropdown__arrow", { open })}>
          <Icon icon="iconamoon:arrow-down-2-bold" />
        </span>
      </button>

      {open && (
        <ul className={cx("dropdown__menu")}>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={cx("dropdown__item", {
                selected: opt.value === itemsPerPage,
              })}
              onClick={() => {
                onItemsPerPageChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
