import classNames from "classnames/bind";
import styles from "./Filters.module.scss";
import FilterPanel from "@/components/commons/FilterPanel";
import { Dropdown } from "@/components/commons/Dropdown";
import { SORT_OPTIONS, type OrderType } from "@/interfaces/common";

const cx = classNames.bind(styles);

interface FiltersProps {
  filters: { order: OrderType };
  onChange: <K extends keyof FiltersProps["filters"]>(
    key: K,
    value: FiltersProps["filters"][K],
  ) => void;
  onClear: () => void;
  onApply: () => void;
}

export default function Filters({
  filters,
  onChange,
  onClear,
  onApply,
}: FiltersProps) {
  return (
    <FilterPanel onClear={onClear} onApply={onApply}>
      <div className={cx("filter-row")}>
        <Dropdown<OrderType>
          value={filters.order}
          label="Sắp xếp"
          options={SORT_OPTIONS}
          onChange={(v) => onChange("order", v)}
        />
      </div>
    </FilterPanel>
  );
}
