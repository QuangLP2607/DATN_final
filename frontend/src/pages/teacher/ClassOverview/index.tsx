// import { useState } from "react";
// import jitsiApi from "@/services/jitsiService";
// import classNames from "classnames/bind";
// import styles from "./ClassOverview.module.scss";

// const cx = classNames.bind(styles);

// const ClassOverview = () => {
//   const [roomData, setRoomData] = useState<{
//     roomId: string;
//     token: string;
//   } | null>(null);
//   const [showRoom, setShowRoom] = useState(false);

//   const createRoom = async () => {
//     try {
//       const res = await jitsiApi.createRoom({ name: "phong_hoc" });
//       setRoomData(res);
//       setShowRoom(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const closeRoom = () => {
//     setShowRoom(false);
//   };

//   return (
//     <div className={cx("overview")}>
//       {!showRoom && (
//         <button className={cx("start-call")} onClick={createRoom}>
//           Bắt đầu buổi học
//         </button>
//       )}

//       {showRoom && roomData && (
//         <div className={cx("roomWrapper")}>
//           <button className={cx("backButton")} onClick={closeRoom}>
//             ← Quay lại
//           </button>

//           {!roomData.roomId ? (
//             <div className={cx("loading")}>Đang tạo phòng...</div>
//           ) : (
//             <iframe
//               src={`https://elearningjpn.duckdns.org/${roomData.roomId}?jwt=${roomData.token}`}
//               allow="camera; microphone; fullscreen; display-capture"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassOverview;
