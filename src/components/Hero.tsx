import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  ArrowUpRight, 
  MessageCircle, 
  Phone,
  Monitor,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioItem } from '../types';
import { parseVideoUrl } from '../utils/videoHelper';

interface HeroProps {
  onExploreWork: () => void;
  onOpenContact: () => void;
  featuredItem?: PortfolioItem;
  onSelectWorkItem?: (item: PortfolioItem) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreWork, 
  onOpenContact,
  featuredItem,
  onSelectWorkItem
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Reliable sample video for initial preview if no custom user video uploaded
  const defaultVideoUrl = "/videos/hero-promo.mp4";
  const videoSrc = (featuredItem?.videoUrl && featuredItem.videoUrl.trim()) || defaultVideoUrl;
  const parsedVideo = parseVideoUrl(videoSrc);
  const isEmbed = parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo';

  // Ensure autoplay with muted status reliably mounts in all browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isEmbed) return;

    video.defaultMuted = true;
    video.muted = isMuted;

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay policy prevented playback without prior user interaction
            setIsPlaying(false);
          });
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
      video.addEventListener('canplay', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, [videoSrc, isEmbed]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (video.readyState === 0) {
        video.load();
      }
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // If unmuted playback is blocked, fallback to muted playback
            video.muted = true;
            setIsMuted(true);
            video.play()
              .then(() => setIsPlaying(true))
              .catch((err) => console.error("Playback error:", err));
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Section 2: Professional Design & Editing Tools Data
  const designTools = [
    {
      id: 'after-effects',
      name: 'After Effects',
      shortName: 'Ae',
      category: '모션 그래픽 & VFX',
      brandColor: '#9999FF',
      bgColor: '#00005B',
      hoverBorder: 'hover:border-[#9999FF]/50',
      hoverGlow: 'hover:shadow-[0_16px_36px_rgba(153,153,255,0.22)]',
      svg: (
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#00005B" />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#9999FF" fontSize="26" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5px">Ae</text>
        </svg>
      )
    },
    {
      id: 'premiere-pro',
      name: 'Premiere Pro',
      shortName: 'Pr',
      category: '영상 편집 & 마스터링',
      brandColor: '#EA77FF',
      bgColor: '#00005B',
      hoverBorder: 'hover:border-[#EA77FF]/50',
      hoverGlow: 'hover:shadow-[0_16px_36px_rgba(234,119,255,0.22)]',
      svg: (
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#00005B" />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#EA77FF" fontSize="26" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5px">Pr</text>
        </svg>
      )
    },
    {
      id: 'photoshop',
      name: 'Photoshop',
      shortName: 'Ps',
      category: '고화질 그래픽 & 텍스처',
      brandColor: '#31A8FF',
      bgColor: '#001E36',
      hoverBorder: 'hover:border-[#31A8FF]/50',
      hoverGlow: 'hover:shadow-[0_16px_36px_rgba(49,168,255,0.22)]',
      svg: (
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#001E36" />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#31A8FF" fontSize="26" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5px">Ps</text>
        </svg>
      )
    },
    {
      id: 'illustrator',
      name: 'Illustrator',
      shortName: 'Ai',
      category: '벡터 비주얼 & 타이포',
      brandColor: '#FF9A00',
      bgColor: '#330000',
      hoverBorder: 'hover:border-[#FF9A00]/50',
      hoverGlow: 'hover:shadow-[0_16px_36px_rgba(255,154,0,0.22)]',
      svg: (
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#330000" />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#FF9A00" fontSize="26" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5px">Ai</text>
        </svg>
      )
    },
    {
      id: 'canva',
      name: 'Canva',
      shortName: 'Canva',
      category: '신속 기획 & SNS 템플릿',
      brandColor: '#00C4CC',
      bgColor: '#00C4CC',
      hoverBorder: 'hover:border-[#00C4CC]/50',
      hoverGlow: 'hover:shadow-[0_16px_36px_rgba(0,196,204,0.22)]',
      svg: (
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="url(#canva-gradient)" />
          <defs>
            <linearGradient id="canva-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00C4CC" />
              <stop offset="1" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <path d="M32 17C23.71 17 17 23.71 17 32C17 40.29 23.71 47 32 47C37.25 47 41.81 44.3 44.44 40.19C43.81 40.15 43.1 40 42.4 39.65C39.75 38.31 38.69 36.05 38.34 35.17C37.5 36.84 35.35 38.88 32.38 38.88C27.62 38.88 24.38 35.5 24.38 30.5C24.38 24.88 28.5 21.12 33.75 21.12C38.12 21.12 41 24 41 27.88C41 30.12 39.88 32.12 38.12 33.38C36.88 34.25 35.5 34.62 34.25 34.62C32.38 34.62 31.12 33.5 31.12 32C31.12 30.25 32.62 29.12 34.38 29.12C35.12 29.12 35.75 29.38 36.38 29.75C36.62 29 36.75 28.12 36.75 27.25C36.75 24.75 35.12 23.5 32.88 23.5C29.75 23.5 27.25 26.25 27.25 30.25C27.25 34.12 29.5 36.5 32.75 36.5C35 36.5 36.75 35 37.62 33.62C36.88 32.88 36.38 31.88 36.38 30.75C36.38 28.62 38 27 40.12 27C42.25 27 43.88 28.62 43.88 30.75C43.88 33.62 41.88 36.38 39.25 37.5C39.75 38.38 40.75 39.62 42.62 40.5C45.12 38.5 46.75 35.5 46.75 32C46.75 23.71 40.29 17 32 17Z" fill="white" />
        </svg>
      )
    }
  ];

  // Section 5: Core Creative Services Lineup (6대 핵심 미디어 솔루션)
  const serviceCards = [
    {
      number: '01',
      title: '촬영 × AI 결합 영상',
      subtitle: '(하이브리드 DID)',
      desc: '매장과 제품을 직접 촬영한 실제 영상에 AI 연출을 더해, 평범한 공간을 특별한 분위기로 바꿔 보여드립니다. 적은 비용으로도 대형 광고 같은 장면을 만들 수 있습니다.'
    },
    {
      number: '02',
      title: '현장 맞춤형 영상',
      subtitle: '(촬영 DID)',
      desc: '조명 및 전문 시네마 장비를 활용해 제품과 공간을 정밀 촬영하고, 15초/30초/60초 단위의 숏폼 및 모션 영상으로 완성도 높게 편집합니다.'
    },
    {
      number: '03',
      title: '디지털 메뉴판',
      subtitle: '(Motion Menuboard)',
      desc: '텍스트만 있는 정적인 메뉴판을 넘어, AI와 모션 그래픽을 활용해 메뉴의 신선함과 식욕을 돋우는 생동감 있는 메뉴 보드를 제작합니다.'
    },
    {
      number: '04',
      title: '정보 전달형 인포그래픽',
      subtitle: null,
      desc: '병원/의원 및 교육 시설에서 꼭 필요한 진료 안내, 시술 단계, 학원 성과 등 필수 정보들을 가독성 높은 AI 인포그래픽으로 디자인합니다.'
    },
    {
      number: '05',
      title: 'AI 브랜딩 동화',
      subtitle: '(반전 바이럴 버전 포함)',
      desc: '이솝 우화, 속담, 명언 속 오래된 지혜를 AI 영상으로 새롭게 그려내, 브랜드의 가치와 철학을 한 편의 동화처럼 전합니다. 이야기 끝에 우리 매장이 등장하는 반전 바이럴 버전으로도 제작할 수 있습니다.'
    },
    {
      number: '06',
      title: '브랜드 광고',
      subtitle: '(SNS 숏폼)',
      desc: '인스타그램 릴스, 유튜브 쇼츠, 틱톡에 최적화된 15~30초 세로형 영상으로, 첫 3초 안에 시선을 붙잡고 매장의 정체성과 매력을 감각적으로 전하는 브랜드 광고를 제작합니다.'
    }
  ];

  return (
    <div className="w-full bg-white text-zinc-950">
      
      {/* ─────────────────────────────────────────────────────────────
          📍 Section 1. 메인 히어로 (첫 화면 - 수직 중앙 정렬 레이아웃)
          ───────────────────────────────────────────────────────────── */}
      <section 
        id="hero-section"
        className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-36 border-b border-zinc-200/70 overflow-hidden bg-white"
      >
        {/* Ambient Subtle Minimalism Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] bg-zinc-100/60 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center text-center">

          {/* 1. 메인 텍스트 영역 (가운데 정렬) */}
          {/* 메인 카피 (아주 크고 굵은 산세리프 폰트, 가운데 정렬, 강조) */}
          <h1 
            id="hero-main-slogan"
            className="text-[26px] xs:text-[28px] sm:text-5xl lg:text-[50px] font-black text-zinc-950 tracking-tight leading-[1.38] sm:leading-[1.28] break-keep max-w-4xl"
          >
            <span className="block sm:inline">매장용 모니터 설치부터</span>
            <br className="hidden sm:inline" />
            <span className="block sm:inline sm:mr-2">시선을 훔치는 영상 제작까지</span>
            <span className="block sm:inline whitespace-nowrap text-zinc-900">한 번에 끝내세요.</span>
          </h1>

          {/* 서브 카피 (통일된 폰트 크기: 모바일 18px / 데스크톱 20px, 중장년층도 편안한 가독성) */}
          <div className="mt-8 sm:mt-12 lg:mt-14 text-lg sm:text-xl text-zinc-600 leading-relaxed sm:leading-[1.85] font-normal break-keep max-w-4xl space-y-2 sm:space-y-0">
            {/* 문장 1 */}
            <p>
              <span className="block sm:inline sm:mr-1">벽에 모니터만 달아둔다고</span>
              <span className="block sm:inline">매출이 오르진 않습니다.</span>
            </p>

            {/* 문장 2 */}
            <p>
              <span className="block sm:inline sm:mr-1">강원 필링 라이프는</span>
              <span className="block sm:inline sm:mr-1">공간에 딱 맞는 기기 판매와</span>
              <span className="block sm:inline">선 없는 깔끔한 설치는 기본,</span>
            </p>

            {/* 문장 3 */}
            <p>
              <span className="block sm:inline sm:mr-1">발걸음을 멈추게 하는</span>
              <span className="block sm:inline sm:mr-1">트렌디한 메뉴판과 홍보 영상까지</span>
              <span className="block sm:inline whitespace-nowrap">직접 기획하고 디자인 합니다.</span>
            </p>

            {/* 문장 4 */}
            <p>
              <span className="block sm:inline sm:mr-1">장비 업체, 영상 업체 따로 찾으며</span>
              <span className="block sm:inline">시간 낭비하지 마세요.</span>
            </p>

            {/* 문장 5 */}
            <p>
              <span className="block sm:inline">처음부터 끝까지 책임집니다.</span>
            </p>
          </div>

          {/* 2. 소셜 채널 링크 아이콘 (가로로 나란히 중앙 배치, 여유 있는 간격) */}
          <div className="mt-10 sm:mt-12 flex items-center justify-center gap-4 sm:gap-5">
            {/* 네이버 블로그 (Blog) */}
            <a
              href="https://blog.naver.com/braketime"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="네이버 블로그 (새 창 열림)"
              title="네이버 블로그"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-zinc-200/90 bg-white text-zinc-600 hover:text-[#03C75A] hover:border-[#03C75A]/40 hover:bg-[#03C75A]/5 transition-all duration-300 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <svg 
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
              </svg>
              <span className="sr-only">네이버 블로그</span>
            </a>

            {/* 유튜브 (YouTube) */}
            <a
              href="https://www.youtube.com/@esurizone"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="유튜브 (새 창 열림)"
              title="유튜브 (@esurizone)"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-zinc-200/90 bg-white text-zinc-600 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 transition-all duration-300 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <i className="fa-brands fa-youtube text-lg sm:text-xl group-hover:scale-110 transition-transform"></i>
              <span className="sr-only">유튜브 (@esurizone)</span>
            </a>

            {/* 인스타그램 (Instagram) */}
            <a
              href="https://www.instagram.com/wonjuvm/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="인스타그램 (새 창 열림)"
              title="인스타그램 (@wonjuvm)"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-zinc-200/90 bg-white text-zinc-600 hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5 transition-all duration-300 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <i className="fa-brands fa-instagram text-lg sm:text-xl group-hover:scale-110 transition-transform"></i>
              <span className="sr-only">인스타그램 (@wonjuvm)</span>
            </a>
          </div>

          {/* 3. CTA 버튼 2개 (소셜 아이콘 아래, 가로 나란히 / 모바일 세로, 중앙 배치) */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            {/* 1) 작업물 둘러보기 : 아웃라인(테두리)만 있는 깔끔한 디자인 */}
            <button
              id="hero-cta-work"
              type="button"
              onClick={onExploreWork}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-zinc-300 hover:border-zinc-950 bg-white text-zinc-800 hover:text-zinc-950 font-medium text-sm sm:text-base transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer group"
            >
              <span>작업물 둘러보기</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 2) 무료 상담 문의 : 짙은 차콜색 배경 강조형 디자인 */}
            <button
              id="hero-cta-contact"
              type="button"
              onClick={onOpenContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
            >
              <span>무료 상담 문의</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-300" />
            </button>
          </div>

          {/* 4. 대표 영상 플레이어 (가장 하단 중앙 큼직하게 배치) */}
          <motion.div 
            className="mt-14 sm:mt-18 lg:mt-20 w-full max-w-4xl lg:max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Outer Frame with soft shadow & rounded corners for high quality screen aesthetic */}
            <div className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-zinc-100/90 border border-zinc-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.16)] transition-all duration-300">

              {/* HTML5 Video / Embed Canvas */}
              <div 
                className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-950 group select-none"
              >
                {isEmbed ? (
                  <iframe
                    src={parsedVideo.embedUrl}
                    title={featuredItem?.title || "메인 대표 영상"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      key={videoSrc}
                      src={videoSrc}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="auto"
                      poster={featuredItem?.videoThumbnail}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlay}
                      className="w-full h-full object-cover select-none cursor-pointer"
                    />

                    {/* Center Play Button Overlay when paused */}
                    {!isPlaying && (
                      <div 
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all z-20 cursor-pointer animate-in fade-in duration-200"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 hover:bg-white text-zinc-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          title="영상 재생"
                          aria-label="영상 재생"
                        >
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 text-zinc-900" />
                        </button>
                      </div>
                    )}

                    {/* Subtle Top Overlay Controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-950/70 hover:bg-zinc-950 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer shadow-sm"
                        title={isMuted ? "음소거 해제" : "음소거"}
                        aria-label={isMuted ? "음소거 해제" : "음소거"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-zinc-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-950/70 hover:bg-zinc-950 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer shadow-sm"
                        title={isPlaying ? "일시정지" : "재생"}
                        aria-label={isPlaying ? "일시정지" : "재생"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 text-zinc-300" /> : <Play className="w-4 h-4 text-zinc-300 fill-current ml-0.5" />}
                      </button>
                    </div>
                  </>
                )}

                {/* Bottom Metadata Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-transparent flex items-end justify-between pointer-events-none z-10">
                  <div className="space-y-1 max-w-[70%] sm:max-w-[75%] text-left">
                    <div className="text-[11px] sm:text-xs font-mono text-zinc-400">
                      {featuredItem?.badge || '[대표 비주얼]'} {featuredItem?.clientOrStore || '미디어 솔루션'}
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-white truncate">
                      {featuredItem?.title || '공간을 채우는 시그니처 모션 비주얼'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onExploreWork}
                    className="pointer-events-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/15 hover:bg-white/25 text-xs sm:text-sm font-semibold text-white backdrop-blur-md border border-white/15 transition-colors cursor-pointer shrink-0"
                  >
                    작업물 자세히 보기
                  </button>
                </div>

              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          📍 Section 2. 디지털 사이니지 안내 (Digital Signage)
          ───────────────────────────────────────────────────────────── */}
      <section 
        id="digital-signage-intro-section"
        className="py-20 sm:py-24 lg:py-28 bg-zinc-50/60 border-b border-zinc-200/80 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
          
          {/* Top Divider & Section Label */}
          <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-12">
            <div className="w-10 h-[2px] bg-zinc-950 mb-3.5" />
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
              Digital Signage Solution
            </span>
          </div>

          {/* Header: Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-zinc-950 tracking-tight leading-[1.3] break-keep">
              매장의 이야기를 24시간 전하는 화면,
              <br />
              <span className="text-zinc-900">디지털 사이니지</span>
            </h2>
          </div>

          {/* Body Paragraphs Block: 19px 폰트 크기 및 편안한 행간 */}
          <div className="max-w-3xl mx-auto space-y-7 sm:space-y-8">
            {/* 문단 1 */}
            <p className="text-[19px] text-zinc-700 leading-[1.85] font-normal break-keep">
              디지털 사이니지는 매장, 병원, 로비 등에 설치된 모니터로 메뉴·제품·브랜드 이야기를 영상으로 전하는 '말없는 영업사원'입니다.
            </p>

            {/* 문단 2 */}
            <p className="text-[19px] text-zinc-700 leading-[1.85] font-normal break-keep">
              움직이는 화면은 지나가는 고객의 시선을 멈추게 하고, 반복되는 메시지는 브랜드를 기억에 남깁니다. 인쇄물 교체 없이 시즌과 시간대에 맞춰 언제든 새로운 이야기를 전할 수도 있습니다.
            </p>

            {/* 문단 3 (강조) */}
            <p className="text-[19px] text-zinc-950 font-bold leading-[1.85] break-keep pt-1">
              하지만 효과를 만드는 것은 화면이 아니라 콘텐츠입니다. 몇 초 안에 전달되는 자막 설계, 반복해서 봐도 지루하지 않은 편집, 그리고 사장님의 진심이 담긴 스토리까지. 고객의 마음을 움직이는 사이니지 영상을 기획부터 촬영, 편집까지 함께 만들어 드립니다.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          📍 Section 3. 회사 소개 (Our Story)
          ───────────────────────────────────────────────────────────── */}
      <section 
        id="our-story-section"
        className="py-20 sm:py-28 lg:py-32 bg-white border-b border-zinc-200/80 relative overflow-hidden"
      >
        {/* Subtle Watermark: 2011 (투명도 10% 이하의 감각적인 타이포그래피) */}
        <div 
          aria-hidden="true" 
          className="absolute -right-6 sm:right-6 bottom-4 sm:bottom-8 text-[120px] sm:text-[170px] lg:text-[230px] font-black font-mono tracking-tighter text-zinc-900/[0.035] select-none pointer-events-none leading-none z-0"
        >
          2011
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
          
          {/* Top Divider & Section Label */}
          <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-12">
            <div className="w-10 h-[2px] bg-zinc-950 mb-3.5" />
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
              About Us · Our Story
            </span>
          </div>

          {/* Header Block: Badge, Main Title, Subtitle (세로 흐름 상단 배치) */}
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-100 text-zinc-800 text-xs sm:text-sm font-mono font-bold">
              <span>SINCE 2011 · 15 YEARS OF EXCELLENCE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-zinc-950 tracking-tight leading-[1.3] break-keep">
              15년의 현장 노하우,
              <br />
              <span className="text-zinc-900">트렌디한 미디어 감각으로 완성되다.</span>
            </h2>

            <p className="text-lg sm:text-xl font-semibold text-zinc-700 leading-relaxed break-keep">
              디스플레이의 속사정을 꿰뚫는 설치 베테랑과 시선을 사로잡는 영상을 기획하는 디렉터가 함께 만듭니다.
            </p>
          </div>

          {/* Body Paragraphs Block: 모든 연령층이 편안하게 읽을 수 있도록 폰트 크기 19px로 일괄 고정 */}
          <div className="max-w-3xl mx-auto space-y-7 sm:space-y-8">
            {/* 문단 1 */}
            <p className="text-[19px] text-zinc-700 leading-[1.85] font-normal break-keep">
              강원 필링 라이프의 뿌리는 깊고 단단합니다. 2011년, 복잡한 컴퓨터 수리와 까다로운 TV 벽걸이 선 숨김 설치로 시작된 우리의 여정은 단순한 '시공'을 넘어선 '공간의 완성'이었습니다. 수많은 공공기관과 매장의 빔프로젝터, 음향 기기를 직접 세팅하고, 나아가 TV 패널 수리(AS)까지 도맡아 했던 경험. 이 15년의 시간은 우리가 디스플레이 기기의 겉과 속을 누구보다 완벽하게 이해하고 있다는 가장 확실한 증거입니다.
            </p>

            {/* 문단 2 */}
            <p className="text-[19px] text-zinc-700 leading-[1.85] font-normal break-keep">
              이제, 15년간 현장을 누빈 베테랑의 완벽하고 안전한 하드웨어 기술력 위에 완전히 새로운 감각을 덧입힙니다. 최신 AI 기술과 전문 그래픽 툴을 자유자재로 다루는 트렌디한 콘텐츠 기획력이 결합하여, 단순한 '기기'에 불과했던 모니터를 매장에서 가장 강력한 '마케팅 공간'으로 탈바꿈시킵니다.
            </p>

            {/* 문단 3 (강조 처리 - 약간 더 굵게, 모바일 자연스러운 구문 줄바꿈 및 끊김 방지) */}
            <p className="text-[17px] sm:text-[19px] text-zinc-950 font-bold leading-[1.8] sm:leading-[1.85] break-keep pt-1">
              <span className="block sm:inline sm:mr-1">
                <span className="block sm:inline">어떤 모니터가 공간에 맞는지</span>
                <span className="block sm:inline"> 정확히 진단하는 전문성,</span>
              </span>
              <span className="block sm:inline sm:mr-1">
                <span className="block sm:inline">선 하나 보이지 않게 시공하는</span>
                <span className="block sm:inline"> 완벽한 기술력,</span>
              </span>
              <span className="block sm:inline sm:mr-1">
                <span className="block sm:inline">그리고 그 화면을 가장 매력적인</span>
                <span className="block sm:inline"> 콘텐츠로 채워 넣는 감각까지.</span>
              </span>
              <span className="block sm:inline mt-3 sm:mt-0">
                <span className="block sm:inline sm:mr-1">강원 필링 라이프가</span>
                <span className="block sm:inline sm:mr-1">
                  <span className="inline-block whitespace-nowrap font-black text-black text-[14.5px] min-[375px]:text-[15.5px] sm:text-[19px] tracking-tight sm:tracking-normal">
                    '기기 판매&#8209;안전 시공&#8209;맞춤형 영상 제작'이라는
                  </span>
                </span>
                <span className="block sm:inline"> 가장 확실하고 든든한 원스톱 솔루션을 약속합니다.</span>
              </span>
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          📍 Section 4. 제작 철학 & 사용 툴 (Philosophy & Creative Tools)
          ───────────────────────────────────────────────────────────── */}
      <section 
        id="philosophy-tools-section"
        className="py-16 sm:py-24 lg:py-28 bg-zinc-50/60 border-b border-zinc-200/80 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          
          {/* Section Heading & Philosophy (Center Aligned) */}
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5 mb-12 sm:mb-16">
            
            {/* 1. 메인 타이틀 영역 (가운데 정렬 - 통일된 폰트 크기) */}
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-zinc-950 tracking-tight leading-[1.3] break-keep">
              "저희는 고객들의 생각을 담아내는 그릇입니다."
            </h2>

            {/* 2. 서브 텍스트 (타이틀 바로 아래, 가운데 정렬, 통일된 폰트 크기: 18~20px) */}
            <p className="pt-2 text-lg sm:text-xl text-zinc-600 leading-relaxed font-normal break-keep max-w-2xl mx-auto">
              단순한 AI 생성을 넘어, 기획부터 현장 촬영까지. AI와 전문 그래픽 툴을 결합하여 고객의 상상을 가장 완벽한 결과물로 구현합니다.
            </p>
          </div>

          {/* 3. 전문 디자인 툴 아이콘 나열 (display: flex, justify-content: center) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {designTools.map((tool) => (
              <div 
                key={tool.id}
                className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 w-28 sm:w-36 md:w-44 rounded-2xl bg-white border border-zinc-200/80 ${tool.hoverBorder} shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${tool.hoverGlow}`}
              >
                {/* Tool Icon with Grayscale -> Brand Color & Transform */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 filter grayscale opacity-70 contrast-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 group-hover:scale-105 select-none">
                  {tool.svg}
                </div>

                {/* Tool Name */}
                <div className="mt-3.5 text-center w-full">
                  <span className="block text-xs sm:text-sm font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors truncate">
                    {tool.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          📍 Section 5. 우리가 제공하는 서비스 (Service Lineup)
          ───────────────────────────────────────────────────────────── */}
      <section 
        id="creative-solutions-section"
        className="w-full bg-[#FFFFFF] py-[80px] sm:py-[100px] lg:py-[120px] px-6 sm:px-8 border-b border-zinc-200/80"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          
          {/* Section Heading (Left Aligned) */}
          <div className="text-left mb-10 sm:mb-14">
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-[#111111] leading-[1.25] tracking-tight mb-4 break-keep">
              우리가 제공하는 서비스
            </h2>
            <p className="text-base sm:text-lg lg:text-[18px] font-normal text-[#555555] leading-[1.7] max-w-[820px] break-keep">
              복잡한 기획부터 디스플레이 규격 최적화, 감각적인 영상 제작까지. 매장의 분위기를 바꾸고 고객의 시선을 사로잡는 강원 필링 라이프의 6대 핵심 미디어 솔루션입니다.
            </p>
          </div>

          {/* Core Services 6 Cards Grid (3 cols x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {serviceCards.map((service) => (
              <article
                key={service.number}
                className="group relative bg-[#FFFFFF] border border-[#E8E8E8] rounded-[28px] px-7 sm:px-8 lg:px-9 pt-10 sm:pt-11 lg:pt-12 pb-8 sm:pb-9 lg:pb-10 flex flex-col items-center justify-start text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] transition-all duration-400 ease-out hover:-translate-y-2 lg:aspect-[3/4] cursor-default"
              >
                {/* 1. 숫자 원형 배지: 모든 카드 상단에서 완벽히 동일한 수평선에 고정 정렬 */}
                <div 
                  className="w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-full bg-[#111111] text-[#FFFFFF] text-[20px] lg:text-[22px] font-bold flex items-center justify-center mb-6 lg:mb-8 shrink-0 shadow-[0_0_0_6px_#FFFFFF,0_0_0_7px_#E8E8E8,0_6px_14px_rgba(0,0,0,0.08)] transition-transform duration-400 ease-out group-hover:rotate-[360deg] select-none"
                >
                  {service.number}
                </div>

                {/* 2. 제목 & 보조 제목: 균일한 높이 영역을 확보하여 설명문 시작 위치까지 일직선으로 정렬 */}
                <div className="w-full min-h-[60px] lg:min-h-[70px] flex flex-col items-center justify-start mb-4 lg:mb-5">
                  <h3 className="text-[22px] lg:text-[24px] font-extrabold text-[#111111] leading-[1.3] break-keep">
                    {service.title}
                  </h3>
                  {service.subtitle ? (
                    <span className="block text-[15px] lg:text-[16px] font-medium text-[#888888] mt-1.5">
                      {service.subtitle}
                    </span>
                  ) : (
                    <span className="block text-[15px] lg:text-[16px] font-medium opacity-0 select-none pointer-events-none mt-1.5" aria-hidden="true">
                      &nbsp;
                    </span>
                  )}
                </div>

                {/* 3. 설명문 */}
                <p className="text-[15px] lg:text-[16px] font-normal text-[#555555] leading-[1.75] px-1 sm:px-2 break-keep">
                  {service.desc}
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          📍 Section 6. 하단 고정 액션 (Contact CTA)
          ───────────────────────────────────────────────────────────── */}
      <section 
        id="home-contact-cta"
        className="py-16 sm:py-24 bg-zinc-50"
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-zinc-950 tracking-tight leading-snug">
              매장에 딱 맞는 미디어 솔루션,
              <br />
              지금 바로 상담받아보세요.
            </h2>

            <p className="text-lg sm:text-xl text-zinc-600 max-w-xl mx-auto leading-relaxed">
              설치 환경 문의부터 콘텐츠 기획까지, 궁금하신 점을 남겨주시면
              친절하고 상세하게 안내해 드립니다.
            </p>
          </div>

          {/* Primary Action Buttons: 문의하기 & Direct Phone Call (세로 나란히 가운데 정렬) */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-3.5 max-w-xs mx-auto w-full">
            {/* 문의하기 버튼 (메뉴탭 문의하기로 전환) */}
            <button
              type="button"
              id="cta-contact-tab-btn"
              onClick={onOpenContact}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-md group cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <span>문의하기</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 전화번호 버튼 */}
            <a
              href="tel:010-8611-9062"
              id="cta-phone-call-btn"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-white hover:bg-zinc-100 text-zinc-800 font-semibold rounded-xl text-sm sm:text-base border border-zinc-300 transition-colors shadow-2xs cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 text-zinc-600 shrink-0" />
              <span>010-8611-9062</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
