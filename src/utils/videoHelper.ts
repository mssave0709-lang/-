export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'direct';
  embedUrl?: string;
  originalUrl: string;
}

/**
 * 사용자 입력 문자열에서 순수 URL 또는 iframe src 추출
 */
export function extractCleanVideoUrl(raw: string | undefined): string {
  if (!raw || typeof raw !== 'string') return '';
  let cleaned = raw.trim();

  // If user pasted an iframe tag (e.g. <iframe ... src="https://..." ...>)
  const iframeSrcMatch = cleaned.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    cleaned = iframeSrcMatch[1].trim();
  }

  // Remove surrounding quotes or angle brackets
  cleaned = cleaned.replace(/^["'<]+|["'>]+$/g, '').trim();
  return cleaned;
}

/**
 * 유튜브, 비메오, 또는 일반 MP4/WebM 직접 비디오 URL을 파싱하여
 * 적절한 임베드 주소 및 비디오 타입을 반환합니다.
 */
export function parseVideoUrl(url: string | undefined): ParsedVideo {
  const cleaned = extractCleanVideoUrl(url);
  if (!cleaned) {
    return { type: 'direct', originalUrl: '' };
  }

  // 1. YouTube 매칭:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/live/VIDEO_ID
  // https://m.youtube.com/watch?v=VIDEO_ID
  const ytRegex = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = cleaned.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: cleaned
    };
  }

  // 2. Vimeo 매칭:
  // https://vimeo.com/123456789
  // https://player.vimeo.com/video/123456789
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)|player\.vimeo\.com\/video\/)(\d+)/i;
  const vimeoMatch = cleaned.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`,
      originalUrl: cleaned
    };
  }

  // 3. 일반 직접 비디오 링크 (mp4, webm, blob, cdn 등)
  return {
    type: 'direct',
    originalUrl: cleaned
  };
}
