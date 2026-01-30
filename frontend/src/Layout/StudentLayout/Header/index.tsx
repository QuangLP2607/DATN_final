import Header from "@/components/layout/Header";
import { Dropdown } from "@/components/commons/Dropdown";
import authApi from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useClass } from "@/hooks/useClass";

export default function StudentHeader() {
  const { user } = useAuth();
  const { classes, activeClass, setActiveClass } = useClass();

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/login";
  };

  const classOptions = classes.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <Header
      avatarUrl={user?.avatar_url || ""}
      logout={handleLogout}
      menuItems={
        [
          //   { icon: "mdi:account", label: "Profile", href: "/profile" },
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
      // Thêm slot dropdown lớp
      extraRight={
        classes.length > 0 ? (
          <Dropdown
            value={activeClass?.id || ""}
            options={classOptions}
            onChange={(val) => {
              const selectedClass = classes.find((c) => c.id === val);
              if (selectedClass) setActiveClass(selectedClass);
            }}
            // placeholder="Chọn lớp"
          />
        ) : null
      }
    />
  );
}
