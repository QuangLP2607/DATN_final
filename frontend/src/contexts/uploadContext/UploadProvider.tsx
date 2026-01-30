import { useRef, useState, type ReactNode } from "react";
import { UploadContext, type UploadItem } from "./UploadContext";
import { nanoid } from "nanoid";

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const controllers = useRef<Map<string, AbortController>>(new Map());

  const track = async <T,>({
    name,
    task,
  }: {
    name: string;
    task: (onProgress: (p: number) => void, signal: AbortSignal) => Promise<T>;
  }): Promise<T> => {
    const id = nanoid();
    const controller = new AbortController();
    controllers.current.set(id, controller);

    setUploads((prev) => [
      ...prev,
      { id, name, progress: 0, status: "uploading" },
    ]);

    try {
      const result = await task((progress) => {
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress } : u))
        );
      }, controller.signal);

      setUploads((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, progress: 100, status: "success" } : u
        )
      );

      return result;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setUploads((prev) => prev.filter((u) => u.id !== id));
      } else {
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "error" } : u))
        );
      }
      throw error;
    } finally {
      controllers.current.delete(id);
    }
  };

  const cancelUpload = (id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <UploadContext.Provider
      value={{ uploads, track, removeUpload, cancelUpload }}
    >
      {children}
    </UploadContext.Provider>
  );
}
