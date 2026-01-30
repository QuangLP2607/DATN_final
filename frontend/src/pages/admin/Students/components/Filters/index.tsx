import classNames from "classnames/bind";
import styles from "./Filters.module.scss";
import FilterPanel from "@/components/commons/FilterPanel";
import { Dropdown } from "@/components/commons/Dropdown";
import type { GetUsersParams } from "@/services/userService";
import { JapaneseLevels, type JapaneseLevel } from "@/interfaces/user";

const cx = classNames.bind(styles);

interface Props {
  filters: GetUsersParams;
  onChange: <K extends keyof GetUsersParams>(
    key: K,
    value: GetUsersParams[K]
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
      {/* -------- japanese level -------- */}
      <div className={cx("filter-row")}>
        <Dropdown<JapaneseLevel | undefined>
          value={filters.japaneseLevel}
          label="Trình độ tiếng Nhật"
          onChange={(v) => onChange("japaneseLevel", v)}
          options={[
            { label: "Tất cả", value: undefined },
            ...JapaneseLevels.map((lv) => ({ label: lv, value: lv })),
          ]}
        />
      </div>
    </FilterPanel>
  );
}
