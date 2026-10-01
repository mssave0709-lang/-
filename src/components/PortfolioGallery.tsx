import React, { useState } from 'react';
import { PortfolioItem, PortfolioCategory } from '../types';
import { 
  Play, 
  Pause, 
  Film, 
  CheckCircle2, 
  X, 
  Phone, 
  Layers, 
  ArrowUpRight, 
  Tag,
  Sparkles,
  Monitor,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { parseVideoUrl } from '../utils/videoHelper';

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  onSelectItem: (item: PortfolioItem) => void;
  onOpenContact: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
  onEditItemDirectly?: (item: PortfolioItem) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ 
  items, 
  onSelectItem, 
  onOpenContact
}) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('전체보기');
  const [mediaViewMode, setMediaViewMode] = useState<'video' | 'stills'>('video');

  // Dynamic filter tabs: 기본 카테고리 및 사용자가 직접 입력한 새 카테고리 자동 포함
  const defaultCategories: string[] = [
    '광고',
    '숏폼',
    '인포그래픽',
    '디지털 메뉴보드',
    '영상 카드뉴스',
    '카드뉴스',
    '브랜딩 동화'
  ];
  const customCategories = Array.from(
    new Set(
      items
        .map((i) => i.category?.trim())
        .filter((c): c is string => Boolean(c && !defaultCategories.includes(c)))
    )
  );
  const filterTabs: PortfolioCategory[] = [
    '전체보기',
    ...defaultCategories,
    ...customCategories
  ];

  const handleOpenDetail = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsPlayingPreview(true);
    setActiveFrameIndex(0);
    setMediaViewMode(item.videoUrl ? 'video' : 'stills');
    onSelectItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setIsPlayingPreview(false);
  };

  // Filter items strictly according to the categories
  const filteredItems = items.filter((item) => {
    if (activeCategory === '전체보기') return true;
    return item.category === activeCategory;
  });

  return (
    <section 
      id="portfolio-section"
      className="py-16 sm:py-24 bg-white text-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Portfolio & Works
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              제작 포트폴리오 아카이브
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
              광고, 숏폼, 인포그래픽, 디지털 메뉴보드, 영상 카드뉴스, 카드뉴스, 브랜딩 동화 등 각 업종별 목적에 맞춘 실제 제작 사례를 확인해 보세요.
            </p>
          </div>
        </div>

        {/* 탭 메뉴 카테고리 구성: [전체보기] | [광고] | [숏폼] | [인포그래픽] | [디지털 메뉴보드] | [영상 카드뉴스] | [카드뉴스] */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-none border-b border-zinc-100">
          {filterTabs.map((category) => {
            const isActive = activeCategory === category;
            const count = category === '전체보기' 
              ? items.length 
              : items.filter(i => i.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 border border-transparent'
                }`}
              >
                <span>{category}</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200/80 text-zinc-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Works Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200 p-8 max-w-md mx-auto">
            <Film className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <div className="text-sm font-semibold text-zinc-700">
              '{activeCategory}' 관련 등록된 작업물이 없습니다.
            </div>
            <button
              onClick={() => setActiveCategory('전체보기')}
              className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              전체보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group cursor-pointer flex flex-col space-y-3 bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-3.5 transition-all hover:shadow-lg relative"
              >
                {/* 1. Media Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 shadow-xs">
                  <img 
                    src={item.videoThumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1400&auto=format&fit=crop';
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 shadow-xl transition-all duration-300">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded text-[11px] font-mono text-white font-medium">
                    {item.duration}
                  </div>
                </div>

                {/* 2. 각 썸네일 아래 타겟 업종 태그 텍스트 영역 (Target Industry Tags Area) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[11px] font-bold tracking-tight shadow-xs">
                    <Tag className="w-3 h-3 text-zinc-400" />
                    <span>{item.targetIndustryTag || item.tags?.[0] || '#맞춤제작'}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-semibold border border-zinc-200">
                    {item.category}
                  </span>

                  {item.tags?.slice(1, 3).map((subTag, tIdx) => (
                    <span key={tIdx} className="text-[11px] text-zinc-500 font-mono">
                      {subTag}
                    </span>
                  ))}
                </div>

                {/* 3. Typography Metadata */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                    <span className="font-semibold text-zinc-800">{item.clientOrStore}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-zinc-100">
                    <span>{String(item.videoFormat || '16:9').split(' ')[0]}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-zinc-900 font-bold">
                      자세히 보기 <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Video Work Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseDetail}
        >
          <div 
            className="bg-white border border-zinc-200 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative text-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-zinc-600 hover:text-zinc-950 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-5">
              
              {/* Header with Industry Tag and Category */}
              <div className="space-y-2 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-zinc-900 text-white text-xs font-bold">
                    {selectedItem.targetIndustryTag || '#맞춤제작'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-xs font-semibold border border-zinc-200">
                    {selectedItem.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    · {selectedItem.clientOrStore} · {selectedItem.duration}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 leading-tight">
                  {selectedItem.title}
                </h3>
              </div>

              {/* View Mode Switcher (플레이어와 스틸 씬 분리 감상) */}
              <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
                  {selectedItem.videoUrl ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMediaViewMode('video')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          mediaViewMode === 'video'
                            ? 'bg-zinc-950 text-white shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        <Film className="w-3.5 h-3.5 text-orange-400" />
                        <span>동영상 플레이어</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaViewMode('stills')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          mediaViewMode === 'stills'
                            ? 'bg-zinc-950 text-white shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>주요 장면 스틸 씬 ({selectedItem.videoFrames?.length || 0})</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-800">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>주요 장면 스틸 씬 ({selectedItem.videoFrames?.length || 0})</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
                  {selectedItem.videoFormat}
                </div>
              </div>

              {/* Media Display Area: Player vs Still Scenes */}
              <div className="rounded-xl overflow-hidden bg-black border border-zinc-800 relative">
                {mediaViewMode === 'video' && selectedItem.videoUrl ? (
                  /* 1. Video Player Mode (Direct Video, YouTube, Vimeo 통합 지원) */
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black flex items-center justify-center">
                    {(() => {
                      const parsed = parseVideoUrl(selectedItem.videoUrl);
                      if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
                        return (
                          <iframe
                            src={parsed.embedUrl}
                            title={selectedItem.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        );
                      }
                      return (
                        <video
                          src={selectedItem.videoUrl}
                          poster={selectedItem.videoThumbnail}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      );
                    })()}
                  </div>
                ) : (
                  /* 2. Still Scenes Gallery Mode */
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
                    <img 
                      src={selectedItem.videoFrames[activeFrameIndex] || selectedItem.videoThumbnail} 
                      alt={`주요 장면 스틸 씬 0${activeFrameIndex + 1}`} 
                      className="w-full h-full object-contain transition-all duration-300"
                    />

                    {/* Frame Navigation Arrows */}
                    {selectedItem.videoFrames.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveFrameIndex((prev) => (prev > 0 ? prev - 1 : selectedItem.videoFrames.length - 1))}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer"
                          aria-label="이전 씬"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFrameIndex((prev) => (prev < selectedItem.videoFrames.length - 1 ? prev + 1 : 0))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer"
                          aria-label="다음 씬"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Top Scene Index Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/10 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-orange-400" />
                      <span>SCENE 0{activeFrameIndex + 1} / 0{selectedItem.videoFrames.length}</span>
                    </div>

                    {/* Bottom Status */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs font-mono text-zinc-300">
                      <span>STILL SCENE PREVIEW</span>
                      <span>{selectedItem.duration}</span>
                    </div>
                  </div>
                )}

                {/* Video Stills Thumbnail Strip */}
                {selectedItem.videoFrames.length > 0 && (
                  <div className="bg-zinc-900 p-2.5 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto">
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0 px-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-orange-400" />
                      Scenes:
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedItem.videoFrames.map((frameUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setActiveFrameIndex(idx);
                            setMediaViewMode('stills');
                          }}
                          className={`relative w-16 sm:w-20 aspect-[16/9] rounded overflow-hidden border transition-all cursor-pointer ${
                            mediaViewMode === 'stills' && activeFrameIndex === idx 
                              ? 'border-white opacity-100 ring-2 ring-[#EA580C]' 
                              : 'border-zinc-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={frameUrl} 
                            alt={`씬 0${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/80 text-white font-mono text-[8px] rounded">
                            0{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Descriptions Section */}
              <div className="space-y-4">
                {/* 1. Key Message Banner (if available) */}
                {selectedItem.keyMessage && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200/80 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-mono font-bold text-orange-800 uppercase tracking-wide">
                        KEY MESSAGE & SLOGAN
                      </div>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900 mt-0.5">
                        "{selectedItem.keyMessage}"
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Concept & Direction */}
                <div className="bg-zinc-50 p-4 sm:p-5 rounded-xl border border-zinc-200 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-zinc-600 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-zinc-900" />
                    <span>CONCEPT & DIRECTION (기획 및 연출 의도)</span>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-normal whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>

                {/* 3. Production & Direction Notes (if available) */}
                {selectedItem.productionNotes && (
                  <div className="bg-zinc-50 p-4 sm:p-5 rounded-xl border border-zinc-200 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-zinc-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>PRODUCTION & DIRECTION NOTES (제작 비하인드 & 연출 노트)</span>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {selectedItem.productionNotes}
                    </p>
                  </div>
                )}

                {/* 4. Target Space & Audience Guide (if available) */}
                {selectedItem.targetAudience && (
                  <div className="bg-zinc-50 p-4 sm:p-5 rounded-xl border border-zinc-200 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-zinc-600 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                      <span>DISPLAY & AUDIENCE GUIDE (추천 송출 공간 및 타겟 가이드)</span>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {selectedItem.targetAudience}
                    </p>
                  </div>
                )}

                {/* 5. Key Motion Features */}
                {selectedItem.motionFeatures.length > 0 && (
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-zinc-200 space-y-2.5">
                    <div className="text-xs font-mono font-bold text-zinc-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
                      <span>PRODUCTION HIGHLIGHTS (모션 그래픽 핵심 포인트)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {selectedItem.motionFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons with Corrected Phone Number */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handleCloseDetail();
                    onOpenContact();
                  }}
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-xl text-center text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>이 스타일로 프로젝트 문의하기</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <a
                  href="tel:010-8611-9062"
                  className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-xl text-center text-sm border border-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  title="전화 바로걸기"
                >
                  <Phone className="w-4 h-4 text-zinc-600" />
                  <span>010-8611-9062</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
