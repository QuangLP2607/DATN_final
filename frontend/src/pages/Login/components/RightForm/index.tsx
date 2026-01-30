import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./RightForm.module.scss";
import logoIcon from "@/assets/logo/logo-icon.png";
import logoText from "@/assets/logo/logo-text.png";
import { useAuth } from "@/hooks/useAuth";
import authApi, { type LoginPayload } from "@/services/authService";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

const RightForm = () => {
  const { login: contextLogin } = useAuth();

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** SUBMIT FORM */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await authApi.login(formData);
      await contextLogin(res.accessToken, res.role);
    } catch {
      setErrorMessage("Tài khoản hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("right")}>
      <form className={cx("form")} onSubmit={handleSubmit}>
        {/* LOGO */}
        <div className={cx("form__logo")}>
          <img
            src={logoIcon}
            alt="logo icon"
            className={cx("form__logo-icon")}
          />
          <img
            src={logoText}
            alt="logo text"
            className={cx("form__logo-text")}
          />
        </div>

        <h2 className={cx("form__title")}>Chào mừng đến với JPedu</h2>

        {/* EMAIL */}
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={cx("form__input")}
          placeholder="Email"
          type="email"
          autoComplete="email"
          required
        />

        {/* PASSWORD */}
        <div className={cx("form__password")}>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={cx("form__input")}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className={cx("form__password-toggle")}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
          </button>
        </div>

        <div className={cx("form__forgot")}>Quên mật khẩu?</div>

        {/* ERROR */}
        {errorMessage && <p className={cx("form__error")}>{errorMessage}</p>}

        {/* LOGIN BUTTON */}
        <button className={cx("form__btn")} type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className={cx("form__or")}>or</div>

        <div className={cx("form__google")}>
          <Icon icon="devicon:google" />
          Sign in with Google
        </div>
      </form>
    </div>
  );
};

export default RightForm;
