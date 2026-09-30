import React from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

export const NaverMapSection: React.FC = () => {
  const naverMapUrl = 'https://map.naver.com/p/search/%EA%B0%95%EC%9B%90%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84%20%EC%B9%98%EC%95%85%EB%A1%9C%201719';

  return (
    <div className="mb-8 w-full">
      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200/90 shadow-sm bg-[#F4F6F8] group">
        
        {/* Top Info Bar (Naver Map Style Header) */}
        <div className="px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Naver N Logo Badge */}
            <div className="w-6 h-6 rounded-md bg-[#03C75A] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              N
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-950 truncate">강원필링라이프</span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                  네이버 지도
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate" title="강원특별자치도 치악로 1719, 2층">
                강원특별자치도 치악로 1719, 2층 (오프라인 매장/스튜디오)
              </p>
            </div>
          </div>

          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-[#03C75A] text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
            title="네이버 지도에서 길찾기 및 크게보기"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>네이버 지도 길찾기</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Realistic Naver Map Visual Canvas */}
        <a 
          href={naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[16/10] sm:aspect-[21/10] w-full select-none cursor-pointer overflow-hidden"
          title="클릭 시 네이버 지도로 이동합니다"
        >
          <svg
            viewBox="0 0 1000 580"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background (Naver map terrain color) */}
            <rect width="1000" height="580" fill="#F4F6F8" />

            {/* Water / Parks / Subtle Lot Boundaries */}
            <g stroke="#E3E8EC" strokeWidth="1" fill="none">
              <path d="M 0,180 L 220,130 L 260,260 L 0,320 Z" fill="#EEF2F5" />
              <path d="M 680,0 L 1000,0 L 1000,240 L 730,220 Z" fill="#EFF3F6" />
              <path d="M 620,380 L 1000,340 L 1000,580 L 680,580 Z" fill="#EEF2F5" />
            </g>

            {/* Minor residential paths & lot lines */}
            <g stroke="#E2E7EB" strokeWidth="1.5" fill="none">
              <line x1="0" y1="240" x2="310" y2="180" />
              <line x1="180" y1="140" x2="280" y2="480" />
              <line x1="530" y1="280" x2="700" y2="240" />
              <line x1="580" y1="360" x2="740" y2="330" />
              <line x1="600" y1="420" x2="880" y2="380" />
            </g>

            {/* Main Road: 치악로 (Diagonal Wide White Boulevard) */}
            <polygon
              points="240,0 470,0 550,580 370,580"
              fill="#FFFFFF"
              stroke="#D8DEE4"
              strokeWidth="1.5"
            />

            {/* Side Alley connecting to 치악로 (South-East) */}
            <polygon
              points="540,430 760,370 790,430 550,470"
              fill="#FFFFFF"
              stroke="#D8DEE4"
              strokeWidth="1.2"
            />
            {/* Side Alley (North-West) */}
            <polygon
              points="0,120 280,60 290,105 0,165"
              fill="#FFFFFF"
              stroke="#D8DEE4"
              strokeWidth="1.2"
            />

            {/* Pedestrian Crossing (Crosswalk zebra lines) */}
            <g stroke="#B8C1C9" strokeWidth="4" strokeLinecap="round">
              <line x1="315" y1="145" x2="330" y2="140" />
              <line x1="325" y1="142" x2="340" y2="137" />
              <line x1="335" y1="139" x2="350" y2="134" />
              <line x1="345" y1="136" x2="360" y2="131" />
              <line x1="355" y1="133" x2="370" y2="128" />
              <line x1="365" y1="130" x2="380" y2="125" />
              <line x1="375" y1="127" x2="390" y2="122" />
              <line x1="385" y1="124" x2="400" y2="119" />
              <line x1="395" y1="121" x2="410" y2="116" />
              <line x1="405" y1="118" x2="420" y2="113" />
            </g>

            {/* Road Label: 치악로 */}
            <g transform="translate(485, 465) rotate(78)">
              <text
                x="0"
                y="0"
                fill="#7E8A96"
                fontSize="14"
                fontWeight="500"
                fontFamily="sans-serif"
                letterSpacing="4"
              >
                치악로
              </text>
            </g>

            {/* Surrounding Buildings (Right Side) */}
            {/* Building 1: 대림소방 */}
            <polygon
              points="515,245 565,235 585,305 535,315"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            {/* Blue building badge: 대림소방 */}
            <circle cx="550" cy="275" r="9" fill="#5C88DE" />
            <rect x="546" y="271" width="8" height="8" rx="1" fill="#FFFFFF" />
            <text x="550" y="297" textAnchor="middle" fill="#586370" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              대림소방
            </text>

            {/* Building 2: 1718 */}
            <polygon
              points="555,330 620,315 635,380 570,395"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            <text x="595" y="360" textAnchor="middle" fill="#919DA9" fontSize="11" fontFamily="sans-serif">
              1718
            </text>

            {/* Building 3: 1716 & 정헤어라인 */}
            <polygon
              points="580,405 650,390 660,450 590,465"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            <text x="620" y="425" textAnchor="middle" fill="#919DA9" fontSize="11" fontFamily="sans-serif">
              1716
            </text>
            {/* 정헤어라인 shopping bag icon & text */}
            <circle cx="600" cy="445" r="8" fill="#F8B133" />
            <path d="M597,443 L603,443 L604,449 L596,449 Z" fill="#FFFFFF" />
            <text x="635" y="450" fill="#A83F8C" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              정헤어라인
            </text>
            <text x="675" y="450" fill="#919DA9" fontSize="10" fontFamily="sans-serif">
              1716-1
            </text>

            {/* Large Commercial Building 1724 */}
            <polygon
              points="670,225 790,200 835,400 715,425"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            <text x="750" y="320" textAnchor="middle" fill="#919DA9" fontSize="12" fontFamily="sans-serif">
              1724
            </text>

            {/* Commercial Building 1724-1 */}
            <polygon
              points="880,270 980,250 1000,340 900,360"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            <text x="940" y="315" textAnchor="middle" fill="#919DA9" fontSize="11" fontFamily="sans-serif">
              1724
            </text>

            {/* Top Right: 정문 */}
            <circle cx="450" cy="40" r="7" fill="#6A8098" />
            <text x="450" y="30" textAnchor="middle" fill="#606E7D" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              정문
            </text>

            {/* Bottom Right: 상가 */}
            <circle cx="715" cy="530" r="8" fill="#F8B133" />
            <text x="715" y="552" textAnchor="middle" fill="#7E6828" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              상가
            </text>

            {/* Bus Stop Icons on 치악로 */}
            {/* Bus Stop 1 (Near crosswalk, east side) */}
            <rect x="495" y="180" width="16" height="16" rx="3" fill="#4B90E2" />
            <rect x="498" y="184" width="10" height="7" rx="1" fill="#FFFFFF" />
            <circle cx="501" cy="193" r="1.2" fill="#FFFFFF" />
            <circle cx="505" cy="193" r="1.2" fill="#FFFFFF" />

            {/* Bus Stop 2 (South, east side) */}
            <rect x="410" y="445" width="16" height="16" rx="3" fill="#4B90E2" />
            <rect x="413" y="449" width="10" height="7" rx="1" fill="#FFFFFF" />
            <circle cx="416" cy="458" r="1.2" fill="#FFFFFF" />
            <circle cx="420" cy="458" r="1.2" fill="#FFFFFF" />

            {/* Surrounding Buildings (Left Side) */}
            {/* Building 1721 */}
            <polygon
              points="230,205 295,190 310,250 245,265"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            <text x="270" y="235" textAnchor="middle" fill="#8895A2" fontSize="11" fontFamily="sans-serif">
              1721
            </text>

            {/* ======================================================== */}
            {/* TARGET BUILDING: 강원필링라이프 (1719) */}
            {/* ======================================================== */}
            <polygon
              points="270,270 345,255 365,335 320,345 325,370 280,380"
              fill="#FFFFFF"
              stroke="#E85838"
              strokeWidth="1.8"
            />

            {/* Pulsing Target Highlight Ring */}
            <circle cx="325" cy="275" r="28" fill="#F25232" opacity="0.15" />
            <circle cx="325" cy="275" r="36" fill="#F25232" opacity="0.08" />

            {/* Naver Map Marker Pin */}
            <g transform="translate(325, 275)">
              {/* Pin Drop Shadow */}
              <ellipse cx="0" cy="12" rx="10" ry="4" fill="rgba(0,0,0,0.25)" />
              
              {/* Pin Body (Teardrop shape) */}
              <path
                d="M 0,10 C -12,2 -16,-6 -16,-14 C -16,-23 -9,-30 0,-30 C 9,-30 16,-23 16,-14 C 16,-6 12,2 0,10 Z"
                fill="#F25232"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              
              {/* White Shopping Cart Icon inside Pin */}
              <g transform="translate(-6.5, -20.5) scale(0.65)" fill="#FFFFFF">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </g>
            </g>

            {/* Main Label: 강원필링라이프 (High Visibility) */}
            <g transform="translate(325, 318)">
              {/* Text Outline for readability over any background */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinejoin="round"
                fontSize="15"
                fontWeight="900"
                fontFamily="Pretendard, -apple-system, sans-serif"
              >
                강원필링라이프
              </text>
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#18181B"
                fontSize="15"
                fontWeight="900"
                fontFamily="Pretendard, -apple-system, sans-serif"
              >
                강원필링라이프
              </text>
            </g>

            {/* Address sub-label under pin */}
            <g transform="translate(325, 336)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinejoin="round"
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                치악로 1719 (2층)
              </text>
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#E85838"
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                치악로 1719 (2층)
              </text>
            </g>

            {/* Additional Left Neighborhood Buildings */}
            <polygon
              points="0,210 65,195 85,340 0,360"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
            <polygon
              points="80,50 170,30 200,160 110,180"
              fill="#FFFFFF"
              stroke="#CCD3DA"
              strokeWidth="1"
            />
          </svg>

          {/* Interactive Hover Overlay Banner */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/85 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 duration-200">
              <MapPin className="w-3.5 h-3.5 text-[#03C75A]" />
              <span>네이버 지도에서 위치 열기</span>
            </span>
          </div>

          {/* Naver Map Visual UI Elements (Compass & Zoom Buttons) */}
          <div className="absolute right-3.5 top-3.5 flex flex-col gap-1 shadow-sm select-none pointer-events-none">
            <div className="w-7 h-7 bg-white rounded border border-zinc-300 flex items-center justify-center text-zinc-700 text-xs font-bold shadow-xs">
              +
            </div>
            <div className="w-7 h-7 bg-white rounded border border-zinc-300 flex items-center justify-center text-zinc-700 text-xs font-bold shadow-xs">
              -
            </div>
          </div>

          {/* Bottom Scale & Naver Watermark */}
          <div className="absolute bottom-2.5 right-3.5 flex items-center gap-2 text-[10px] text-zinc-500 font-mono select-none pointer-events-none bg-white/70 px-2 py-0.5 rounded backdrop-blur-xs">
            <span className="font-bold text-emerald-600">NAVER</span>
            <span>20m</span>
          </div>
        </a>

        {/* Bottom Location Address Bar */}
        <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="font-bold text-zinc-900">도로명 주소:</span>
            <span>강원특별자치도 치악로 1719, 2층 강원필링라이프</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            * 방문 상담 및 현장 미팅은 사전 예약제로 진행됩니다.
          </span>
        </div>

      </div>
    </div>
  );
};
