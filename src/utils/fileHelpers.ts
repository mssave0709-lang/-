/**
 * Utility functions for handling client-side image/video file attachments,
 * compression, and video thumbnail frame capture.
 */

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Reads a File into a base64 Data URL.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image file client-side using an off-screen HTML5 Canvas.
 * Produces an optimized JPEG data URL to prevent local storage exhaustion.
 * Default max dimensions: 960x540 at 0.76 quality (~35KB-60KB).
 */
export function compressImageFile(
  file: File,
  maxWidth = 960,
  maxHeight = 540,
  quality = 0.76
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or gif, return as direct data url to preserve animation/vectors
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      readFileAsDataUrl(file).then(resolve).catch(reject);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // High quality bicubic image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data url if canvas fails
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Captures the current playing/paused frame from an HTMLVideoElement as a JPEG Data URL.
 */
export function captureVideoFrame(video: HTMLVideoElement, quality = 0.78): string | null {
  try {
    if (!video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement('canvas');
    let width = video.videoWidth;
    let height = video.videoHeight;
    const maxWidth = 960;
    const maxHeight = 540;
    if (width > maxWidth || height > maxHeight) {
      if (width / height > maxWidth / maxHeight) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch (e) {
    console.error('Failed to capture frame from video:', e);
    return null;
  }
}
