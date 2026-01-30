import classNames from "classnames/bind";
import styles from "./Filters.module.scss";
import FilterPanel from "@/components/commons/FilterPanel";
import { Dropdown } from "@/components/commons/Dropdown";
import { QUIZ_STATUS_OPTIONS, type QuizStatus } from "@/interfaces/quiz";

const cx = classNames.bind(styles);

export type QuizStatusWithAll = QuizStatus | "all";

interface FiltersProps {
  filters: { status: QuizStatusWithAll };
  onChange: <K extends keyof FiltersProps["filters"]>(
    key: K,
    value: FiltersProps["filters"][K]
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
        <Dropdown<QuizStatusWithAll>
          value={filters.status}
          label="Status"
          options={QUIZ_STATUS_OPTIONS}
          onChange={(v) => onChange("status", v)}
        />
      </div>
    </FilterPanel>
  );
}
