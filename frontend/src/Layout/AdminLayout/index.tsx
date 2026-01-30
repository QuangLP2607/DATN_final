import type { ReactNode } from "react";
import classNames from "classnames/bind";
import AdminFooter from "./Footer";
import AdminHeader from "./Header";
import AdminSidebar from "./Sidebar";
import styles from "./AdminLayout.module.scss";

const cx = classNames.bind(styles);

interface AdminLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const AdminLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}: AdminLayoutProps) => {
  return (
    <div className={cx("wrapper")}>
      {showSidebar && <AdminSidebar />}

      <div className={cx("wrapper__content")}>
        {showHeader && (
          <div className={cx("wrapper__content--header")}>
            <AdminHeader />
          </div>
        )}

        <main className={cx("wrapper__content--main")}>{children}</main>

        {showFooter && (
          <div className={cx("wrapper__content--footer")}>
            <AdminFooter />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
