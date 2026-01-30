import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import styles from "./TeacherDetail.module.scss";
import type { User } from "@/interfaces/user";
import type { SearchByTeacherResponse } from "@/services/enrollmentService";
import enrollmentApi from "@/services/enrollmentService";
import userApi from "@/services/userService";
import { PageBackButton } from "@/components/ui/PageBackButton";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const cx = classNames.bind(styles);

export default function TeacherDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<SearchByTeacherResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const teacherRes = await userApi.getById(id);
        setTeacher(teacherRes);

        const enrollmentsRes = await enrollmentApi.searchByTeacher(id);
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
  if (!teacher)
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
        {teacher.avatar_url && !imgError ? (
          <img
            src={teacher.avatar_url}
            alt={teacher.username}
            className={cx("sd__profile-avatar")}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={cx("sd__avatar-fallback")}>
            <Icon icon="si:user-fill" />
          </div>
        )}
        <h2 className={cx("sd__name")}>
          {teacher.full_name || teacher.username}
        </h2>
      </div>

      <div className={cx("sd__info")}>
        <ul className={cx("sd__info-list")}>
          <li>
            <strong>Email:</strong> {teacher.email || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Họ và tên:</strong>
            {teacher.full_name || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Ngày sinh:</strong>
            {teacher.dob
              ? new Date(teacher.dob).toLocaleDateString("vi-VN")
              : "Chưa có thông tin"}
          </li>
          <li>
            <strong>Số điện thoại:</strong>
            {teacher.phone || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Địa chỉ:</strong> {teacher.address || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Trình độ tiếng Nhật:</strong>
            {teacher.japaneseLevel || "Chưa có thông tin"}
          </li>
          <li>
            <strong>Ngày tạo:</strong>
            {teacher.createdAt
              ? new Date(teacher.createdAt).toLocaleDateString("vi-VN")
              : "Chưa có thông tin"}
          </li>
          <li>
            <strong>Ghi chú:</strong> {teacher.note || "Chưa có thông tin"}
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
