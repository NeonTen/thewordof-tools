/**
 * Image processing utilities for client-side conversion and resizing
 */

export interface ResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  quality: number;
  format: string;
}

export const IMAGE_PRESETS = {
  instagram_post: { width: 1080, height: 1080, label: "Instagram Post" },
  youtube_thumbnail: { width: 1280, height: 720, label: "YouTube Thumbnail" },
  whatsapp_image: { width: 800, height: 800, label: "WhatsApp Image" },
  website_optimized: { width: 1920, height: 1080, label: "Website Optimized" },
  thumbnail: { width: 150, height: 150, label: "Thumbnail" },
  hd: { width: 1280, height: 720, label: "HD (720p)" },
  full_hd: { width: 1920, height: 1080, label: "Full HD (1080p)" },
};

export async function processImage(
  file: File,
  options: ResizeOptions
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = options;

        if (!width && !height) {
          width = img.width;
          height = img.height;
        } else if (width && !height && options.maintainAspectRatio) {
          height = (img.height / img.width) * width;
        } else if (!width && height && options.maintainAspectRatio) {
          width = (img.width / img.height) * height;
        }

        canvas.width = width!;
        canvas.height = height!;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Handle transparency for non-supporting formats
        if (options.format === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, width!, height!);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                url: URL.createObjectURL(blob),
                width: width!,
                height: height!,
                size: blob.size,
              });
            } else {
              reject(new Error("Blob conversion failed"));
            }
          },
          options.format,
          options.quality / 100
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
