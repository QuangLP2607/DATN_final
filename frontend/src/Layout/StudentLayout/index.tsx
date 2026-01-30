import type { ReactNode } from "react";
import classNames from "classnames/bind";
import { ClassProvider } from "@/contexts/ClassContext";
import StudentFooter from "./Footer";
import StudentHeader from "./Header";
import StudentSidebar from "./Sidebar";
import styles from "./StudentLayout.module.scss";

const cx = classNames.bind(styles);

interface StudentLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const StudentLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}: StudentLayoutProps) => {
  return (
    <ClassProvider>
      <div className={cx("wrapper")}>
        {showSidebar && <StudentSidebar />}

        <div className={cx("wrapper__content")}>
          {showHeader && (
            <div className={cx("wrapper__content--header")}>
              <StudentHeader />
            </div>
          )}

          <main className={cx("wrapper__content--main")}>{children}</main>

          {showFooter && (
            <div className={cx("wrapper__content--footer")}>
              <StudentFooter />
            </div>
          )}
        </div>
      </div>
    </ClassProvider>
  );
};

export default StudentLayout;
