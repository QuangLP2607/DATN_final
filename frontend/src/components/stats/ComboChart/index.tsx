import classNames from "classnames/bind";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import styles from "./ComboChart.module.scss";

const cx = classNames.bind(styles);

export interface MonthlyData {
  month: number;
  total: number;
}

export interface YearlyEnrollment {
  year: number;
  months: MonthlyData[];
}

// Kiểu cho Recharts data
interface ChartData {
  month: string;
  [year: number]: number; // key là năm, value là tổng mỗi tháng
}

interface ComboChartProps {
  stats: YearlyEnrollment[];
}

const COLORS = [
  "#4f46e5",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#0ea5e9",
];

export default function ComboChart({ stats }: ComboChartProps) {
  if (!stats || stats.length === 0)
    return <div className={cx("empty")}>Không có dữ liệu</div>;

  // ===== Chuẩn hóa dữ liệu cho Recharts =====
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const data: ChartData[] = months.map((m) => {
    const entry: ChartData = { month: `Tháng ${m}` };
    stats.forEach((yearStat) => {
      const monthData = yearStat.months.find((x) => x.month === m);
      entry[yearStat.year] = monthData?.total ?? 0;
    });
    return entry;
  });

  // Tính tổng mỗi năm
  const totals: { year: number; total: number }[] = stats.map((y) => ({
    year: y.year,
    total: y.months.reduce((sum, m) => sum + m.total, 0),
  }));

  return (
    <div className={cx("combo-chart")}>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Bars: mỗi năm một cột */}
          {stats.map((y, index) => (
            <Bar
              key={y.year}
              dataKey={y.year}
              fill={COLORS[index % COLORS.length]}
            />
          ))}

          {/* Line: tổng mỗi năm */}
          <Line
            type="monotone"
            dataKey={(d: ChartData) => {
              // lấy tổng từ totals dựa theo năm
              return totals.reduce((sum, t) => sum + (d[t.year] || 0), 0);
            }}
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
