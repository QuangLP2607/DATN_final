import classNames from "classnames/bind";
import styles from "./Filters.module.scss";
import FilterPanel from "@/components/commons/FilterPanel";
import { Dropdown } from "@/components/commons/Dropdown";
import type { SearchClassesParams } from "@/services/classService";
import { ClassStatusList, type ClassStatus } from "@/interfaces/class";

const cx = classNames.bind(styles);

interface Props {
  filters: SearchClassesParams;
  onChange: <K extends keyof SearchClassesParams>(
    key: K,
    value: SearchClassesParams[K]
  ) => void;
  onClear: () => void;
  onApply: () => void;
}

export default function Filters({
  filters,
  onChange,
  onClear,
  onApply,
}: Props) {
  return (
    <FilterPanel onClear={onClear} onApply={onApply}>
      {/* -------- status filter -------- */}
      <div className={cx("filter-row")}>
        <Dropdown<ClassStatus | undefined>
          value={filters.status}
          label="Trạng thái"
          onChange={(v) => onChange("status", v)}
          options={[
            { label: "Tất cả", value: undefined },
            ...ClassStatusList.map((lv) => ({ label: lv, value: lv })),
          ]}
        />
      </div>
    </FilterPanel>
  );
}
