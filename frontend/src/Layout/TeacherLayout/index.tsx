import type { ReactNode } from "react";
import classNames from "classnames/bind";
import { ClassProvider } from "@/contexts/ClassContext";
import TeacherFooter from "./Footer";
import TeacherHeader from "./Header";
import TeacherSidebar from "./Sidebar";
import styles from "./TeacherLayout.module.scss";

const cx = classNames.bind(styles);

interface TeacherLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const TeacherLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}: TeacherLayoutProps) => {
  return (
    <ClassProvider>
      <div className={cx("wrapper")}>
        {showSidebar && <TeacherSidebar />}

        <div className={cx("wrapper__content")}>
          {showHeader && (
            <div className={cx("wrapper__content--header")}>
              <TeacherHeader />
            </div>
          )}

          <main className={cx("wrapper__content--main")}>{children}</main>

          {showFooter && (
            <div className={cx("wrapper__content--footer")}>
              <TeacherFooter />
            </div>
          )}
        </div>
      </div>
    </ClassProvider>
  );
};

export default TeacherLayout;
