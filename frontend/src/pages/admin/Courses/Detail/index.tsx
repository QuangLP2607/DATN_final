import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { formatDateVN } from "@/utils/date";
import styles from "./CourseDetail.module.scss";
import courseApi, { type getByIdResponse } from "@/services/courseService";
import { PageBackButton } from "@/components/ui/PageBackButton";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const cx = classNames.bind(styles);

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<getByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await courseApi.getById(id);
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (!data)
    return (
      <Empty
        title="Không tìm thấy khóa học"
        description="Vui lòng thử lại với từ khóa khác."
        icon="mdi:book-off-outline"
        action={<PageBackButton title="Quay lại" />}
      />
    );

  const { course, classes } = data;

  return (
    <div className={cx("cd")}>
      <PageBackButton title={`Khóa học ${course.name}`} />

      {/* Course Info Cards */}
      <div className={cx("cd__cards")}>
        <div className={cx("cd__card")}>
          <div className={cx("cd__card-icon")}>📚</div>
          <div className={cx("cd__card-label")}>Tổng số lớp</div>
          <div className={cx("cd__card-value")}>{course.total_classes}</div>
        </div>

        <div className={cx("cd__card")}>
          <div className={cx("cd__card-icon")}>👥</div>
          <div className={cx("cd__card-label")}>Tổng học viên</div>
          <div className={cx("cd__card-value")}>
            {course.total_students || 0}
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className={cx("cd__info")}>
        <ul className={cx("cd__info-list")}>
          <li>
            <strong>Mã khóa học:</strong> {course.code}
          </li>
          <li>
            <strong>Tên khóa học:</strong> {course.name}
          </li>
          <li>
            <strong>Mô tả:</strong> {course.description || "-"}
          </li>
          <li>
            <strong>Trạng thái:</strong>{" "}
            {course.status === "active" ? "Hoạt động" : "Tạm dừng"}
          </li>
          <li>
            <strong>Ngày tạo:</strong> {formatDateVN(course.createdAt)}
          </li>
          <li>
            <strong>Ngày cập nhật:</strong> {formatDateVN(course.updatedAt)}
          </li>
          <li>
            <strong>Tổng lớp:</strong> {course.total_classes}
          </li>
          <li>
            <strong>Lớp active:</strong> {course.active_classes}
          </li>
        </ul>
      </div>

      {/* Classes */}
      <div className={cx("cd__classes")}>
        <hr className={cx("cd__divider")} />
        <h3 className={cx("cd__classes-title")}>Danh sách lớp</h3>

        {classes.length === 0 ? (
          <p className={cx("cd__classes-none")}>Chưa có lớp nào</p>
        ) : (
          <ul className={cx("cd__classes-list")}>
            {classes.map((cls) => (
              <li
                key={cls.id}
                className={cx("cd__classes-list-item")}
                onClick={() => navigate(`/dashboard/class/${cls.id}`)}
              >
                <strong className={cx("cd__classes-list-item-name")}>
                  {cls.name}
                </strong>
                <small className={cx("cd__classes-list-item-date")}>
                  {formatDateVN(cls.start_date)} - {formatDateVN(cls.end_date)}
                </small>
                <span
                  className={cx(
                    "cd__classes-list-item-status",
                    `cd__classes-list-item-status--${
                      cls.status?.toLowerCase() || "default"
                    }`
                  )}
                >
                  {cls.status || "-"}
                </span>
                {cls.teachers && cls.teachers.length > 0 && (
                  <div className={cx("cd__classes-list-item-teachers")}>
                    Giáo viên: {cls.teachers.map((t) => t.name).join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
