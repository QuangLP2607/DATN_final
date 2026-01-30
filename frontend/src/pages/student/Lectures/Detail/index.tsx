import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import type { Media } from "@/interfaces/media";
import mediaApi from "@/services/mediaService";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Alert, { type AlertData } from "@/components/commons/Alert";
import { PageBackButton } from "@/components/ui/PageBackButton";
import { formatDate } from "@/utils/date";
import styles from "./LectureDetail.module.scss";

const cx = classNames.bind(styles);

export default function LectureDetail() {
  const { id } = useParams<{ id: string }>();

  const [video, setVideo] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const video = await mediaApi.getViewUrl(id);
        setVideo(video);
      } catch {
        setAlert({
          type: "error",
          title: "Lỗi",
          content: "Không thể tải video",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <Loading />;

  if (!video?.url)
    return (
      <div className={cx("wrapper")}>
        <PageBackButton />
        <Empty
          icon="mdi:video-off-outline"
          title="Không có video"
          description="Video không tồn tại hoặc đã bị xóa"
        />
        {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
      </div>
    );

  return (
    <div className={cx("wrapper")}>
      <PageBackButton />

      <div className={cx("video-wrapper")}>
        <video
          className={cx("video")}
          src={video.url}
          controls
          autoPlay
          onLoadedMetadata={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        />
        <div className={cx("video-info")}>
          <p className={cx("video-info__title")}>{video.file_name}</p>
          <p className={cx("video-info__time")}>
            {formatDate(video.createdAt)}
          </p>
        </div>
      </div>

      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
    </div>
  );
}
