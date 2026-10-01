import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab,
  onTabChange,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: '홈' },
    { id: 'service', label: '서비스' },
    { id: 'work', label: '작업물' },
    { id: 'contact', label: '문의하기' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-zinc-200/80 shadow-sm py-3.5' 
          : 'bg-white/70 backdrop-blur-sm border-b border-zinc-200/40 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Zone 1: Single Wordmark */}
        <button 
          onClick={() => handleNavClick('home')}
          id="brand-logo-link"
          className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 hover:text-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
          <span className="flex items-baseline gap-1.5">
            <span>강원 필링 라이프</span>
            <span className="text-[11px] font-medium text-zinc-400 font-mono hidden sm:inline">STUDIO</span>
          </span>
        </button>

        {/* Zone 2: Unboxed Desktop Navigation (가두지 않고 여유로운 일정 간격으로 배치된 한국어 메뉴) */}
        <nav id="desktop-navigation" className="hidden md:flex items-center gap-9 lg:gap-12">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`group relative py-1 text-base lg:text-[17px] tracking-tight transition-colors duration-200 cursor-pointer ${
                  isActive 
                    ? 'font-bold text-zinc-950' 
                    : 'font-medium text-zinc-500 hover:text-zinc-950'
                }`}
              >
                <span>{item.label}</span>
                {/* Minimal Active/Hover Underline Indicator */}
                <span 
                  className={`absolute -bottom-1 left-0 right-0 h-[2.5px] transition-all duration-200 rounded-full ${
                    isActive ? 'bg-zinc-950 scale-x-100' : 'bg-transparent scale-x-0 group-hover:scale-x-100 group-hover:bg-zinc-300'
                  }`} 
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Quick Inquiry CTA & Admin Portal) */}
        <div className="hidden md:flex items-center gap-2">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-2 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer border border-zinc-200"
              title="관리자 창구 열기"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>관리자 창구</span>
              {isAdminLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          )}

          <button
            onClick={() => handleNavClick('contact')}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white transition-all shadow-2xs cursor-pointer"
          >
            <span>제작 문의</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-700 hover:text-zinc-950 rounded-lg focus:outline-none"
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer"
          className="md:hidden bg-white border-b border-zinc-200 px-6 py-5 space-y-4 shadow-xl"
        >
          <div className="flex flex-col space-y-1.5 pb-4 border-b border-zinc-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-base font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === item.id 
                    ? 'bg-zinc-100 text-zinc-950' 
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-1 space-y-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-center py-3 bg-zinc-950 text-white text-sm font-bold rounded-lg shadow-sm"
            >
              원스톱 상담 및 견적 문의
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-center py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg border border-zinc-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>관리자 창구</span>
                {isAdminLoggedIn && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            )}

            {/* Mobile Channel Links (네이버 블로그, 유튜브, 인스타그램 원형 아이콘) */}
            <div className="pt-2 flex items-center justify-center gap-4">
              {/* 네이버 블로그 */}
              <a
                href="https://blog.naver.com/braketime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="네이버 블로그 (새 창 열림)"
                title="네이버 블로그"
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-zinc-200/90 bg-white text-zinc-600 hover:text-[#03C75A] hover:border-[#03C75A]/40 hover:bg-[#03C75A]/5 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
              >
                <svg 
                  className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                <span className="sr-only">네이버 블로그</span>
              </a>

              {/* 유튜브 */}
              <a
                href="https://www.youtube.com/@esurizone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="유튜브 (새 창 열림)"
                title="유튜브"
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-zinc-200/90 bg-white text-zinc-600 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
              >
                <i className="fa-brands fa-youtube text-lg group-hover:scale-110 transition-transform"></i>
                <span className="sr-only">유튜브</span>
              </a>

              {/* 인스타그램 */}
              <a
                href="https://www.instagram.com/wonjuvm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램 (새 창 열림)"
                title="인스타그램"
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-zinc-200/90 bg-white text-zinc-600 hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
              >
                <i className="fa-brands fa-instagram text-lg group-hover:scale-110 transition-transform"></i>
                <span className="sr-only">인스타그램</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
