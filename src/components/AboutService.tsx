import React from 'react';
import { 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutServiceProps {
  onSelectServiceForInquiry?: (serviceName: string) => void;
  onExploreWork?: () => void;
}

export const AboutService: React.FC<AboutServiceProps> = ({ 
  onSelectServiceForInquiry
}) => {
  // 5-Step Production Workflow (5단계 프로세스)
  const processSteps = [
    {
      step: 'STEP 01',
      title: '카카오톡 문의 & 설문 접수',
      badge: null,
      enTitle: 'Contact & Survey',
      desc: '카카오톡 채널로 문의 주시면 간단한 설문지를 보내드립니다. 업종, 매장 환경, 원하시는 영상 방향을 편하게 적어주세요.'
    },
    {
      step: 'STEP 02',
      title: '24시간 내 1:1 상담',
      badge: '24H',
      enTitle: 'Quick Response',
      desc: '설문 내용을 바탕으로 24시간 안에 연락드려 업종과 필요를 파악하고, 현장 컨설팅 일정을 잡습니다.'
    },
    {
      step: 'STEP 03',
      title: '현장 컨설팅',
      badge: '방문',
      enTitle: 'On-site Consulting',
      desc: '직접 매장을 방문해 공간, 조명, 모니터 위치, 손님 동선을 확인하고 사장님의 이야기를 듣습니다.'
    },
    {
      step: 'STEP 04',
      title: '견적 & 계약',
      badge: null,
      enTitle: 'Quote & Contract',
      desc: '제작 범위, 일정, 수정 횟수를 명확히 담은 견적서를 드리고, 확인 후 계약을 진행합니다.'
    },
    {
      step: 'STEP 05',
      title: '기획 · 제작 · 납품',
      badge: null,
      enTitle: 'Production & Delivery',
      desc: '콘티 확인, 촬영 및 AI 연출, 시안 검수를 거쳐 매장 모니터 규격에 딱 맞춘 최종 영상을 납품합니다.'
    }
  ];

  return (
    <div id="service-page" className="py-14 sm:py-20 bg-white text-zinc-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* =========================================================================
            제작 프로세스 (WORKFLOW PROCESS - 5단계 프로세스)
        ========================================================================= */}
        <section id="workflow-process">
          {/* Section Header */}
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="text-xs font-mono tracking-widest text-zinc-500 uppercase font-semibold mb-2">
              WORKFLOW PROCESS
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight mb-3">
              문의부터 납품까지, 5단계로 함께합니다
            </h3>
            <p className="text-base sm:text-[18px] text-[#555555] leading-relaxed font-normal break-keep">
              처음 문의하시는 순간부터 영상이 매장 모니터에 걸리는 날까지, 모든 과정을 투명하게 안내해 드립니다.
            </p>
          </div>

          {/* Cards Container: Desktop 5-columns, Tablet 2-columns, Mobile vertical timeline */}
          <div className="relative pl-7 sm:pl-0">
            {/* Mobile Vertical Timeline Connecting Line (640px 이하 모바일 전용) */}
            <div 
              className="sm:hidden absolute left-[11px] top-6 bottom-6 w-[2px] bg-zinc-200 pointer-events-none" 
              aria-hidden="true" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
              {processSteps.map((step, idx) => (
                <div key={step.step} className="relative flex">
                  {/* Mobile Timeline Dot on the vertical line (640px 이하 모바일 전용) */}
                  <div 
                    className="sm:hidden absolute -left-7 top-7 -translate-x-1/2 w-3 h-3 rounded-full bg-[#111111] border-2 border-white ring-1 ring-zinc-300 z-10" 
                    aria-hidden="true" 
                  />

                  {/* Card with Scroll Reveal & Hover interaction */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: idx * 0.1, ease: 'easeOut' }}
                    className="w-full bg-[#FAFAFA] hover:bg-white border border-[#E8E8E8] rounded-[24px] p-6 sm:p-7 flex flex-col justify-start transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg relative group cursor-default"
                  >
                    {/* STEP Number */}
                    <div className="font-mono text-[13px] text-[#888888] font-bold mb-2">
                      {step.step}
                    </div>

                    {/* Title + Optional Pill Badge */}
                    <div className="flex items-center flex-wrap gap-1.5 mb-1">
                      <h4 className="text-[19px] sm:text-[20px] font-extrabold text-[#111111] leading-snug break-keep">
                        {step.title}
                      </h4>
                      {step.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#111111] text-white shrink-0 shadow-2xs">
                          {step.badge}
                        </span>
                      )}
                    </div>

                    {/* English Subtitle */}
                    <div className="font-mono text-[13px] text-[#999999] mb-3">
                      {step.enTitle}
                    </div>

                    {/* Description */}
                    <p className="text-[15px] text-[#555555] leading-[1.75] break-keep">
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* Desktop Between-Card Arrow (→) - hidden on tablet & mobile */}
                  {idx < processSteps.length - 1 && (
                    <div 
                      className="hidden lg:flex absolute -right-[15px] top-1/2 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center text-zinc-300 pointer-events-none select-none"
                      aria-hidden="true"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Consultation Banner */}
          <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="text-xl sm:text-2xl font-black tracking-tight">
                어떤 미디어 솔루션이 우리 매장에 가장 적합할지 고민되시나요?
              </h4>
              <p className="text-sm text-zinc-400">
                매장 공간 구조와 디스플레이 환경에 맞춘 최적의 제작 견적을 1:1로 신속히 안내해 드립니다.
              </p>
            </div>
            <button
              onClick={() => onSelectServiceForInquiry?.('원스톱 맞춤 컨설팅')}
              className="px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold rounded-xl text-sm transition-all shrink-0 flex items-center gap-2 shadow-sm"
            >
              <span>1:1 맞춤 견적 상담받기</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
