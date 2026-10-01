export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'direct';
  embedUrl?: string;
  originalUrl: string;
}

/**
 * 유튜브, 비메오, 또는 일반 MP4/WebM 직접 비디오 URL을 파싱하여
 * 적절한 임베드 주소 및 비디오 타입을 반환합니다.
 */
export function parseVideoUrl(url: string | undefined): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return { type: 'direct', originalUrl: '' };
  }

  const trimmed = url.trim();

  // 1. YouTube 매칭:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  const ytRegex = /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: trimmed
    };
  }

  // 2. Vimeo 매칭:
  // https://vimeo.com/123456789
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/i;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`,
      originalUrl: trimmed
    };
  }

  // 3. 일반 직접 비디오 링크 (mp4, webm, blob, cdn 등)
  return {
    type: 'direct',
    originalUrl: trimmed
  };
}
