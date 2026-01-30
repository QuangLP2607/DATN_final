import { createContext } from "react";

export type UploadStatus = "uploading" | "success" | "error";

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: UploadStatus;
}

export interface UploadContextValue {
  uploads: UploadItem[];
  track: <T>(params: {
    name: string;
    task: (onProgress: (p: number) => void, signal: AbortSignal) => Promise<T>;
  }) => Promise<T>;
  removeUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
}

export const UploadContext = createContext<UploadContextValue>({
  uploads: [],
  track: async () => {
    throw new Error("UploadContext not initialized");
  },
  removeUpload: () => {},
  cancelUpload: () => {},
});
