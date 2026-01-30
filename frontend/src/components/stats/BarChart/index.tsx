import classNames from "classnames/bind";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./BarChart.module.scss";

const cx = classNames.bind(styles);

export interface StudentEnrollmentsChartProps {
  year: number;
  data: { month: number; total: number }[];
}

const StudentEnrollmentsChart = ({
  year,
  data,
}: StudentEnrollmentsChartProps) => {
  return (
    <div className={cx("chart-container")}>
      <h3>Student Enrollments ({year})</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentEnrollmentsChart;
