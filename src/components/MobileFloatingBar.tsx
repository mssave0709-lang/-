import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const MobileFloatingBar: React.FC = () => {
  return (
    <div 
      id="mobile-floating-contact-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-2.5 shadow-lg safe-area-bottom"
    >
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <a
          href="tel:010-8611-9062"
          id="floating-btn-phone"
          className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-100 active:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg border border-zinc-200 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-zinc-600" />
          <span>전화 상담</span>
        </a>

        <a
          href="https://open.kakao.com/o/gBN1MNIi"
          target="_blank"
          rel="noopener noreferrer"
          id="floating-btn-kakao"
          className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-950 active:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>카톡 문의</span>
        </a>
      </div>
    </div>
  );
};
