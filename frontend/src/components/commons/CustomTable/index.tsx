import React from "react";
import classNames from "classnames";
import styles from "./CustomTable.module.scss";

/* ======================= TYPES ======================= */
export interface Column<T> {
  label: string;
  align?: "left" | "center" | "right";
  width?: number | string;
  wrap?: boolean;

  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}

type RowData<T> = T | T[];

interface Props<T> {
  columns: Column<T>[];
  data: RowData<T>[];
  onRowSelect?: (row: T) => void;
  rowKey?: keyof T;
}

/* ======================= HELPERS ======================= */
const getAlignClass = <T,>(col: Column<T>) => styles[col.align ?? "left"];

/* ======================= COMPONENT ======================= */
export default function CustomTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowSelect,
  rowKey = "id",
}: Props<T>) {
  const flattenedData: T[] = data.flatMap((item) =>
    Array.isArray(item) ? item : [item]
  );

  const totalWeight = columns.reduce(
    (sum, col) => sum + (typeof col.width === "number" ? col.width : 0),
    0
  );

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => {
              const width =
                typeof col.width === "number"
                  ? `${(col.width / totalWeight) * 100}%`
                  : col.width;
              return (
                <th
                  key={index}
                  className={classNames(getAlignClass(col), col.className)}
                  style={{ width }}
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {flattenedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            flattenedData.map((row, rowIndex) => (
              <tr
                key={String(row[rowKey] ?? rowIndex)}
                className={classNames({
                  [styles.clickable]: !!onRowSelect,
                })}
                onClick={() => onRowSelect?.(row)}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={classNames(getAlignClass(col), col.className)}
                    data-label={col.label}
                  >
                    <div
                      className={classNames(styles.cell, {
                        [styles.wrap]: col.wrap,
                      })}
                    >
                      {col.render(row, rowIndex)}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
