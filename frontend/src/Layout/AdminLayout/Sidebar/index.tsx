import logo1 from "@/assets/logo/logo-icon.png";
import logo2 from "@/assets/logo/logo-text.png";
import type { MenuGroup } from "@/components/layout/Sidebar";
import Sidebar from "@/components/layout/Sidebar";

const adminMenu: MenuGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { to: "/dashboard/home", icon: "tabler:home", label: "Trang chủ" },
      { to: "/dashboard/schedule", icon: "tabler:calendar", label: "Lịch dạy" },
      { to: "/dashboard/course", icon: "tabler:book", label: "Khóa học" },
      {
        to: "/dashboard/class",
        icon: "tabler:chalkboard-teacher",
        label: "Lớp học",
      },
    ],
  },
  {
    title: "Người dùng",
    items: [
      { to: "/dashboard/student", icon: "tabler:school", label: "Học viên" },
      {
        to: "/dashboard/teacher",
        icon: "tabler:chalkboard",
        label: "Giảng viên",
      },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <Sidebar menuGroups={adminMenu} logo={{ small: logo1, large: logo2 }} />
  );
}
