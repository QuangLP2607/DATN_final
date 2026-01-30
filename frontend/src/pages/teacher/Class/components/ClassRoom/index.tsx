import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ClassRoom.module.scss";
import jitsiApi from "@/services/jitsiService";

const cx = classNames.bind(styles);

interface Props {
  roomName: string;
  onClose: () => void;
  autoJoin?: boolean;
}

export default function ClassRoom({ roomName, onClose, autoJoin }: Props) {
  const [roomData, setRoomData] = useState<{
    roomId: string;
    token: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomName) return;

    const loadRoom = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = autoJoin
          ? await jitsiApi.joinRoom({ roomId: roomName })
          : await jitsiApi.createRoom({ name: roomName });
        setRoomData(res);
      } catch (err) {
        console.error(err);
        setError("Không thể vào phòng học.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomName, autoJoin]);

  return (
    <div className={cx("roomWrapper")}>
      <button className={cx("backButton")} onClick={onClose}>
        ← Quay lại
      </button>

      {loading && <div className={cx("loading")}>Đang tải phòng...</div>}
      {error && <div className={cx("error")}>{error}</div>}

      {roomData && !loading && !error && (
        <iframe
          src={`${import.meta.env.VITE_JITSI_BASE_URL}/${roomData.roomId}?jwt=${
            roomData.token
          }`}
          allow="camera; microphone; fullscreen; display-capture"
          width="100%"
          height="100%"
          style={{ border: 0 }}
        />
      )}
    </div>
  );
}
