import classNames from "classnames/bind";
import LeftSlide from "./components/LeftSlide";
import RightForm from "./components/RightForm";
import ThemeSwitch from "@/components/commons/ThemeSwitch";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

const Login = () => {
  return (
    <div className={cx("login")}>
      <div className={cx("login__form")}>
        <div className={cx("login__form-left")}>
          <LeftSlide />
        </div>
        <div className={cx("login__form-right")}>
          <RightForm />
        </div>
      </div>
      <div className={cx("login__theme")}>
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Login;
