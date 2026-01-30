import { useState, useEffect, useRef } from "react";
import jitsiApi, { type JitsiRoomResponse } from "@/services/jitsiService";

export function useJitsiRoom(classId?: string) {
  const [roomData, setRoomData] = useState<JitsiRoomResponse | null>(null);
  const roomRef = useRef<JitsiRoomResponse | null>(null);
  const initializedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  // reset khi đổi class
  useEffect(() => {
    initializedRef.current = false;
    roomRef.current = null;
    setRoomData(null);
  }, [classId]);

  // create / join
  useEffect(() => {
    if (!classId || initializedRef.current) return;

    initializedRef.current = true;

    const init = async () => {
      const res = await jitsiApi.createRoom({
        class_id: classId,
        room_name: "Live Class",
      });

      setRoomData(res);
      roomRef.current = res;
    };

    init();
  }, [classId]);

  // ping + cleanup
  useEffect(() => {
    if (!roomRef.current) return;

    const roomId = roomRef.current.roomId;

    intervalRef.current = window.setInterval(() => {
      jitsiApi.pingRoom(roomId);
    }, 30_000);

    const handleBeforeUnload = () => {
      navigator.sendBeacon(`/live-room/${roomId}/leave`);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      jitsiApi.leaveRoom(roomId).catch(() => {});
    };
  }, [roomData]);

  return {
    roomData,
    leaveRoom: () => {
      if (!roomRef.current) return;
      return jitsiApi.leaveRoom(roomRef.current.roomId);
    },
  };
}
