import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";

import type { QuizWithThumbnailUrl } from "@/services/quizService";
import type { LectureWithUrls } from "@/services/lectureService";

import { useClass } from "@/hooks/useClass";
import quizApi from "@/services/quizService";
import lectureApi from "@/services/lectureService";
import jitsiApi from "@/services/jitsiService";

import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { formatDate } from "@/utils/date";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

/* ================= Utils ================= */

const FALLBACK_COLORS = [
  "#4A90E2",
  "#50E3C2",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FFA500",
  "#FF7043",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#90A4AE",
];

const getFallbackColor = (index: number) =>
  FALLBACK_COLORS[index % FALLBACK_COLORS.length];

const getInitials = (title: string) => {
  const words = title.trim().split(" ");
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return "0h00’";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${String(m).padStart(2, "0")}’`;
};

/* ================= Component ================= */

export default function ClassHome() {
  const { activeClass } = useClass();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<QuizWithThumbnailUrl[]>([]);
  const [lectures, setLectures] = useState<LectureWithUrls[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLive, setIsLive] = useState(false);
  const [liveRoomId, setLiveRoomId] = useState<string | null>(null);
  const [checkingLive, setCheckingLive] = useState(true);

  useEffect(() => {
    if (!activeClass?.id) return;

    const fetchData = async () => {
      setLoading(true);
      setCheckingLive(true);

      try {
        const [quizRes, lectureRes, liveRes] = await Promise.all([
          quizApi.search({
            search: "",
            page: 1,
            limit: 5,
            sortBy: "startDate",
            order: "desc",
            status: "published",
          }),
          lectureApi.getByClass(activeClass.id, {
            search: "",
            page: 1,
            limit: 5,
            sortBy: "createdAt",
            order: "desc",
          }),
          jitsiApi.getClassLiveStatus(activeClass.id),
        ]);

        setQuizzes(quizRes.quizzes ?? []);
        setLectures(lectureRes.lectures ?? []);

        setIsLive(liveRes.isLive);
        setLiveRoomId(liveRes.isLive ? (liveRes.roomId ?? null) : null);
      } catch (error) {
        console.error("Error fetching class home data:", error);
      } finally {
        setLoading(false);
        setCheckingLive(false);
      }
    };

    fetchData();
  }, [activeClass?.id]);

  if (!activeClass) return <div>Không có lớp được chọn.</div>;
  if (loading) return <Loading />;

  return (
    <div className={cx("class-detail")}>
      {/* ================= Header ================= */}
      <header className={cx("header")}>
        <h1>{activeClass.name}</h1>
      </header>

      {/* ================= Live Action ================= */}
      {!checkingLive && isLive && liveRoomId && (
        <section className={cx("actions")}>
          <button
            className={cx("start-class-button", "live")}
            onClick={() => navigate(`/live/${liveRoomId}`)}
          >
            <Icon icon="mdi:play-circle" />
            Tham gia buổi học đang diễn ra
          </button>

          <span className={cx("live-badge")}>
            <Icon icon="mdi:circle" className={cx("live-badge__icon")} /> Đang
            trực tiếp
          </span>
        </section>
      )}

      {/* ================= Lectures ================= */}
      <section className={cx("section")}>
        <div className={cx("section-header")}>
          <h3>Bài giảng gần đây</h3>
          <button
            className={cx("link-btn")}
            onClick={() => navigate("/lectures")}
          >
            Xem tất cả →
          </button>
        </div>

        {!lectures.length ? (
          <p className={cx("muted")}>Chưa có bài giảng</p>
        ) : (
          <div className={cx("exercises__content")}>
            {lectures.map((lec) => (
              <div
                key={lec.id}
                className={cx("lecture-card")}
                onClick={() => navigate(`/lectures/${lec.video.id}`)}
              >
                <div className={cx("thumb")}>
                  {lec.thumbnail?.url ? (
                    <img
                      className={cx("thumb-img")}
                      src={lec.thumbnail.url}
                      alt={lec.video.file_name}
                    />
                  ) : (
                    <Empty icon="mdi:video-outline" />
                  )}

                  <div className={cx("thumb-overlay")}>
                    <span className={cx("thumb-overlay__bg")} />
                    <span className={cx("thumb-overlay__icon")}>
                      <Icon icon="gridicons:play" />
                    </span>
                  </div>
                </div>

                <div className={cx("info")}>
                  <p className={cx("name")}>{lec.video.file_name}</p>
                  <span className={cx("date")}>
                    {lec.createdAt ? formatDate(lec.createdAt) : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= Quizzes ================= */}
      <section className={cx("section")}>
        <div className={cx("section-header")}>
          <h3>Bài tập gần đây</h3>
          <button
            className={cx("link-btn")}
            onClick={() => navigate("/exercises")}
          >
            Xem tất cả →
          </button>
        </div>

        {!quizzes.length ? (
          <p className={cx("muted")}>Chưa có bài tập</p>
        ) : (
          <div className={cx("exercises__content")}>
            {quizzes.map((quiz, i) => (
              <div
                key={quiz.id}
                className={cx("quiz-card")}
                onClick={() => navigate(`/exercises/${quiz.id}`)}
              >
                <div className={cx("thumb")}>
                  {quiz.thumbnail_url ? (
                    <img src={quiz.thumbnail_url} className={cx("thumb-img")} />
                  ) : (
                    <div
                      className={cx("thumb-fallback")}
                      style={{ background: getFallbackColor(i) }}
                    >
                      <span className={cx("thumb-text")}>
                        {getInitials(quiz.title)}
                      </span>
                    </div>
                  )}
                </div>

                <div className={cx("info")}>
                  <h3 className={cx("title")}>{quiz.title}</h3>

                  <div className={cx("meta")}>
                    <span className={cx("meta-item")}>
                      <Icon icon="hugeicons:clock-01" />
                      {formatDuration(quiz.duration)}
                    </span>

                    <span className={cx("meta-item")}>
                      <Icon icon="hugeicons:task-done-01" />
                      {quiz.totalScore ?? 0} câu
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
