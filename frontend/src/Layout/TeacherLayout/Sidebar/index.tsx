import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar, {
  type MenuGroup,
  type DropdownConfig,
} from "@/components/layout/Sidebar";
import { useClass } from "@/hooks/useClass";
import { type Class } from "@/interfaces/class";
import logo1 from "@/assets/logo/logo-icon.png";
import logo2 from "@/assets/logo/logo-text.png";

export default function TeacherSidebar() {
  const navigate = useNavigate();
  const { classes, activeClass, setActiveClass } = useClass();

  const classDropdown: DropdownConfig<Class> = useMemo(
    () => ({
      options: classes,
      selectedIndex: activeClass
        ? classes.findIndex((c) => c.id === activeClass.id)
        : 0,
      onSelect: (index) => {
        const selected = classes[index];
        if (!selected) return;
        if (activeClass?.id !== selected.id) setActiveClass(selected);
        navigate("/teaching/class");
      },
      getLabel: (cls) => cls.name,
    }),
    [classes, activeClass, setActiveClass, navigate]
  );

  const teacherMenu: MenuGroup[] = [
    {
      title: "Tổng quan",
      items: [
        { label: "Trang chủ", icon: "tabler:home", to: "/teaching/home" },
        {
          label: "Lịch dạy",
          icon: "tabler:calendar",
          to: "/teaching/schedule",
        },
      ],
    },
    {
      title: "Khóa học",
      items: [
        {
          label: "Khóa học",
          icon: "tabler:book",
          to: "/teaching/class",
          dropdown: classDropdown as DropdownConfig<unknown>,
          items: [
            {
              label: "Bài giảng",
              icon: "tabler:video",
              to: "/teaching/class/lectures",
            },
            {
              label: "Bài tập",
              icon: "tabler:checkbox",
              to: "/teaching/class/exercises",
            },
            {
              label: "Nhóm chat",
              icon: "tabler:messages",
              to: "/teaching/class/chat",
            },
          ],
        },
      ],
    },
    {
      title: "Cài đặt",
      items: [
        {
          label: "Tài khoản",
          icon: "hugeicons:user-settings-01",
          to: "/teaching/profile",
        },
      ],
    },
  ];

  return (
    <Sidebar menuGroups={teacherMenu} logo={{ small: logo1, large: logo2 }} />
  );
}
