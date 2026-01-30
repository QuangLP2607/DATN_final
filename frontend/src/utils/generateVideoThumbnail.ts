export async function generateVideoThumbnail(
  file: File | Blob,
  atSecond: number = 10
): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.crossOrigin = "anonymous";

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
      video.currentTime = Math.min(atSecond, duration - 0.1);
    });

    video.addEventListener("seeked", async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Failed to generate thumbnail"));

            const thumbnailFile = new File([blob], "thumbnail.png", {
              type: "image/png",
            });
            resolve(thumbnailFile);

            URL.revokeObjectURL(url);
          },
          "image/png",
          0.9
        );
      } catch (err) {
        reject(err);
      }
    });

    video.addEventListener("error", (err) => {
      reject(err);
    });
  });
}
