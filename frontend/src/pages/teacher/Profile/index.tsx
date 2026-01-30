import { useEffect, useState, type ChangeEvent } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import type { User } from "@/interfaces/user";
import userApi from "@/services/userService";
import mediaApi from "@/services/mediaService";
import { useAuth } from "@/hooks/useAuth";
import DatePicker from "react-datepicker";
import Alert, {
  type AlertData,
  type AlertType,
} from "@/components/commons/Alert";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { Icon } from "@iconify/react";
import { formatDateVN } from "@/utils/date";
import { isPhoneValid } from "@/utils/phone";
import defaultAvatar from "@/assets/commons/avatar-default.svg";

import "react-datepicker/dist/react-datepicker.css";

const cx = classNames.bind(styles);

/* ======================= TYPES ======================= */

type ProfileField = keyof Pick<
  User,
  "username" | "email" | "full_name" | "phone" | "dob" | "address"
>;

type DateFieldKey = "dob";
type TextFieldKey = Exclude<ProfileField, DateFieldKey>;

type BaseField<K extends ProfileField> = {
  key: K;
  label: string;
  editable: boolean;
};

type TextField = BaseField<TextFieldKey> & { type?: "text" };
type DateField = BaseField<DateFieldKey> & { type: "date" };

type FieldConfig = TextField | DateField;

/* ======================= CONFIG ======================= */

const PROFILE_FIELDS = [
  { key: "username", label: "Tên tài khoản", editable: true },
  { key: "email", label: "Email", editable: false },
  { key: "full_name", label: "Họ và tên", editable: true },
  { key: "phone", label: "Số điện thoại", editable: true },
  { key: "dob", label: "Ngày sinh", editable: true, type: "date" },
  { key: "address", label: "Địa chỉ", editable: true },
] as const satisfies readonly FieldConfig[];

