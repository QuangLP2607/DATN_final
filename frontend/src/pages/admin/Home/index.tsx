import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

import authApi from "@/services/statsService";
import type {
  OverviewResponse,
  StudentEnrollmentResponse,
  StudentLevelStat,
  TeacherStatusStat,
  ClassStatusStat,
} from "@/services/statsService";

import StudentsPerLevelChart from "@/components/stats/PieChart";
import ClassesTeachersStatusChart from "@/components/stats/StackedBarChart";
import StudentEnrollmentsChart from "@/components/stats/BarChart";
import ComboChart from "@/components/stats/ComboChart";

import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const cx = classNames.bind(styles);

const Home = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [enrollment, setEnrollment] =
    useState<StudentEnrollmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ov, en] = await Promise.all([
          authApi.getOverview(),
          authApi.getStudentEnrollments(),
        ]);
        setOverview(ov);
        setEnrollment(en);
        if (en.stats.length > 0)
          setSelectedYear(Math.max(...en.stats.map((s) => s.year)));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  if (!overview || !enrollment)
    return (
      <Empty
        title="Không có dữ liệu"
        description="Hiện tại không có thống kê để hiển thị."
      />
    );

  // ===== Students per Level =====
  const studentsPerLevelData = overview.students.details.map(
    (s: StudentLevelStat) => ({ name: s.level, value: s.total })
  );

  // ===== Classes & Teachers by Status =====
  const stackedData = Array.from(
    new Set([
      ...overview.classes.details.map((c: ClassStatusStat) => c.status),
      ...overview.teachers.details.map((t: TeacherStatusStat) => t.status),
    ])
  ).map((status) => ({
    status,
    classes:
      overview.classes.details.find((c) => c.status === status)?.total || 0,
    teachers:
      overview.teachers.details.find((t) => t.status === status)?.total || 0,
  }));

  // ===== Enrollment Data =====
  const enrollmentData =
    selectedYear !== null
      ? enrollment.stats
          .find((s) => s.year === selectedYear)
          ?.months.map((m) => ({ month: m.month, total: m.total })) || []
      : [];

  return (
    <div className={cx("home")}>
      <h2 className={cx("home__title")}>Dashboard Quản Trị</h2>

      {/* Overview cards */}
      <div className={cx("home__overview")}>
        <div
          className={cx("home__overview-card")}
          onClick={() => navigate("/dashboard/class")}
        >
          <h3>Lớp học</h3>
          <p>{overview.classes.total}</p>
        </div>

        <div
          className={cx("home__overview-card")}
          onClick={() => navigate("/dashboard/course")}
        >
          <h3>Khóa học</h3>
          <p>{overview.courses.total}</p>
        </div>

        <div
          className={cx("home__overview-card")}
          onClick={() => navigate("/dashboard/student")}
        >
          <h3>Học viên</h3>
          <p>{overview.students.total}</p>
        </div>

        <div
          className={cx("home__overview-card")}
          onClick={() => navigate("/dashboard/teachers")}
        >
          <h3>Giảng viên</h3>
          <p>{overview.teachers.total}</p>
        </div>
      </div>

      {/* Charts */}
      <div className={cx("home__charts")}>
        <div className={cx("home__charts-item")}>
          <h3>Số học viên theo trình độ</h3>
          <StudentsPerLevelChart data={studentsPerLevelData} />
        </div>

        <div className={cx("home__charts-item")}>
          <h3>Lớp & Giảng viên theo trạng thái</h3>
          <ClassesTeachersStatusChart data={stackedData} />
        </div>

        <div className={cx("home__charts-item")}>
          <h3>Học viên đăng ký</h3>

          {/* Chọn chế độ hiển thị */}
          <div className={cx("home__charts-view-tabs")}>
            <button
              className={cx({ active: viewMode === "monthly" })}
              onClick={() => setViewMode("monthly")}
            >
              Theo tháng
            </button>
            <button
              className={cx({ active: viewMode === "yearly" })}
              onClick={() => setViewMode("yearly")}
            >
              Theo năm
            </button>
          </div>

          {viewMode === "monthly" && selectedYear !== null && (
            <>
              {/* Year tabs */}
              <div className={cx("home__charts-year-tabs")}>
                {enrollment.stats.map((s) => (
                  <button
                    key={s.year}
                    className={cx("home__charts-year-tab", {
                      active: s.year === selectedYear,
                    })}
                    onClick={() => setSelectedYear(s.year)}
                  >
                    {s.year}
                  </button>
                ))}
              </div>

              {/* Monthly chart */}
              <StudentEnrollmentsChart
                year={selectedYear}
                data={enrollmentData}
              />
            </>
          )}

          {viewMode === "yearly" && <ComboChart stats={enrollment.stats} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
