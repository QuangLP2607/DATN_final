import logo1 from "@/assets/logo/logo-icon.png";
import logo2 from "@/assets/logo/logo-text.png";
import type { MenuGroup } from "@/components/layout/Sidebar";
import Sidebar from "@/components/layout/Sidebar";

const studentMenu: MenuGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { to: "/home", icon: "tabler:home", label: "Trang chủ" },
      {
        to: "/lectures",
        icon: "tabler:video",
        label: "Bài giảng",
      },
      {
        to: "/exercises",
        icon: "tabler:checkbox",
        label: "Bài tập",
      },
      {
        to: "/chat",
        icon: "tabler:messages",
        label: "Nhóm chat",
      },
    ],
  },
  {
    title: "Cài đặt",
    items: [
      {
        to: "/profile",
        icon: "hugeicons:user-settings-01",
        label: "Tài khoản",
      },
    ],
  },
];

export default function StudentSidebar() {
  return (
    <Sidebar menuGroups={studentMenu} logo={{ small: logo1, large: logo2 }} />
  );
}
