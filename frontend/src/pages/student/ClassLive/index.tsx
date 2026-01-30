import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ClassLive.module.scss";

import Loading from "@/components/ui/Loading";
import Alert, { type AlertData } from "@/components/commons/Alert";
import { PageBackButton } from "@/components/ui/PageBackButton";
import jitsiApi, { type JitsiRoomResponse } from "@/services/jitsiService";

const cx = classNames.bind(styles);

export default function ClassLive() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState<JitsiRoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertData | null>(null);

  /* ================= Join room ================= */
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setAlert({
        type: "error",
        title: "Thiếu thông tin phòng học",
        content: "Room ID không hợp lệ.",
      });
      return;
    }

    (async () => {
      try {
        const data = await jitsiApi.joinRoom(id);
        setRoomData(data);
      } catch {
        setAlert({
          type: "warning",
          title: "Không thể vào phòng học",
          content: "Phòng học không tồn tại hoặc đã kết thúc.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= Leave room on tab close / reload ================= */
  useEffect(() => {
    if (!roomData?.roomId) return;

    const handleBeforeUnload = () => {
      // fire-and-forget (beforeunload không await được)
      jitsiApi.leaveRoom(roomData.roomId).catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomData]);

  /* ================= Leave room on component unmount ================= */
  useEffect(() => {
    return () => {
      if (roomData?.roomId) {
        jitsiApi.leaveRoom(roomData.roomId).catch(() => {});
      }
    };
  }, [roomData]);

  /* ================= Manual leave (Back button) ================= */
  const handleCloseRoom = async () => {
    if (roomData?.roomId) {
      try {
        await jitsiApi.leaveRoom(roomData.roomId);
      } catch {
        // ignore
      }
    }
    navigate("/");
  };

  /* ================= Render ================= */
  if (loading) return <Loading />;

  if (!roomData)
    return (
      <div className={cx("wrapper")}>
        <PageBackButton onClick={() => navigate("/")} />
        {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
      </div>
    );

  return (
    <div className={cx("wrapper")}>
      <PageBackButton onClick={handleCloseRoom} />

      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}

      <div className={cx("room-wrapper")}>
        <iframe
          src={`${import.meta.env.VITE_JITSI_BASE_URL}/${roomData.roomId}?jwt=${roomData.token}`}
          allow="camera; microphone; fullscreen; display-capture"
        />
      </div>
    </div>
  );
}
