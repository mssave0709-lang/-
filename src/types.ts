export type NavigationTab = 'home' | 'service' | 'work' | 'contact';

export type PortfolioCategory = string;
export type PortfolioItemCategory = string;

export interface PortfolioItem {
  id: string;
  badge: string; // e.g., '[광고]', '[숏폼]', '[디지털 메뉴보드]', '[인포그래픽]', '[영상 카드뉴스]', '[카드뉴스]'
  title: string; // e.g., '시그니처 브런치 & 커피 모션 메뉴보드'
  clientOrStore: string; // e.g., '카페 오브제'
  category: PortfolioItemCategory;
  targetIndustryTag: string; // e.g. '#카페/식당', '#병원/클리닉', '#학교/학원', '#뷰티/헤어'
  tags?: string[];
  duration: string; // e.g., '0:30 루프'
  videoFormat: string; // e.g., '16:9 4K UHD 가로형'
  summary: string;
  description: string;
  videoThumbnail: string; // 주요 영상 컷 / 썸네일
  videoUrl?: string; // 직접 첨부된 동영상 파일 또는 비디오 스트리밍 URL
  hasCustomVideo?: boolean; // 직접 첨부된 비디오 파일(IndexedDB 보관) 유무
  videoFrames: string[]; // 영상 주요 장면 스틸컷
  motionFeatures: string[]; // 모션 그래픽 및 영상 연출 포인트
  keyMessage?: string; // 핵심 전달 메시지 / 슬로건
  productionNotes?: string; // 제작 비하인드 및 연출 노트 (조명, 색감, 사운드 등)
  targetAudience?: string; // 송출 공간 추천 및 타겟 고객 가이드
  isDeleted?: boolean; // 휴지통 보관 여부 (1차 삭제)
  deletedAt?: string; // 휴지통 이동 일시
}

export interface SimpleInquiryForm {
  nameOrStore: string; // 성함 (또는 상호명)
  phone: string;       // 연락처
  message: string;     // 문의 내용
}

export interface ContactInquiry {
  id: string;
  nameOrStore: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'contacted';
  isDeleted?: boolean; // 휴지통 보관 여부 (1차 삭제)
  deletedAt?: string; // 휴지통 이동 일시
}
