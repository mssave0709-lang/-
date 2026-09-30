import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { SimpleInquiryForm } from '../types';
import { saveInquiry } from '../utils/inquiryStorage';
import { NaverMapSection } from './NaverMapSection';

interface ContactFormProps {
  prefilledMessage?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ prefilledMessage }) => {
  const [formData, setFormData] = useState<SimpleInquiryForm>({
    nameOrStore: '',
    phone: '',
    message: prefilledMessage || ''
  });

  useEffect(() => {
    if (prefilledMessage) {
      setFormData(prev => ({
        ...prev,
        message: prefilledMessage
      }));
    }
  }, [prefilledMessage]);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameOrStore.trim() || !formData.phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      saveInquiry({
        nameOrStore: formData.nameOrStore,
        phone: formData.phone,
        message: formData.message
      });
    } catch (err) {
      console.error('Error saving inquiry:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <section 
      id="contact-section"
      className="py-16 sm:py-24 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            Get In Touch
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            프로젝트 의뢰 및 협업 문의
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-md mx-auto">
            새로운 영상 제작, 브랜드 모션, 디스플레이 콘텐츠 등 편하게 문의를 남겨주시면 빠르게 회신드리겠습니다.
          </p>
        </div>

        {/* 네이버 지도 (강원필링라이프 위치) */}
        <NaverMapSection />

        {/* Quick Direct Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Direct Phone */}
          <a
            href="tel:010-8611-9062"
            id="btn-direct-phone-call"
            className="p-5 bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200 rounded-xl transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500">유선 직통 문의</div>
                <div className="text-base font-bold text-zinc-950">010-8611-9062</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </a>

          {/* KakaoTalk */}
          <a
            href="https://open.kakao.com/o/gBN1MNIi"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-direct-kakaotalk"
            className="p-5 bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200 rounded-xl transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500">실시간 상담</div>
                <div className="text-base font-bold text-zinc-950">카카오톡 1:1 문의</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </a>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950">
                문의가 접수되었습니다
              </h3>
              <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                남겨주신 연락처로 담당자가 확인 후 신속하게 연락드리겠습니다.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ nameOrStore: '', phone: '', message: '' });
                  }}
                  className="px-4 py-2 bg-zinc-100 text-zinc-800 font-semibold rounded-lg text-xs hover:bg-zinc-200 transition-colors"
                >
                  추가 문의 작성하기
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="input-nameOrStore"
                    className="block text-xs font-mono font-bold text-zinc-700 mb-1.5"
                  >
                    성함 또는 기업/매장명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-nameOrStore"
                    type="text"
                    required
                    value={formData.nameOrStore}
                    onChange={(e) => setFormData({ ...formData, nameOrStore: e.target.value })}
                    placeholder="홍길동 (또는 브랜드명)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="input-phone"
                    className="block text-xs font-mono font-bold text-zinc-700 mb-1.5"
                  >
                    연락처 (전화번호 / 이메일) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-phone"
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="input-message"
                  className="block text-xs font-mono font-bold text-zinc-700 mb-1.5"
                >
                  프로젝트 내용 또는 문의 사항
                </label>
                <textarea
                  id="input-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="제작 희망 영상 종류, 일정, 레퍼런스 등 자유롭게 적어주세요."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? (
                    <span>전송 중...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>문의 접수하기</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
