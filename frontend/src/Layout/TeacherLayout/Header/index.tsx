import Header from "@/components/layout/Header";
import authApi from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

export default function TeacherHeader() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/login";
  };

  return (
    <Header
      avatarUrl={user?.avatar_url || ""}
      logout={handleLogout}
      menuItems={
        [
          //   { icon: "mdi:account", label: "Profile", href: "/teaching/profile" },
          //   {
          //     icon: "mdi:cog",
          //     label: "Settings",
          //     onClick: () => alert("Settings"),
          //   },
          // ]}
          // notifications={[
          //   { id: 1, title: "Bạn có 1 tin nhắn mới", href: "/messages" },
          //   { id: 2, title: "Hệ thống cập nhật", description: "Phiên bản 2.1" },
        ]
      }
    />
  );
}
