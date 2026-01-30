import classNames from "classnames/bind";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./StackedBarChart.module.scss";

const cx = classNames.bind(styles);

export interface ClassesTeachersStatusChartProps {
  data: { status: string; classes: number; teachers: number }[];
}

const ClassesTeachersStatusChart = ({
  data,
}: ClassesTeachersStatusChartProps) => {
  return (
    <div className={cx("chart-container")}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="classes" stackId="a" fill="#4f46e5" />
          <Bar dataKey="teachers" stackId="a" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassesTeachersStatusChart;
