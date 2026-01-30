import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import { formatDateVN } from "@/utils/date";
import styles from "./StudentDetail.module.scss";
import type { User } from "@/interfaces/user";
import enrollmentApi, {
  type SearchByStudentResponse,
} from "@/services/enrollmentService";
import userApi from "@/services/userService";
import { PageBackButton } from "@/components/ui/PageBackButton";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const cx = classNames.bind(styles);

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<SearchByStudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const studentRes = await userApi.getById(id);
        setStudent(studentRes);

        const enrollmentsRes = await enrollmentApi.searchByStudent(id);
        setEnrollments(
          Array.isArray(enrollmentsRes) ? enrollmentsRes : [enrollmentsRes]
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (!student)
    return (
      <Empty
        title="Không tìm thấy học viên"
        description="Vui lòng thử lại với từ khóa khác."
        icon="mdi:account-off-outline"
        action={<PageBackButton title="Quay lại" />}
      />
    );

  return (
    <div className={cx("sd")}>
      <PageBackButton title="Thông tin học viên" />

      <div className={cx("sd__profile")}>
        {student.avatar_url && !imgError ? (
          <img
            src={student.avatar_url}
            alt={student.username}
            className={cx("sd__profile-avatar")}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={cx("sd__avatar-fallback")}>
            <Icon icon="si:user-fill" />
          </div>
        )}
        <h2 className={cx("sd__name")}>
          {student.full_name || student.username}
        </h2>
      </div>

      <div className={cx("sd__info")}>
        <ul className={cx("sd__info-list")}>
          <li>
            <strong>Email:</strong> {student.email || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Họ và tên:</strong>
            {student.full_name || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Ngày sinh:</strong>
            {student.dob ? formatDateVN(student.dob) : "Chưa có thông tin"}
          </li>
          <li>
            <strong>Số điện thoại:</strong>
            {student.phone || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Địa chỉ:</strong> {student.address || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Trình độ tiếng Nhật:</strong>
            {student.japaneseLevel || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Ngày tạo:</strong>
            {student.createdAt
              ? formatDateVN(student.createdAt)
              : "Chưa có thông tin"}
          </li>
          <li>
            <strong>Ghi chú:</strong> {student.note || "Chưa có thông tin"}
          </li>
        </ul>
      </div>

      <div className={cx("sd__classes")}>
        <hr className={cx("sd__divider")} />
        <h3 className={cx("sd__classes-title")}>Các lớp đã đăng ký</h3>

        {enrollments.length === 0 ? (
          <p className={cx("sd__classes-none")}>
            Học viên chưa đăng ký khóa học nào
          </p>
        ) : (
          <ul className={cx("sd__classes-list")}>
            {enrollments.map((item) => (
              <li
                key={item.id}
                className={cx("sd__classes-list-item")}
                onClick={() => {
                  if (item.course?.id) {
                    navigate(`/dashboard/course/${item.course.id}`);
                  }
                }}
              >
                <strong className={cx("sd__classes-list-item-name")}>
                  {item.class?.name || "Chưa có tên lớp"}
                </strong>
                <small className={cx("sd__classes-list-item-course")}>
                  Khóa học: {item.course?.code || "-"} -
                  {item.course?.name || "-"}
                </small>
                <span
                  className={cx(
                    "sd__classes-list-item-status",
                    `sd__classes-list-item-status--${
                      item.class?.status?.toLowerCase() || "default"
                    }`
                  )}
                >
                  {item.class?.status || "-"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
