import { ContactInquiry } from '../types';

const INQUIRIES_STORAGE_KEY = 'gfl_contact_inquiries_v2';

const SAMPLE_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-sample-1',
    nameOrStore: '원주 단계동 카페 르블랑',
    phone: '010-4321-9876',
    message: '안녕하세요. 신규 카페 오픈 준비 중인데 55인치 천장형 모니터 2대 설치와 시그니처 브런치 모션 메뉴보드 영상 제작 견적 문의드립니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'unread'
  },
  {
    id: 'inq-sample-2',
    nameOrStore: '춘천 강원 한우명가',
    phone: '010-8877-2233',
    message: '매장 입구 세로형 사이니지에 틀어둘 원산지 및 프리미엄 한우 홍보 숏폼 영상 제작 일정 상담 부탁드립니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'contacted'
  }
];

export const getInquiries = (): ContactInquiry[] => {
  try {
    const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load inquiries from localStorage:', e);
  }
  // Initialize with sample inquiries on first launch
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(SAMPLE_INQUIRIES));
  } catch {}
  return SAMPLE_INQUIRIES;
};

export const saveInquiry = (data: {
  nameOrStore: string;
  phone: string;
  message: string;
}): ContactInquiry => {
  const current = getInquiries();
  const now = new Date();
  const formattedDate = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    nameOrStore: data.nameOrStore.trim(),
    phone: data.phone.trim(),
    message: data.message.trim(),
    createdAt: formattedDate,
    status: 'unread'
  };

  const updated = [newInquiry, ...current];
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gfl_inquiry_updated'));
  } catch (e) {
    console.error('Failed to save inquiry to localStorage:', e);
  }

  return newInquiry;
};

export const updateInquiryStatus = (id: string, status: 'unread' | 'contacted'): ContactInquiry[] => {
  const current = getInquiries();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gfl_inquiry_updated'));
  } catch (e) {
    console.error('Failed to update inquiry status:', e);
  }
  return updated;
};

export const deleteInquiry = (id: string): ContactInquiry[] => {
  const current = getInquiries();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gfl_inquiry_updated'));
  } catch (e) {
    console.error('Failed to delete inquiry:', e);
  }
  return updated;
};
