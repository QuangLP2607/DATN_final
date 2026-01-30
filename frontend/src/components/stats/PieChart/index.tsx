import classNames from "classnames/bind";
import {
  Cell,
  Pie as RechartsPie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import styles from "./PieChart.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_COLORS = [
  "#4f46e5",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#0ea5e9",
  "#14b8a6",
  "#ec4899",
];

export interface PieChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

export type LegendPosition = "right" | "bottom";

interface PieChartProps {
  data: PieChartDataItem[];
  colors?: string[];
  title?: string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLegend?: boolean;
  tooltipFormatter?: (value: number) => string;
  legendFontSize?: number;
  legendPosition?: LegendPosition;
}

function PieChart({
  data,
  colors = DEFAULT_COLORS,
  title = "",
  innerRadius = "50%",
  outerRadius = "80%",
  showLegend = true,
  tooltipFormatter,
  legendFontSize = 14,
  legendPosition = "right",
}: PieChartProps) {
  return (
    <div className={cx("chart-container")}>
      {title && (
        <div className={cx("header")}>
          <h3 className={cx("title")}>{title}</h3>
        </div>
      )}

      {data.length > 0 ? (
        <div
          className={cx("chart")}
          style={{
            flexDirection: legendPosition === "bottom" ? "column" : "row",
          }}
        >
          <div className={cx("pie-wrapper")}>
            {/* Pie sẽ chiếm 100% container cha */}
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    if (midAngle === undefined || percent === undefined)
                      return null;
                    const RADIAN = Math.PI / 180;
                    const radius =
                      (typeof innerRadius === "string"
                        ? (parseFloat(innerRadius) / 100) *
                          (outerRadius as number)
                        : innerRadius) +
                      ((typeof outerRadius === "string"
                        ? (parseFloat(outerRadius) / 100) * 200
                        : outerRadius) -
                        (typeof innerRadius === "string"
                          ? (parseFloat(innerRadius) / 100) *
                            (outerRadius as number)
                          : innerRadius)) /
                        2;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke="none"
                    />
                  ))}
                </RechartsPie>
                <Tooltip
                  formatter={
                    tooltipFormatter ?? ((value: number) => `${value}`)
                  }
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {showLegend && (
            <div
              className={cx("legend")}
              style={{
                flexDirection: legendPosition === "bottom" ? "row" : "column",
                flexWrap: legendPosition === "bottom" ? "wrap" : "nowrap",
                marginTop: legendPosition === "bottom" ? 16 : 0,
                marginLeft: legendPosition === "right" ? 24 : 0,
              }}
            >
              {data.map((entry, index) => (
                <div
                  key={index}
                  className={cx("legend-item")}
                  style={{ fontSize: `${legendFontSize}px` }}
                >
                  <span
                    className={cx("color-box")}
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={cx("empty")}>Không có dữ liệu</div>
      )}
    </div>
  );
}

export default PieChart;
