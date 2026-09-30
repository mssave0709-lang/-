import React, { useRef } from 'react';
import { ArrowUp, MapPin } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  onTabChange?: (tab: NavigationTab) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenAdmin }) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 비밀 진입: 푸터 텍스트를 1.5초 이내에 연속 3회 클릭/탭하면 관리자 창 오픈
  const handleSecretAdminTrigger = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin?.();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="main-footer"
      className="bg-white text-zinc-600 border-t border-zinc-200 pt-10 pb-20 md:pb-12"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6">
          <div>
            <div 
              onClick={handleSecretAdminTrigger}
              className="text-lg font-black tracking-tight text-zinc-950 mb-1 flex items-center gap-2 cursor-default select-none"
              title="강원 필링 라이프"
            >
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              <span>강원 필링 라이프</span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mb-2">
              Digital Media & Motion Graphic Studio
            </p>
            <address className="not-italic text-xs sm:text-sm text-zinc-600 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>강원특별자치도 치악로 1719, 2층 강원 필링 라이프</span>
            </address>
          </div>

          <div className="flex items-center">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:text-zinc-950 text-zinc-500 transition-colors bg-zinc-50 cursor-pointer"
              aria-label="맨 위로 이동"
              title="맨 위로 이동"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom copyright & secret admin entry */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div 
            onClick={handleSecretAdminTrigger}
            className="cursor-default select-none hover:text-zinc-500 transition-colors"
          >
            © {new Date().getFullYear()} 강원 필링 라이프 (GFL). All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