/* ======================= COMPONENT ======================= */

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<ProfileField | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  /* ======================= HELPERS ======================= */

  const showAlert = (
    title: string | undefined,
    content: string,
    type: AlertType = "success",
    duration = 3000,
  ) => {
    setAlert(null);
    setTimeout(() => setAlert({ title, content, type, duration }), 10);
  };

  /* ======================= EFFECTS ======================= */

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refreshUser();
      } catch {
        showAlert(
          "Lỗi tải dữ liệu",
          "Không thể tải thông tin cá nhân",
          "error",
          5000,
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  /* ======================= HANDLERS ======================= */

  const startEditing = (field: ProfileField) => {
    if (!user) return;

    const value = user[field];
    setEditingField(field);

    if (field === "dob" && value) {
      setFieldValue(new Date(value).toISOString());
    } else {
      setFieldValue(String(value ?? ""));
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFieldValue("");
  };

  const saveField = async <K extends ProfileField>(field: K) => {
    if (!user) return;

    const fieldConfig = PROFILE_FIELDS.find((f) => f.key === field);
    const fieldLabel = fieldConfig?.label ?? field;

    if (field === "phone" && !isPhoneValid(fieldValue)) {
      showAlert("Lỗi dữ liệu", "Số điện thoại không hợp lệ", "error", 5000);
      return;
    }

    try {
      setUpdating(true);

      let value: User[K];

      if (field === "dob") {
        value = (
          fieldValue ? new Date(fieldValue).toISOString().split("T")[0] : null
        ) as User[K];
      } else {
        value = fieldValue as User[K];
      }

      await userApi.updateProfile({ [field]: value } as Pick<User, K>);
      await refreshUser();

      cancelEditing();
      showAlert("Thành công", `Cập nhật ${fieldLabel} thành công`);
    } catch {
      showAlert("Thất bại", `Cập nhật ${fieldLabel} thất bại`, "error", 5000);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const saveAvatar = async () => {
    if (!avatarFile || !user) return;

    try {
      setUpdating(true);

      const media = await mediaApi.replaceMedia(
        user.avatar_id ?? null,
        avatarFile,
        {
          domain_id: user.id,
          file_type: avatarFile.type,
          purpose: "user/avatar",
        },
      );

      await userApi.updateProfile({ avatar_id: media.id });
      await refreshUser();

      setAvatarFile(null);
      showAlert("Thành công", "Ảnh đại diện đã được cập nhật");
    } catch {
      showAlert("Thất bại", "Cập nhật ảnh đại diện thất bại", "error", 5000);
    } finally {
      setUpdating(false);
    }
  };

  /* ======================= RENDER EDITOR ======================= */

  const renderEditor = (field: FieldConfig) => {
    switch (field.type) {
      case "date":
        return (
          <DatePicker
            selected={fieldValue ? new Date(fieldValue) : null}
            onChange={(d: Date | null) =>
              setFieldValue(d ? d.toISOString() : "")
            }
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className={cx("custom-datepicker-input")}
            popperClassName={cx("custom-datepicker-popup")}
          />
        );

      default:
        return (
          <input
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          />
        );
    }
  };

  /* ======================= STATES ======================= */

  if (loading) return <Loading />;
  if (!user)
    return (
      <Empty
        icon="mdi:alert-circle-outline"
        title="Lỗi hệ thống"
        description="Không thể tải thông tin người dùng, vui lòng thử lại sau."
      />
    );

  /* ======================= RENDER ======================= */

  return (
    <div className={cx("profile")}>
      <h2 className={cx("profile__title")}>Thông tin cá nhân</h2>

      {/* AVATAR */}
      <div className={cx("profile__avatar")}>
        <div className={cx("avatar")}>
          <div className={cx("avatar__frame")}>
            <img
              className={cx("avatar__image")}
              src={user?.avatar_url || defaultAvatar}
              alt={user?.name || "Avatar"}
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
          </div>

          {avatarFile && (
            <button
              type="button"
              className={cx("avatar__remove")}
              onClick={() => setAvatarFile(null)}
            >
              <Icon icon="mdi:close" />
            </button>
          )}
        </div>

        <input
          id="avatarInput"
          hidden
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />

        {!avatarFile ? (
          <label htmlFor="avatarInput" className={cx("avatar__action")}>
            <Icon icon="tabler:camera" /> Thay ảnh đại diện
          </label>
        ) : (
          <button
            className={cx("avatar__action")}
            onClick={saveAvatar}
            disabled={updating}
          >
            <Icon icon="tabler:upload" /> {updating ? "Đang lưu..." : "Lưu ảnh"}
          </button>
        )}
      </div>

      {/* INFO */}
      <div className={cx("profile__table")}>
        <table>
          <tbody>
            {PROFILE_FIELDS.map((field) => {
              const value = user[field.key];
              const isEditing = editingField === field.key;

              return (
                <tr key={field.key}>
                  <td>{field.label}</td>
                  <td>
                    {isEditing ? (
                      renderEditor(field)
                    ) : value ? (
                      <span className={cx("profile__value")}>
                        {field.key === "dob"
                          ? formatDateVN(value)
                          : String(value)}
                      </span>
                    ) : (
                      <span className={cx("profile__empty")}>
                        Chưa có thông tin
                      </span>
                    )}
                  </td>
                  <td>
                    {!field.editable ? (
                      <button className={cx("profile__edit-btn")} disabled>
                        <Icon icon="mdi:lock-outline" />
                      </button>
                    ) : !isEditing ? (
                      <button
                        className={cx("profile__edit-btn")}
                        onClick={() => startEditing(field.key)}
                      >
                        <Icon icon="mdi:pencil-outline" />
                      </button>
                    ) : (
                      <div className={cx("profile__actions")}>
                        <button
                          className={cx("profile__action-cancel")}
                          onClick={cancelEditing}
                        >
                          Hủy
                        </button>
                        <button
                          className={cx("profile__action-save")}
                          onClick={() => saveField(field.key)}
                          disabled={updating}
                        >
                          Lưu
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
    </div>
  );
};

export default Profile;
