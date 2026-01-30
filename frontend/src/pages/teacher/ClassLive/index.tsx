import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ClassLive.module.scss";
import Loading from "@/components/ui/Loading";
import Alert, { type AlertData } from "@/components/commons/Alert";
import { useClass } from "@/hooks/useClass";
import { useJitsiRoom } from "@/hooks/useJitsiRoom";
import { PageBackButton } from "@/components/ui/PageBackButton";

const cx = classNames.bind(styles);

export default function ClassLive() {
  const { activeClass } = useClass();
  const navigate = useNavigate();
  const { roomData, leaveRoom } = useJitsiRoom(activeClass?.id);

  const [alert, setAlert] = useState<AlertData | null>(null);

  const handleCloseRoom = () => {
    leaveRoom?.();
    if (activeClass?.id) navigate(`/teaching/class`);
  };

  const clearAlert = () => setAlert(null);

  if (!roomData) return <Loading />;

  return (
    <div className={cx("wrapper")}>
      <PageBackButton onClick={handleCloseRoom} />

      {alert && <Alert alert={alert} clearAlert={clearAlert} />}

      <div className={cx("room-wrapper")}>
        <iframe
          src={`${import.meta.env.VITE_JITSI_BASE_URL}/${roomData.roomId}?jwt=${
            roomData.token
          }`}
          allow="camera; microphone; fullscreen; display-capture"
        />
      </div>
    </div>
  );
}
