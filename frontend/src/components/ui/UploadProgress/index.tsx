import { useEffect } from "react";
import styles from "./UploadProgress.module.scss";
import { useUpload } from "@/hooks/useUpload";
import type { UploadItem } from "@/contexts/uploadContext/UploadContext";

export default function UploadProgress() {
  const { uploads, removeUpload, cancelUpload } = useUpload();

  return (
    <div className={styles.wrapper}>
      {uploads.map((u) => (
        <UploadItem
          key={u.id}
          upload={u}
          onRemove={removeUpload}
          onCancel={cancelUpload}
        />
      ))}
    </div>
  );
}

function UploadItem({
  upload,
  onRemove,
  onCancel,
}: {
  upload: UploadItem;
  onRemove: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  useEffect(() => {
    if (upload.status === "success") {
      const timer = setTimeout(() => {
        onRemove(upload.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [upload.status, upload.id, onRemove]);

  return (
    <div
      className={`${styles.uploadItem} ${styles[`status-${upload.status}`]}`}
      title={upload.status}
    >
      <div className={styles.uploadName}>{upload.name}</div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${upload.progress}%` }}
        />
      </div>

      <button
        className={styles.closeButton}
        onClick={(e) => {
          e.stopPropagation();
          if (upload.status === "uploading") onCancel(upload.id);
          else onRemove(upload.id);
        }}
        title={upload.status === "uploading" ? "Cancel upload" : "Remove"}
      >
        ✕
      </button>
    </div>
  );
}
