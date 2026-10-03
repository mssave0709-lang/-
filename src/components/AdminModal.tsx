import React, { useState, useRef, useEffect } from 'react';
import { PortfolioItem, PortfolioItemCategory, ContactInquiry } from '../types';
import { PORTFOLIO_ITEMS as DEFAULT_PORTFOLIO_ITEMS } from '../data/portfolioData';
import { 
  Lock, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  Film,
  Eye,
  LogOut,
  Save,
  CheckCircle2,
  Tag,
  Search,
  Sparkles,
  Upload,
  FileVideo,
  Camera,
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Play,
  Pause,
  Layers,
  FileCheck,
  RefreshCw,
  MessageSquare,
  PhoneCall,
  Copy,
  Download,
  Clock,
  User,
  Inbox,
  CheckCheck,
  Monitor,
  Code,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  compressImageFile, 
  captureVideoFrame, 
  readFileAsDataUrl, 
  formatFileSize 
} from '../utils/fileHelpers';
import { saveVideoBlob, deleteVideoBlob } from '../utils/indexedDbHelper';
import { 
  getInquiries, 
  updateInquiryStatus, 
  trashInquiry, 
  restoreInquiry, 
  permanentlyDeleteInquiry, 
  emptyInquiryTrash, 
  restoreAllInquiryTrash,
  deleteInquiry 
} from '../utils/inquiryStorage';
import { 
  DEFAULT_PORTFOLIO_CATEGORIES, 
  getStoredCustomCategories, 
  saveStoredCustomCategories 
} from '../utils/categoryStorage';
import { parseVideoUrl } from '../utils/videoHelper';

export const ALL_INDUSTRY_CATEGORIES = [
  {
    group: 'IT · 소프트웨어 · 테크',
    options: [
      '[IT/소프트웨어]',
      '[테크/하드웨어]',
      '[AI/솔루션]',
      '[앱/플랫폼]',
      '[이커머스/웹]',
      '[클라우드/SaaS]',
      '[블록체인/핀테크]',
      '[게임/메타버스]'
    ]
  },
  {
    group: '농업 · 축산 · 수산 · 스마트팜',
    options: [
      '[농업/스마트팜]',
      '[특산물/로컬푸드]',
      '[원예/화훼/임업]',
      '[축산/낙농/한우]',
      '[수산/양식/해양]',
      '[친환경/유기농]'
    ]
  },
  {
    group: '제조 · 엔지니어링 · 친환경',
    options: [
      '[제조/생산]',
      '[스마트팩토리/로봇]',
      '[기계/엔지니어링]',
      '[건설/인테리어]',
      '[물류/유통/운송]',
      '[에너지/친환경/ESG]'
    ]
  },
  {
    group: '식음료 · F&B · 카페 · 외식',
    options: [
      '[식음료]',
      '[카페/음료]',
      '[베이커리/디저트]',
      '[레스토랑/외식]',
      '[다이닝/파인다이닝]',
      '[티하우스/전통차]',
      '[주류/와인/펍]',
      '[프랜차이즈F&B]'
    ]
  },
  {
    group: '뷰티 · 패션 · 라이프스타일',
    options: [
      '[뷰티/코스메틱]',
      '[헤어/에스테틱]',
      '[패션/의류/잡화]',
      '[라이프스타일/리빙]',
      '[반려동물/펫]',
      '[가구/홈데코]'
    ]
  },
  {
    group: '의료 · 헬스 · 바이오',
    options: [
      '[의료/병원/클리닉]',
      '[바이오/제약/헬스케어]',
      '[피트니스/필라테스]',
      '[치과/안과/전문병원]',
      '[웰니스/실버케어]'
    ]
  },
  {
    group: '교육 · 공공 · 문화 · 관광',
    options: [
      '[교육/에듀테크]',
      '[공공/지자체/관공서]',
      '[문화/전시/공연]',
      '[관광/지역축제/여행]',
      '[호텔/리조트/숙박]',
      '[스포츠/레저]'
    ]
  },
  {
    group: '기업홍보 · 비즈니스 · 금융',
    options: [
      '[기업홍보/브랜딩]',
      '[스타트업/IR/피칭]',
      '[금융/보험/핀테크]',
      '[부동산/분양/시행]',
      '[전문서비스/법률/세무]'
    ]
  },
  {
    group: '매장 디스플레이 · 오프라인 공간',
    options: [
      '[매장디스플레이/사이니지]',
      '[쇼룸/팝업스토어]',
      '[일반매장/소매점]',
      '[무인매장/키오스크]'
    ]
  }
];

interface ConfirmDialogState {
  isOpen: boolean;
  type: 
    | 'trash_item'
    | 'permanent_delete_item'
    | 'empty_video_trash'
    | 'trash_inquiry'
    | 'permanent_delete_inquiry'
    | 'empty_inquiry_trash'
    | 'reset_defaults'
    | 'discard_changes'
    | 'delete_category';
  title: string;
  itemTitle: string;
  itemSubtitle?: string;
  warningText: string;
  confirmLabel: string;
  confirmColor?: 'red' | 'amber' | 'zinc';
  onConfirm: () => void | Promise<void>;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PortfolioItem[];
  onSaveItems: (updatedItems: PortfolioItem[]) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  customCategories?: string[];
  onSaveCustomCategories?: (categories: string[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  items,
  onSaveItems,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  customCategories,
  onSaveCustomCategories
}) => {
  // Category management panel state
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');

  // Combined categories list: 관리자가 자유롭게 생성/삭제/관리하는 카테고리 전체 목록
  const allCategories = React.useMemo(() => {
    const list: string[] = [];
    const categorySet = new Set<string>();

    const managedList = customCategories || getStoredCustomCategories();
    managedList.forEach((c) => {
      const trimmed = c.trim();
      if (trimmed && !categorySet.has(trimmed)) {
        categorySet.add(trimmed);
        list.push(trimmed);
      }
    });

    // 기존 등록된 영상들 중 아직 남아있는 카테고리가 있다면 관리자가 인지하고 삭제/재분류할 수 있도록 목록에 노출
    items.forEach((item) => {
      const trimmed = item.category?.trim();
      if (trimmed && !categorySet.has(trimmed)) {
        categorySet.add(trimmed);
        list.push(trimmed);
      }
    });

    return list;
  }, [items, customCategories]);

  // Data Export / Code Sync Modal State
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);
  const [copiedDataSuccess, setCopiedDataSuccess] = useState<boolean>(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [exportTab, setExportTab] = useState<'single' | 'all'>('single');
  const [exportSearchQuery, setExportSearchQuery] = useState<string>('');
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);

  // Authentication state
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Editing state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);

  // List search & category filter in admin
  const [listFilterCategory, setListFilterCategory] = useState<string>('전체');
  const [listSearchQuery, setListSearchQuery] = useState<string>('');

  // Form field states for editing/creating
  const [formBadge, setFormBadge] = useState<string>('[IT/소프트웨어]');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formClientOrStore, setFormClientOrStore] = useState<string>('');
  const [formCategory, setFormCategory] = useState<PortfolioItemCategory>('디지털 메뉴보드');
  const [formIndustryTag, setFormIndustryTag] = useState<string>('#카페/식당');
  const [formDuration, setFormDuration] = useState<string>('0:30 무한 루프');
  const [formVideoFormat, setFormVideoFormat] = useState<string>('16:9 FHD (1920×1080)');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formKeyMessage, setFormKeyMessage] = useState<string>('');
  const [formProductionNotes, setFormProductionNotes] = useState<string>('');
  const [formTargetAudience, setFormTargetAudience] = useState<string>('');

  // 1. Thumbnail Media state
  const [formThumbnail, setFormThumbnail] = useState<string>('');
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('upload');
  const [thumbnailFileName, setThumbnailFileName] = useState<string>('');
  const [isProcessingThumbnail, setIsProcessingThumbnail] = useState<boolean>(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // 2. Video Attachment state
  const [formVideoUrl, setFormVideoUrl] = useState<string>('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoFileSize, setVideoFileSize] = useState<string>('');
  const [pendingVideoBlob, setPendingVideoBlob] = useState<Blob | null>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState<boolean>(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // 3. Video Frames / Still Cuts state
  const [formFrames, setFormFrames] = useState<string[]>([]);
  const [framesMode, setFramesMode] = useState<'upload' | 'url'>('upload');
  const [formFramesText, setFormFramesText] = useState<string>('');
  const [isProcessingFrames, setIsProcessingFrames] = useState<boolean>(false);
  const framesInputRef = useRef<HTMLInputElement>(null);

  const [formFeaturesText, setFormFeaturesText] = useState<string>('');

  // Toast / Status state
  const [successToast, setSuccessToast] = useState<string>('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast('');
    }, 3200);
  };

  // Helper to sanitize an item for clipboard copying / code persistence
  const getSanitizedItemForCopy = (item: PortfolioItem) => {
    if (item.videoUrl && (item.videoUrl.startsWith('blob:') || item.videoUrl.startsWith('data:video/'))) {
      return {
        ...item,
        hasCustomVideo: true,
        videoUrl: undefined
      };
    }
    return item;
  };

  const activeVideosJson = React.useMemo(() => {
    const activeItems = items.filter(i => !i.isDeleted);
    const sanitized = activeItems.map(getSanitizedItemForCopy);
    return JSON.stringify(sanitized, null, 2);
  }, [items]);

  const handleCopySingleItem = (item: PortfolioItem) => {
    try {
      const sanitized = getSanitizedItemForCopy(item);
      const singleJson = JSON.stringify(sanitized, null, 2);
      navigator.clipboard.writeText(singleJson);
      setCopiedItemId(item.id);
      showToast(`'${item.title}' 영상 데이터가 클립보드에 복사되었습니다! AI Studio 대화창에 붙여넣어 주세요.`);
      setTimeout(() => {
        setCopiedItemId((current) => (current === item.id ? null : current));
      }, 3000);
    } catch {
      showToast('텍스트 창을 클릭하여 전체 선택 후 복사(Ctrl+C)해주세요.');
    }
  };

  const handleCopyExportData = () => {
    try {
      navigator.clipboard.writeText(activeVideosJson);
      setCopiedDataSuccess(true);
      showToast('전체 영상 데이터(JSON)가 복사되었습니다! AI Studio 대화창에 붙여넣어 주세요.');
      setTimeout(() => setCopiedDataSuccess(false), 3000);
    } catch {
      showToast('텍스트 창을 전체 선택(Ctrl+A) 후 복사(Ctrl+C)해주세요.');
    }
  };

  const handleDownloadExportData = () => {
    try {
      const blob = new Blob([activeVideosJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gangwon_portfolio_data_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('데이터 백업 파일이 다운로드되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('다운로드 처리 중 오류가 발생했습니다.');
    }
  };

  // Custom in-app Confirmation Dialog state (replaces window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  // Top admin section tab: 'portfolio' | 'inquiries' | 'trash'
  const [adminTab, setAdminTab] = useState<'portfolio' | 'inquiries' | 'trash'>('portfolio');
  const [trashSubTab, setTrashSubTab] = useState<'portfolio' | 'inquiries'>('portfolio');

  // Inquiries state
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => getInquiries());
  const [inquirySearch, setInquirySearch] = useState<string>('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'unread' | 'contacted'>('all');

  // Portfolio items separation (Active vs Trashed)
  const activePortfolioItems = items.filter(i => !i.isDeleted);
  const trashedPortfolioItems = items.filter(i => i.isDeleted);

  // Inquiries separation (Active vs Trashed)
  const activeInquiries = inquiries.filter(i => !i.isDeleted);
  const trashedInquiries = inquiries.filter(i => i.isDeleted);

  const unreadCount = activeInquiries.filter(i => i.status === 'unread').length;
  const trashedVideosCount = trashedPortfolioItems.length;
  const trashedInquiriesCount = trashedInquiries.length;
  const totalTrashCount = trashedVideosCount + trashedInquiriesCount;

  const reloadInquiries = () => {
    setInquiries(getInquiries());
  };

  useEffect(() => {
    const handleUpdate = () => {
      reloadInquiries();
    };
    window.addEventListener('gfl_inquiry_updated', handleUpdate);
    return () => window.removeEventListener('gfl_inquiry_updated', handleUpdate);
  }, []);

  const handleToggleInquiryStatus = (id: string, currentStatus: 'unread' | 'contacted') => {
    const nextStatus = currentStatus === 'unread' ? 'contacted' : 'unread';
    const updated = updateInquiryStatus(id, nextStatus);
    setInquiries(updated);
    showToast(nextStatus === 'contacted' ? '상담 완료 상태로 변경되었습니다.' : '미확인 상태로 변경되었습니다.');
  };

  // 1차 삭제: 고객 문의를 휴지통으로 이동
  const handleRequestTrashInquiry = (inq: ContactInquiry) => {
    setConfirmDialog({
      isOpen: true,
      type: 'trash_inquiry',
      title: '문의 내역 휴지통 이동 (1차 삭제)',
      itemTitle: `'${inq.nameOrStore}' 님의 문의`,
      itemSubtitle: `연락처: ${inq.phone} (${inq.createdAt})`,
      warningText: '해당 문의 내역을 휴지통으로 이동하시겠습니까? 메인 목록에서 숨겨지며, [휴지통] 탭에서 언제든지 복원하거나 영구 삭제할 수 있습니다.',
      confirmLabel: '휴지통으로 이동',
      confirmColor: 'amber',
      onConfirm: () => {
        const updated = trashInquiry(inq.id);
        setInquiries(updated);
        showToast(`'${inq.nameOrStore}' 님의 문의가 휴지통으로 이동되었습니다.`);
        setConfirmDialog(null);
      }
    });
  };

  const handleCopyPhone = (phone: string) => {
    try {
      navigator.clipboard.writeText(phone);
      showToast(`연락처(${phone})가 클립보드에 복사되었습니다.`);
    } catch {
      showToast(`연락처: ${phone}`);
    }
  };

  // Prevent accidental drag-and-drop file opening in browser
  React.useEffect(() => {
    const handleDragPrevent = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener('dragover', handleDragPrevent);
    window.addEventListener('drop', handleDragPrevent);
    return () => {
      window.removeEventListener('dragover', handleDragPrevent);
      window.removeEventListener('drop', handleDragPrevent);
    };
  }, []);

  const handleSafeClose = () => {
    if (isEditing) {
      setConfirmDialog({
        isOpen: true,
        type: 'discard_changes',
        title: '작업 내용 닫기',
        itemTitle: isNewItem ? '새 작업 영상 작성 중' : `'${editingItem?.title}' 수정 중`,
        itemSubtitle: '저장하지 않은 입력 내용과 첨부 파일이 모두 취소됩니다.',
        warningText: '저장하지 않고 창을 닫으시겠습니까?',
        confirmLabel: '저장 안 하고 닫기',
        onConfirm: () => {
          setIsEditing(false);
          setEditingItem(null);
          setConfirmDialog(null);
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    handleSafeClose();
  };

  if (!isOpen) return null;

  // Thumbnail File Upload Handler
  const handleThumbnailFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG, WebP 등)을 선택해주세요.');
      return;
    }
    try {
      setIsProcessingThumbnail(true);
      const compressed = await compressImageFile(file, 960, 540, 0.76);
      setFormThumbnail(compressed);
      setThumbnailFileName(file.name);
      showToast(`'${file.name}' 대표 썸네일 이미지가 직접 첨부되었습니다.`);
    } catch (e) {
      console.error(e);
      showToast('썸네일 이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingThumbnail(false);
    }
  };

  // Video File Upload Handler
  const handleVideoFileSelect = async (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|ogg|m4v|avi|mkv)$/i)) {
      showToast('동영상 파일(MP4, WebM, MOV 등)을 선택해주세요.');
      return;
    }
    try {
      setIsProcessingVideo(true);
      // Fast, zero-memory object URL prevents memory crashes and provides instant playback
      const objectUrl = URL.createObjectURL(file);
      setFormVideoUrl(objectUrl);
      setPendingVideoBlob(file);
      setVideoFileName(file.name);
      setVideoFileSize(formatFileSize(file.size));
      showToast(`'${file.name}' 동영상 파일이 직접 첨부되었습니다. 재생 확인 가능합니다.`);
    } catch (e) {
      console.error(e);
      showToast('동영상 파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingVideo(false);
    }
  };

  // Capture frame from active playing video as thumbnail
  const handleCaptureVideoThumbnail = () => {
    if (!videoPreviewRef.current) {
      showToast('비디오 플레이어를 찾을 수 없습니다.');
      return;
    }
    const captured = captureVideoFrame(videoPreviewRef.current);
    if (captured) {
      setFormThumbnail(captured);
      setThumbnailFileName('동영상 현재 프레임 캡처본');
      showToast('영상의 현재 화면이 대표 썸네일로 자동 추출되었습니다!');
    } else {
      showToast('영상을 재생 중인 상태에서 캡처 버튼을 눌러주세요.');
    }
  };

  // Still Cuts Multi-File Upload Handler
  const handleStillCutFilesSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      showToast('이미지 파일(JPG, PNG, WebP 등)을 선택해주세요.');
      return;
    }
    try {
      setIsProcessingFrames(true);
      const newUrls: string[] = [];
      for (const f of imageFiles) {
        const compressed = await compressImageFile(f, 960, 540, 0.76);
        newUrls.push(compressed);
      }
      const updated = [...formFrames, ...newUrls];
      setFormFrames(updated);
      setFormFramesText(updated.join('\n'));
      showToast(`${imageFiles.length}개의 스틸컷 이미지가 성공적으로 추가 첨부되었습니다.`);
    } catch (e) {
      console.error(e);
      showToast('스틸컷 이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingFrames(false);
    }
  };

  const handleRemoveStillCut = (idxToRemove: number) => {
    const updated = formFrames.filter((_, idx) => idx !== idxToRemove);
    setFormFrames(updated);
    setFormFramesText(updated.join('\n'));
    showToast('스틸컷이 삭제되었습니다.');
  };

  const handleMoveStillCut = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formFrames.length) return;
    const updated = [...formFrames];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormFrames(updated);
    setFormFramesText(updated.join('\n'));
  };

  const handleSetFrameAsThumbnail = (frameUrl: string) => {
    setFormThumbnail(frameUrl);
    setThumbnailFileName('선택한 스틸컷에서 설정된 썸네일');
    showToast('해당 스틸컷이 대표 썸네일로 지정되었습니다.');
  };

  // Password verification (Set to f22ling2011)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'f22ling2011') {
      setIsAdminLoggedIn(true);
      setAuthError('');
      setPasswordInput('');
      showToast('관리자 인증이 완료되었습니다.');
    } else {
      setAuthError('비밀번호가 올바르지 않습니다. 다시 입력해주세요.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsEditing(false);
    setEditingItem(null);
    setPasswordInput('');
  };

  // Open Create Form
  const handleStartCreate = () => {
    setIsNewItem(true);
    setEditingItem(null);
    setFormBadge('[디지털 메뉴보드]');
    setFormTitle('');
    setFormClientOrStore('');
    setFormCategory('디지털 메뉴보드');
    setFormIndustryTag('#카페/식당');
    setFormDuration('0:30 무한 루프');
    setFormVideoFormat('16:9 4K UHD 가로형');
    setFormSummary('');
    setFormDescription('');
    setFormKeyMessage('');
    setFormProductionNotes('');
    setFormTargetAudience('');
    setFormThumbnail('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop');
    setThumbnailFileName('');
    setThumbnailMode('upload');
    setFormVideoUrl('');
    setVideoFileName('');
    setVideoFileSize('');
    setPendingVideoBlob(null);
    setVideoMode('upload');
    const defaultFrames = [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop'
    ];
    setFormFrames(defaultFrames);
    setFormFramesText(defaultFrames.join('\n'));
    setFramesMode('upload');
    setFormFeaturesText([
      '핵심 비주얼과 메뉴 정보를 직관적으로 보여주는 키네틱 모션',
      '부드러운 화면 전환과 가독성 높은 폰트 타이포그래피',
      '매장 디스플레이 및 디지털 DID 최적화'
    ].join('\n'));
    setIsEditing(true);
  };

  // Open Edit Form for an existing item
  const handleStartEdit = (item: PortfolioItem) => {
    setIsNewItem(false);
    setEditingItem(item);
    setFormBadge(item.badge);
    setFormTitle(item.title);
    setFormClientOrStore(item.clientOrStore);
    setFormCategory(item.category || '디지털 메뉴보드');
    setFormIndustryTag(item.targetIndustryTag || '#카페/식당');
    setFormDuration(item.duration);
    setFormVideoFormat(item.videoFormat);
    setFormSummary(item.summary);
    setFormDescription(item.description);
    setFormKeyMessage(item.keyMessage || '');
    setFormProductionNotes(item.productionNotes || '');
    setFormTargetAudience(item.targetAudience || '');
    setFormThumbnail(item.videoThumbnail);
    setThumbnailFileName('');
    setThumbnailMode('upload');
    setFormVideoUrl(item.videoUrl || '');
    setVideoFileName(item.videoUrl ? '첨부된 동영상 파일' : '');
    setVideoFileSize('');
    setPendingVideoBlob(null);
    setVideoMode('upload');
    const frames = item.videoFrames || [];
    setFormFrames(frames);
    setFormFramesText(frames.join('\n'));
    setFramesMode('upload');
    setFormFeaturesText((item.motionFeatures || []).join('\n'));
    setIsEditing(true);
  };

  // Save the created or edited item safely
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formClientOrStore.trim()) {
      showToast('영상 제목과 기업/상호명을 입력해주세요.');
      return;
    }

    try {
      const parsedFrames = formFrames.length > 0 
        ? formFrames 
        : formFramesText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

      const parsedFeatures = formFeaturesText
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const targetId = isNewItem 
        ? `video-${Date.now()}` 
        : (editingItem ? editingItem.id : `video-${Date.now()}`);

      // If a new video file was attached, save it safely to IndexedDB
      let finalHasCustomVideo = editingItem?.hasCustomVideo || false;
      if (pendingVideoBlob) {
        try {
          await saveVideoBlob(targetId, pendingVideoBlob);
          finalHasCustomVideo = true;
        } catch (dbErr) {
          console.warn('IndexedDB persistence warning (browser session fallback active):', dbErr);
        }
      }

      const updatedItem: PortfolioItem = {
        id: targetId,
        badge: formBadge.trim() || `[${formCategory}]`,
        title: formTitle.trim(),
        clientOrStore: formClientOrStore.trim(),
        category: formCategory,
        targetIndustryTag: formIndustryTag.trim() || '#맞춤제작',
        tags: [formIndustryTag.trim() || '#맞춤제작', formCategory],
        duration: formDuration.trim() || '0:30 루프',
        videoFormat: formVideoFormat.trim() || '16:9 가로형',
        summary: formSummary.trim() || formTitle.trim(),
        description: formDescription.trim() || formSummary.trim(),
        keyMessage: formKeyMessage.trim() || undefined,
        productionNotes: formProductionNotes.trim() || undefined,
        targetAudience: formTargetAudience.trim() || undefined,
        videoThumbnail: formThumbnail.trim() || (parsedFrames[0] || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop'),
        videoUrl: formVideoUrl.trim() || undefined,
        hasCustomVideo: finalHasCustomVideo,
        videoFrames: parsedFrames.length > 0 ? parsedFrames : [formThumbnail.trim() || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop'],
        motionFeatures: parsedFeatures.length > 0 ? parsedFeatures : ['맞춤 모션 그래픽 연출', '선명한 60fps 고화질 영상']
      };

      let newItemsList: PortfolioItem[];
      if (isNewItem) {
        newItemsList = [updatedItem, ...items];
        showToast(`'${updatedItem.title}' 작업영상이 성공적으로 등록되었습니다.`);
      } else {
        newItemsList = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        showToast(`'${updatedItem.title}' 작업영상이 성공적으로 수정되었습니다.`);
      }

      // 새 카테고리인 경우 카테고리 목록에 자동 추가 (홈페이지 작업물 탭에 즉시 생성 연동)
      const trimmedCategory = formCategory.trim();
      if (trimmedCategory) {
        const currentCustom = customCategories || getStoredCustomCategories();
        if (!currentCustom.includes(trimmedCategory)) {
          const updatedCustom = [...currentCustom, trimmedCategory];
          if (onSaveCustomCategories) {
            onSaveCustomCategories(updatedCustom);
          } else {
            saveStoredCustomCategories(updatedCustom);
          }
        }
      }

      onSaveItems(newItemsList);
      setPendingVideoBlob(null);
      setIsEditing(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving portfolio form:', err);
      showToast('저장 처리 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 새 카테고리 직접 추가 핸들러
  const handleAddNewCategory = (catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) {
      showToast('추가할 카테고리 이름을 입력해주세요.');
      return;
    }
    if (allCategories.includes(trimmed)) {
      showToast(`'${trimmed}' 카테고리는 이미 존재합니다.`);
      return;
    }

    const currentCustom = customCategories || getStoredCustomCategories();
    const updated = [...currentCustom, trimmed];
    if (onSaveCustomCategories) {
      onSaveCustomCategories(updated);
    } else {
      saveStoredCustomCategories(updated);
    }
    setNewCategoryInput('');
    showToast(`'${trimmed}' 카테고리가 생성되었습니다. 홈페이지 '작업물' 탭에 즉시 반영됩니다.`);
  };

  // 커스텀 / 잘못 생성된 카테고리 완전 삭제 핸들러 (연결된 영상도 안전하게 재분류하여 잔여 카테고리 영구 제거)
  const handleRemoveCategory = (catName: string) => {
    const affectedItems = items.filter(i => i.category === catName);
    const affectedCount = affectedItems.length;

    setConfirmDialog({
      isOpen: true,
      type: 'delete_category',
      title: '카테고리 삭제',
      itemTitle: `'${catName}' 카테고리 삭제`,
      itemSubtitle: affectedCount > 0 
        ? `현재 이 카테고리로 지정된 작업 영상이 총 ${affectedCount}개 있습니다.` 
        : '현재 연결된 영상이 없습니다.',
      warningText: affectedCount > 0 
        ? `'${catName}' 카테고리를 완전히 삭제하시겠습니까? 연결된 영상 ${affectedCount}개는 남은 카테고리로 안전하게 자동 재지정되며, 홈페이지 '작업물' 탭 및 영상 관리 필터에서 완전히 삭제됩니다.`
        : `'${catName}' 카테고리를 완전히 삭제하시겠습니까? 홈페이지 '작업물' 탭 필터 목록에서 즉시 완전히 제거됩니다.`,
      confirmLabel: '카테고리 완전 삭제',
      confirmColor: 'red',
      onConfirm: () => {
        // 1. 카테고리 목록에서 제거
        const currentCustom = customCategories || getStoredCustomCategories();
        const updatedCustom = currentCustom.filter(c => c !== catName);
        if (onSaveCustomCategories) {
          onSaveCustomCategories(updatedCustom);
        } else {
          saveStoredCustomCategories(updatedCustom);
        }

        // 2. 해당 카테고리가 부여된 기존 영상들을 다른 남은 카테고리(또는 '기타')로 일괄 안전 재지정
        if (affectedCount > 0) {
          const fallbackCategory = updatedCustom[0] || '기타';
          const updatedItems = items.map(item => {
            if (item.category === catName) {
              const updatedBadge = item.badge === `[${catName}]` ? `[${fallbackCategory}]` : item.badge;
              const updatedTags = (item.tags || []).map(t => t === catName ? fallbackCategory : t);
              return {
                ...item,
                category: fallbackCategory,
                badge: updatedBadge,
                tags: updatedTags
              };
            }
            return item;
          });
          onSaveItems(updatedItems);
        }

        // 3. 현재 관리자 필터가 삭제된 카테고리였을 경우 '전체'로 복귀
        if (listFilterCategory === catName) {
          setListFilterCategory('전체');
        }

        showToast(`'${catName}' 카테고리가 완전히 삭제되었습니다.`);
        setConfirmDialog(null);
      }
    });
  };

  // 1차 삭제: 영상을 휴지통으로 이동
  const handleRequestTrashItem = (item: PortfolioItem) => {
    setConfirmDialog({
      isOpen: true,
      type: 'trash_item',
      title: '휴지통으로 이동 (1차 삭제)',
      itemTitle: `'${item.title}'`,
      itemSubtitle: `기업/상호: ${item.clientOrStore} · 카테고리: ${item.category}`,
      warningText: '이 작업 영상을 휴지통으로 이동하시겠습니까? 홈페이지 및 메인 관리 목록에서 즉시 숨겨지며, [휴지통] 탭에서 언제든지 복원하거나 영구 삭제할 수 있습니다.',
      confirmLabel: '휴지통으로 이동',
      confirmColor: 'amber',
      onConfirm: () => {
        const now = new Date();
        const formattedDate = now.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        const updated = items.map(i => 
          i.id === item.id 
            ? { ...i, isDeleted: true, deletedAt: formattedDate } 
            : i
        );
        onSaveItems(updated);
        if (editingItem && editingItem.id === item.id) {
          setIsEditing(false);
          setEditingItem(null);
        }
        showToast(`'${item.title}' 영상이 휴지통으로 이동되었습니다.`);
        setConfirmDialog(null);
      }
    });
  };

  // 휴지통에서 영상 복원
  const handleRestoreVideo = (item: PortfolioItem) => {
    const updated = items.map(i => 
      i.id === item.id 
        ? { ...i, isDeleted: false, deletedAt: undefined } 
        : i
    );
    onSaveItems(updated);
    showToast(`'${item.title}' 영상이 정상 복원되었습니다.`);
  };

  // 영상 영구 삭제 (2차 삭제)
  const handleRequestPermanentDeleteVideo = (item: PortfolioItem) => {
    setConfirmDialog({
      isOpen: true,
      type: 'permanent_delete_item',
      title: '작업 영상 영구 삭제 (2차 최종 삭제)',
      itemTitle: `'${item.title}'`,
      itemSubtitle: `기업/상호: ${item.clientOrStore} · 카테고리: ${item.category}`,
      warningText: '⚠️ 경고: 이 작업 영상 포트폴리오를 완전히 영구 삭제하시겠습니까? 첨부된 비디오 및 관련 스틸컷 정보가 데이터베이스에서 영구히 삭제되며 절대 복구할 수 없습니다.',
      confirmLabel: '영구 삭제',
      confirmColor: 'red',
      onConfirm: async () => {
        if (item.hasCustomVideo) {
          try {
            await deleteVideoBlob(item.id);
          } catch (err) {
            console.warn('Failed to delete video blob from storage:', err);
          }
        }
        const updated = items.filter(i => i.id !== item.id);
        onSaveItems(updated);
        showToast(`'${item.title}' 영상이 완전히 영구 삭제되었습니다.`);
        setConfirmDialog(null);
      }
    });
  };

  // 영상 휴지통 전체 비우기
  const handleRequestEmptyVideoTrash = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'empty_video_trash',
      title: '영상 휴지통 전체 비우기',
      itemTitle: `삭제 대기 영상 총 ${trashedPortfolioItems.length}개`,
      itemSubtitle: '휴지통에 보관된 모든 영상이 영구히 삭제됩니다.',
      warningText: '⚠️ 영상 휴지통을 비우시겠습니까? 보관 중인 모든 영상과 첨부 파일이 완전히 영구 삭제되며 복구할 수 없습니다.',
      confirmLabel: '영상 휴지통 비우기',
      confirmColor: 'red',
      onConfirm: async () => {
        for (const item of trashedPortfolioItems) {
          if (item.hasCustomVideo) {
            try {
              await deleteVideoBlob(item.id);
            } catch {}
          }
        }
        const updated = items.filter(i => !i.isDeleted);
        onSaveItems(updated);
        showToast('영상 휴지통이 모두 비워졌습니다.');
        setConfirmDialog(null);
      }
    });
  };

  // 영상 전체 복원
  const handleRestoreAllVideos = () => {
    const updated = items.map(i => i.isDeleted ? { ...i, isDeleted: false, deletedAt: undefined } : i);
    onSaveItems(updated);
    showToast(`휴지통의 영상 ${trashedPortfolioItems.length}개가 모두 복원되었습니다.`);
  };

  // 문의 복원
  const handleRestoreInquiry = (inq: ContactInquiry) => {
    const updated = restoreInquiry(inq.id);
    setInquiries(updated);
    showToast(`'${inq.nameOrStore}' 님의 문의가 정상 복원되었습니다.`);
  };

  // 문의 영구 삭제 (2차 삭제)
  const handleRequestPermanentDeleteInquiry = (inq: ContactInquiry) => {
    setConfirmDialog({
      isOpen: true,
      type: 'permanent_delete_inquiry',
      title: '고객 문의 영구 삭제 (2차 최종 삭제)',
      itemTitle: `'${inq.nameOrStore}' 님의 문의`,
      itemSubtitle: `연락처: ${inq.phone} (${inq.createdAt})`,
      warningText: '⚠️ 경고: 해당 고객 상담 기록을 완전히 영구 삭제하시겠습니까? 데이터베이스에서 영구히 삭제되며 절대 복구할 수 없습니다.',
      confirmLabel: '영구 삭제',
      confirmColor: 'red',
      onConfirm: () => {
        const updated = permanentlyDeleteInquiry(inq.id);
        setInquiries(updated);
        showToast(`'${inq.nameOrStore}' 님의 문의가 완전히 영구 삭제되었습니다.`);
        setConfirmDialog(null);
      }
    });
  };

  // 문의 휴지통 전체 비우기
  const handleRequestEmptyInquiryTrash = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'empty_inquiry_trash',
      title: '문의 휴지통 전체 비우기',
      itemTitle: `삭제 대기 문의 총 ${trashedInquiries.length}개`,
      itemSubtitle: '휴지통에 보관된 모든 고객 문의 기록이 영구히 삭제됩니다.',
      warningText: '⚠️ 문의 휴지통을 비우시겠습니까? 보관 중인 모든 문의 기록이 완전히 영구 삭제되며 복구할 수 없습니다.',
      confirmLabel: '문의 휴지통 비우기',
      confirmColor: 'red',
      onConfirm: () => {
        const updated = emptyInquiryTrash();
        setInquiries(updated);
        showToast('문의 휴지통이 모두 비워졌습니다.');
        setConfirmDialog(null);
      }
    });
  };

  // 문의 전체 복원
  const handleRestoreAllInquiries = () => {
    const updated = restoreAllInquiryTrash();
    setInquiries(updated);
    showToast(`휴지통의 문의 ${trashedInquiries.length}건이 모두 복원되었습니다.`);
  };

  // Filtered inquiries list (Only active inquiries that are not in trash)
  const filteredInquiries = activeInquiries.filter((inq) => {
    const matchesStatus = 
      inquiryStatusFilter === 'all' 
        ? true 
        : inq.status === inquiryStatusFilter;

    const q = inquirySearch.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      inq.nameOrStore.toLowerCase().includes(q) ||
      inq.phone.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Reset to default sample items with safe in-app confirmation
  const handleRequestResetToDefaults = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'reset_defaults',
      title: '포트폴리오 초기 데이터 복원',
      itemTitle: '초기 기본 샘플 데이터 전체 복원',
      itemSubtitle: '현재 등록 또는 수정된 모든 작업물이 초기 기본 샘플로 교체됩니다.',
      warningText: '모든 포트폴리오 데이터를 초기 기본 상태로 복원하시겠습니까? 직접 등록하신 영상 목록이 초기화됩니다.',
      confirmLabel: '초기 상태로 복원',
      onConfirm: () => {
        onSaveItems(DEFAULT_PORTFOLIO_ITEMS);
        showToast('기본 포트폴리오 데이터로 초기화되었습니다.');
        setConfirmDialog(null);
      }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-[#FFFFFF] text-neutral-900 rounded-none sm:rounded-2xl max-w-5xl w-full h-[100dvh] sm:h-[88vh] max-h-none sm:max-h-[840px] min-h-0 sm:min-h-[580px] overflow-hidden flex flex-col shadow-2xl border-0 sm:border border-neutral-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#111827] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center shrink-0">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-black tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
                <span>통합 관리자</span>
                <span className="hidden sm:inline">(Admin Console)</span>
                {isAdminLoggedIn && (
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    인증됨
                  </span>
                )}
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-normal truncate hidden xs:block">
                {isAdminLoggedIn ? '포트폴리오 영상 관리 및 접수된 고객 문의 내역 확인' : '관리자 기능을 이용하시려면 비밀번호를 입력해주세요.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 rounded-lg transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            )}
            <button
              onClick={handleSafeClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs (영상 관리 vs 고객 문의 vs 휴지통) */}
        {isAdminLoggedIn && (
          <div className="bg-[#111827] text-white px-3 sm:px-6 flex items-center gap-1 sm:gap-2 border-b border-neutral-800 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setAdminTab('portfolio');
              }}
              className={`flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'portfolio'
                  ? 'border-white text-white bg-neutral-800/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>영상 관리 ({activePortfolioItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAdminTab('inquiries');
                setIsEditing(false);
              }}
              className={`flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'inquiries'
                  ? 'border-white text-white bg-neutral-800/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>고객 문의</span>
              {unreadCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-mono font-extrabold bg-rose-500 text-white animate-pulse">
                  {unreadCount}
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                  ({activeInquiries.length})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setAdminTab('trash');
                setIsEditing(false);
              }}
              className={`flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'trash'
                  ? 'border-amber-400 text-amber-300 bg-neutral-800/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>휴지통</span>
              {totalTrashCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {totalTrashCount}
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono">
                  (0)
                </span>
              )}
            </button>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 flex items-center gap-2 shadow-inner shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{successToast}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-[#F9FAFB] text-neutral-900">
          
          {/* 1. If NOT logged in: Show Password Prompt */}
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-[#111827]">
                  관리자 접근 인증
                </h4>
                <p className="text-sm text-[#4B5563] mt-2">
                  포트폴리오 영상 관리 권한이 있는 관리자 전용 메뉴입니다.
                  <br />
                  설정된 비밀번호(4자리)를 입력해주세요.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={30}
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="관리자 비밀번호 입력"
                    className="w-full text-center tracking-widest text-2xl font-bold px-4 py-3.5 bg-white text-neutral-900 placeholder:text-neutral-400 border-2 border-neutral-300 focus:border-neutral-900 rounded-xl focus:outline-none transition-colors"
                  />
                  {authError && (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 mt-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-base rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>관리자 로그인</span>
                </button>
              </form>
            </div>
          ) : (
            /* 2. If LOGGED IN */
            adminTab === 'inquiries' ? (
              /* Inquiries Management Mode */
              <div className="space-y-5">
                {/* 1. Inquiries Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-500">전체 접수 문의</div>
                      <div className="text-2xl font-black text-neutral-900 mt-0.5">{activeInquiries.length}건</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                      <Inbox className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600">미확인 신규 문의</div>
                      <div className="text-2xl font-black text-rose-600 mt-0.5">{unreadCount}건</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-600">상담 완료</div>
                      <div className="text-2xl font-black text-emerald-600 mt-0.5">
                        {Math.max(0, activeInquiries.length - unreadCount)}건
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 2. Filter & Search Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
                  {/* Status Filter Buttons & Trash Shortcut */}
                  <div className="flex items-center gap-1.5 text-xs flex-wrap">
                    <button
                      type="button"
                      onClick={() => setInquiryStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        inquiryStatusFilter === 'all'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      전체 ({activeInquiries.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryStatusFilter('unread')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        inquiryStatusFilter === 'unread'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      미확인 ({unreadCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryStatusFilter('contacted')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        inquiryStatusFilter === 'contacted'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      상담완료 ({Math.max(0, activeInquiries.length - unreadCount)})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminTab('trash');
                        setTrashSubTab('inquiries');
                      }}
                      className="px-2.5 py-1.5 rounded-lg font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="문의 휴지통 열기"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
                      <span>휴지통 ({trashedInquiriesCount})</span>
                    </button>
                  </div>

                  {/* Search Box & Refresh */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        placeholder="고객명, 연락처, 내용 검색..."
                        className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-lg text-xs focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={reloadInquiries}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
                      title="새로고침"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Inquiries List */}
                <div className="space-y-3.5">
                  {filteredInquiries.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 shadow-2xs space-y-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-neutral-800">
                        {inquirySearch ? '검색 조건과 일치하는 문의 내역이 없습니다.' : '접수된 문의 내역이 없습니다.'}
                      </div>
                      <p className="text-xs text-neutral-500">
                        고객이 웹사이트 '문의하기' 폼을 통해 접수한 문의가 이곳에 자동으로 기록됩니다.
                      </p>
                    </div>
                  ) : (
                    filteredInquiries.map((inq) => {
                      const isUnread = inq.status === 'unread';
                      return (
                        <div
                          key={inq.id}
                          className={`bg-white rounded-xl border p-5 transition-all shadow-2xs hover:shadow-md ${
                            isUnread 
                              ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' 
                              : 'border-neutral-200'
                          }`}
                        >
                          {/* Top Row: Client Info & Status Badge & Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                  isUnread
                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {isUnread ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                    <span>신규 미확인</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-700" />
                                    <span>상담 완료</span>
                                  </>
                                )}
                              </span>

                              <h5 className="text-base font-black text-neutral-950 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-neutral-500" />
                                <span>{inq.nameOrStore}</span>
                              </h5>

                              <div className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{inq.createdAt}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {/* Direct Call Link */}
                              <a
                                href={`tel:${inq.phone.replace(/[^0-9]/g, '')}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                                title="전화 바로걸기"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{inq.phone}</span>
                              </a>

                              {/* Copy Phone Number */}
                              <button
                                type="button"
                                onClick={() => handleCopyPhone(inq.phone)}
                                className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
                                title="전화번호 복사"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Status */}
                              <button
                                type="button"
                                onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                                  isUnread
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-300'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-neutral-300'
                                }`}
                              >
                                {isUnread ? '상담 완료 처리' : '미확인으로 되돌리기'}
                              </button>

                              {/* Move Inquiry to Trash (1차 삭제) */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRequestTrashInquiry(inq);
                                }}
                                className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="휴지통으로 이동"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div className="mt-3.5 bg-neutral-50/80 rounded-xl p-4 border border-neutral-200/80">
                            <div className="text-xs font-bold text-neutral-500 mb-1">문의 내용:</div>
                            <p className="text-sm sm:text-base text-neutral-800 font-normal leading-relaxed whitespace-pre-wrap break-keep">
                              {inq.message || '(문의 내용 없음)'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : adminTab === 'trash' ? (
              /* 3. Recycle Bin (휴지통) Mode */
              <div className="space-y-4 sm:space-y-5">
                {/* Subtab Navigation: 영상 휴지통 vs 문의 휴지통 */}
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setTrashSubTab('portfolio')}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        trashSubTab === 'portfolio'
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Film className="w-4 h-4 shrink-0" />
                      <span>삭제된 작업 영상</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono font-bold ${
                        trashSubTab === 'portfolio' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {trashedVideosCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTrashSubTab('inquiries')}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        trashSubTab === 'inquiries'
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span>삭제된 고객 문의</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono font-bold ${
                        trashSubTab === 'inquiries' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {trashedInquiriesCount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2-Stage Safe Delete Info Guide Banner */}
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 sm:p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-extrabold text-amber-900 mb-0.5">
                      안심 2단계 삭제 및 복원 시스템 (휴지통 보관소)
                    </p>
                    <p className="text-amber-800/90 font-normal">
                      1차 삭제된 항목은 사용자 웹사이트 화면에서 즉시 숨겨지며, 이곳 휴지통에 안전하게 보관됩니다. 
                      실수로 삭제되었거나 다시 게시할 영상/문의는 <strong>[복원]</strong> 버튼으로 즉각 복구할 수 있으며, 
                      완전히 제거하려면 <strong>[영구 삭제]</strong>를 진행해주세요.
                    </p>
                  </div>
                </div>

                {/* Action Bar for Current Subtab */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-neutral-500" />
                      {trashSubTab === 'portfolio' ? (
                        <span>보관 중인 삭제 영상 총 <strong className="text-neutral-950 font-black">{trashedVideosCount}</strong>개</span>
                      ) : (
                        <span>보관 중인 삭제 문의 총 <strong className="text-neutral-950 font-black">{trashedInquiriesCount}</strong>건</span>
                      )}
                    </div>
                    <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
                      휴지통에 있는 항목은 2차 영구 삭제하기 전까지 안전하게 보관됩니다.
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {trashSubTab === 'portfolio' ? (
                      trashedVideosCount > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={handleRestoreAllVideos}
                            className="px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                            <span>영상 전체 복원</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRequestEmptyVideoTrash}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>영상 휴지통 비우기</span>
                          </button>
                        </>
                      )
                    ) : (
                      trashedInquiriesCount > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={handleRestoreAllInquiries}
                            className="px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                            <span>문의 전체 복원</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRequestEmptyInquiryTrash}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>문의 휴지통 비우기</span>
                          </button>
                        </>
                      )
                    )}
                  </div>
                </div>

                {/* SubTab 1: Trashed Portfolio Videos */}
                {trashSubTab === 'portfolio' && (
                  <div className="space-y-3">
                    {trashedPortfolioItems.length === 0 ? (
                      <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 shadow-2xs space-y-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                          <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-bold text-neutral-800">
                          영상 휴지통이 비어 있습니다.
                        </div>
                        <p className="text-xs text-neutral-500">
                          '영상 관리' 탭에서 삭제된 작업 영상이 이곳에 보관됩니다.
                        </p>
                      </div>
                    ) : (
                      trashedPortfolioItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl p-3.5 sm:p-4 border border-neutral-200 hover:border-neutral-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-all"
                        >
                          {/* Thumbnail & Video Info */}
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                            <div className="relative w-20 sm:w-24 aspect-[16/9] rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-200 opacity-80">
                              <img 
                                src={item.videoThumbnail} 
                                alt={item.title} 
                                className="w-full h-full object-cover grayscale"
                              />
                              <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 py-0.2 bg-black/80 text-white rounded">
                                {item.duration?.split(' ')[0] || '영상'}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] sm:text-[11px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                                  {item.badge}
                                </span>
                                <span className="text-xs text-neutral-500 font-medium truncate">
                                  {item.clientOrStore}
                                </span>
                                {item.deletedAt && (
                                  <span className="text-[10px] sm:text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                    🗑️ 삭제 일시: {item.deletedAt}
                                  </span>
                                )}
                              </div>

                              <h5 className="text-sm sm:text-base font-bold text-neutral-900 truncate">
                                {item.title}
                              </h5>

                              <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span>규격: {item.videoFormat?.split(' ')[0] || '16:9'}</span>
                                <span>·</span>
                                <span>{item.category}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions: Restore or Permanent Delete */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleRestoreVideo(item)}
                              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                              title="원래 목록으로 복원"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>복원</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestPermanentDeleteVideo(item)}
                              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                              title="영구 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>영구 삭제</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* SubTab 2: Trashed Inquiries */}
                {trashSubTab === 'inquiries' && (
                  <div className="space-y-3.5">
                    {trashedInquiries.length === 0 ? (
                      <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 shadow-2xs space-y-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                          <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-bold text-neutral-800">
                          문의 휴지통이 비어 있습니다.
                        </div>
                        <p className="text-xs text-neutral-500">
                          '고객 문의' 탭에서 삭제된 상담 내역이 이곳에 보관됩니다.
                        </p>
                      </div>
                    ) : (
                      trashedInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                                {inq.status === 'unread' ? '미확인 문의' : '상담 완료'}
                              </span>

                              <h5 className="text-base font-black text-neutral-900 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-neutral-400" />
                                <span>{inq.nameOrStore}</span>
                              </h5>

                              <span className="text-xs text-neutral-500 font-mono">
                                📞 {inq.phone}
                              </span>

                              {inq.deletedAt && (
                                <span className="text-[10px] sm:text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  🗑️ 삭제 일시: {inq.deletedAt}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRestoreInquiry(inq)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                                title="원래 목록으로 복원"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>복원</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestPermanentDeleteInquiry(inq)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                                title="영구 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>영구 삭제</span>
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/70">
                            <div className="text-xs font-bold text-neutral-500 mb-1">문의 내용:</div>
                            <p className="text-sm text-neutral-700 font-normal leading-relaxed whitespace-pre-wrap break-keep">
                              {inq.message || '(내용 없음)'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Portfolio Management Mode */
              <div>
              {/* Form Mode (Edit or Create) */}
              {isEditing ? (
                <div className="bg-white rounded-xl p-3.5 sm:p-8 border border-neutral-200 shadow-sm space-y-5 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                    <div>
                      <h4 className="text-base sm:text-xl font-black text-[#111827]">
                        {isNewItem ? '새 작업 영상 등록' : `'${editingItem?.title}' 수정`}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
                        시공사진은 제외하고, 작업 영상의 스펙과 모션 그래픽 연출 포인트를 입력해주세요.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto self-start sm:self-auto">
                      {editingItem && (
                        <button
                          type="button"
                          onClick={() => handleCopySingleItem(editingItem)}
                          className={`flex-1 sm:flex-initial justify-center flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer border ${
                            copiedItemId === editingItem.id
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                          }`}
                          title="이 영상의 데이터만 클립보드에 복사"
                        >
                          {copiedItemId === editingItem.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>복사 완료!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-blue-600" />
                              <span>이 영상 복사</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 sm:flex-initial px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 rounded-lg transition-colors text-center cursor-pointer"
                      >
                        목록으로 돌아가기
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveForm} noValidate className="space-y-5">
                    {/* Category Notice Banner */}
                    <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 sm:gap-3">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#EA580C] shrink-0 mt-0.5" />
                      <div className="text-[11px] sm:text-xs text-neutral-700 leading-relaxed break-keep">
                        <strong className="text-neutral-900 font-extrabold">카테고리 직접 쓰기 지원:</strong> 
                        <strong>카테고리 배지</strong>와 <strong>포트폴리오 분류 카테고리</strong> 2개 항목 모두 원하는 단어를 직접 자유롭게 타이핑할 수 있습니다. 새로 입력한 분류는 홈페이지 상단 필터 탭에 자동으로 즉시 생성되어 분류됩니다.
                      </div>
                    </div>

                    {/* Row 1: Category Badge & Portfolio Classification Category (Both Directly Writable) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. 카테고리 배지 (직접 쓰기) */}
                      <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-xl border border-neutral-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-neutral-800">
                            1. 카테고리 배지 (직접 쓰기) <span className="text-[#EA580C]">*</span>
                          </label>
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-200/60 px-1.5 py-0.5 rounded">
                            영상 카드 노출 배지
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="예: [광고], [IT/소프트웨어], [스마트팜], [자유입력]"
                          className="w-full px-3.5 py-2.5 bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm font-black focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] focus:outline-none"
                        />
                        <div className="space-y-1.5 pt-0.5">
                          <div className="text-[11px] text-neutral-500 font-medium">
                            💡 클릭하여 배지 자동 채우기:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {[
                              '[광고]',
                              '[숏폼]',
                              '[디지털 메뉴보드]',
                              '[인포그래픽]',
                              '[영상 카드뉴스]',
                              '[카드뉴스]',
                              '[브랜딩 동화]',
                              '[IT/소프트웨어]',
                              '[스마트팜]',
                              '[제조/생산]',
                              '[뷰티/헤어]',
                              '[의료/병원]',
                              '[기업홍보/브랜딩]'
                            ].map((badge) => (
                              <button
                                key={badge}
                                type="button"
                                onClick={() => setFormBadge(badge)}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                                  formBadge === badge
                                    ? 'bg-[#EA580C] text-white shadow-2xs'
                                    : 'bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-200'
                                }`}
                              >
                                {badge}
                              </button>
                            ))}
                          </div>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                setFormBadge(e.target.value);
                              }
                            }}
                            defaultValue=""
                            className="w-full px-2.5 py-1.5 bg-white text-neutral-900 border border-neutral-200 rounded text-xs focus:border-[#EA580C] focus:outline-none mt-1"
                          >
                            <option value="" disabled>▼ 전체 산업군 카테고리 프리셋 목록 (선택 시 자동 입력)</option>
                            {ALL_INDUSTRY_CATEGORIES.map((grp) => (
                              <optgroup key={grp.group} label={`── ${grp.group} ──`}>
                                {grp.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 2. 포트폴리오 분류 카테고리 (직접 쓰기) */}
                      <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-xl border border-neutral-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-neutral-800">
                            2. 포트폴리오 분류 카테고리 (직접 쓰기) <span className="text-[#EA580C]">*</span>
                          </label>
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-200/60 px-1.5 py-0.5 rounded">
                            홈페이지 필터 탭 연동
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          placeholder="예: 광고, 숏폼, 디지털 메뉴보드, 3D 모션 등 직접 타이핑"
                          className="w-full px-3.5 py-2.5 bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm font-black focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] focus:outline-none"
                        />
                        <div className="space-y-1.5 pt-0.5">
                          <div className="text-[11px] text-neutral-500 font-medium">
                            💡 클릭하여 기본 분류 자동 채우기:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {allCategories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setFormCategory(cat)}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                                  formCategory === cat
                                    ? 'bg-[#EA580C] text-white shadow-2xs'
                                    : 'bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-200'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                          <p className="text-[11px] text-neutral-500 pt-1 leading-relaxed">
                            * 새로운 분류를 직접 적으시면, 홈페이지 작업물 탭 상단에 <strong>해당 카테고리 필터 버튼이 자동으로 추가</strong>됩니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Target Industry Tag & Client/Store Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                          타겟 업종 태그 <span className="text-zinc-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formIndustryTag}
                          onChange={(e) => setFormIndustryTag(e.target.value)}
                          placeholder="예: #카페/식당, #병원/클리닉, #학교/학원, #뷰티/헤어"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none"
                        />
                        <div className="text-[11px] text-neutral-400 mt-1">
                          썸네일 하단에 표시되는 업종 태그입니다.
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                          클라이언트 / 기업·매장명 <span className="text-zinc-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formClientOrStore}
                          onChange={(e) => setFormClientOrStore(e.target.value)}
                          placeholder="예: 넥스트스페이스 테크 / 대관령 청정팜"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none"
                        />
                        <div className="text-[11px] text-neutral-400 mt-1">
                          기업명, 브랜드명, 기관명 또는 매장명
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Title */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                        영상 제목 <span className="text-zinc-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="예: 시그니처 브런치 & 드립 커피 모션 영상"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm font-bold focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    {/* Row 3: Video Format & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                          영상 규격 / 포맷
                        </label>
                        <input
                          type="text"
                          required
                          value={formVideoFormat}
                          onChange={(e) => setFormVideoFormat(e.target.value)}
                          placeholder="예: 16:9 4K UHD 가로형 / 9:16 숏폼 세로형"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                          재생 시간 & 루프 방식
                        </label>
                        <input
                          type="text"
                          required
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          placeholder="예: 0:30 무한 루프 / 1:00 풀버전"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 4: Summary & Key Message */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                          카드 한 줄 요약 <span className="text-zinc-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formSummary}
                          onChange={(e) => setFormSummary(e.target.value)}
                          placeholder="예: 노릇한 토스트 위로 시럽이 흐르는 슬로모션과 커피 스팀을 담은 고화질 작업 영상"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                          <span>영상 핵심 메시지 / 대표 카피라이팅</span>
                        </label>
                        <input
                          type="text"
                          value={formKeyMessage}
                          onChange={(e) => setFormKeyMessage(e.target.value)}
                          placeholder="예: 신선한 원두와 갓 구운 브런치의 감성을 60fps 시네마틱 무드로 전달"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 5: Detailed Concept & Direction */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                        1. 상세 기획 및 연출 의도 설명 (CONCEPT & DIRECTION) <span className="text-zinc-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="영상의 제작 의도, 고객의 시선을 끄는 화면 구성, 조명과 색감 연출, 가독성 처리 등에 대해 상세히 적어주세요."
                        className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-sm focus:border-neutral-900 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Row 6: Production Notes & Target Space/Audience Guide (추가 상세 설명란) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>2. 제작 비하인드 & 연출 노트 (조명·색감·사운드)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formProductionNotes}
                          onChange={(e) => setFormProductionNotes(e.target.value)}
                          placeholder="예: 웜베이지 톤의 차분한 컬러 그레이딩 적용. 120fps 매크로 슬로모션 촬영과 공간 앰비언트 BGM 싱크 모션 연출"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs focus:border-neutral-900 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                          <span>3. 추천 송출 공간 & 타겟 고객 활용 가이드</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formTargetAudience}
                          onChange={(e) => setFormTargetAudience(e.target.value)}
                          placeholder="예: 2040 직장인 및 브런치 고객 타겟. 매장 입구 전면 65인치 DID 사이니지 및 카운터 상단 세로형 메뉴보드 송출 권장"
                          className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs focus:border-neutral-900 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* Media Attachment Section: Player vs Still Scenes 분리 관리 */}
                    {/* ======================================================== */}
                    <div className="pt-3 border-t border-neutral-200 space-y-6">
                      
                      {/* Section Title */}
                      <div className="bg-neutral-100/90 p-3 sm:p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="w-4 h-4 text-[#EA580C] shrink-0" />
                          <div>
                            <span className="text-xs font-black text-neutral-900 break-keep">
                              미디어 분리 첨부 관리 (동영상 플레이어 vs 주요 장면 스틸 씬)
                            </span>
                            <p className="text-[11px] text-neutral-500 mt-0.5 break-keep">
                              실제 비디오 플레이어와 영상의 주요 하이라이트 스틸 씬을 독립적으로 분리하여 첨부 및 관리할 수 있습니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 1. Video Attachment Card (Player Media) */}
                      <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-xl border border-neutral-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Film className="w-4 h-4 text-[#EA580C] shrink-0" />
                            <div>
                              <label className="text-xs font-black text-neutral-800 break-keep flex items-center gap-1.5">
                                <span>[섹션 A] 동영상 플레이어 미디어 첨부</span>
                                <span className="font-normal text-neutral-500 text-[11px]">(갤러리 모달에서 실제 재생)</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* Mode Toggle */}
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-neutral-200 text-[11px] w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setVideoMode('upload')}
                              className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded font-bold transition-colors ${
                                videoMode === 'upload' ? 'bg-[#EA580C] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              내 파일 직접 첨부
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoMode('url')}
                              className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded font-bold transition-colors ${
                                videoMode === 'url' ? 'bg-[#EA580C] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              외부 비디오 URL 입력
                            </button>
                          </div>
                        </div>

                        {videoMode === 'upload' ? (
                          <div>
                            {/* Hidden Video File Input */}
                            <input
                              type="file"
                              ref={videoInputRef}
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleVideoFileSelect(f);
                              }}
                            />

                            {formVideoUrl ? (
                              /* Video Attached Preview */
                              <div className="bg-black/95 rounded-xl p-3 border border-neutral-300 space-y-3">
                                <div className="relative aspect-[16/9] w-full max-h-56 mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center">
                                  <video
                                    ref={videoPreviewRef}
                                    src={formVideoUrl}
                                    controls
                                    playsInline
                                    className="w-full h-full object-contain"
                                  />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                                      {videoFileName || '첨부된 동영상 파일'}
                                    </span>
                                    {videoFileSize && (
                                      <span className="text-[11px] text-neutral-400 font-mono shrink-0">({videoFileSize})</span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <button
                                      type="button"
                                      onClick={handleCaptureVideoThumbnail}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg text-xs font-bold transition-colors flex-1 sm:flex-initial justify-center"
                                      title="비디오의 현재 재생 시점 이미지를 썸네일로 추출"
                                    >
                                      <Camera className="w-3.5 h-3.5 shrink-0" />
                                      <span className="whitespace-nowrap">화면 썸네일 추출</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => videoInputRef.current?.click()}
                                      className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
                                    >
                                      파일 교체
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormVideoUrl('');
                                        setVideoFileName('');
                                        setVideoFileSize('');
                                      }}
                                      className="px-2 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Video Drop / Upload Area */
                              <div
                                onClick={() => videoInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const f = e.dataTransfer.files?.[0];
                                  if (f) handleVideoFileSelect(f);
                                }}
                                className="group cursor-pointer border-2 border-dashed border-neutral-300 hover:border-[#EA580C] bg-white hover:bg-orange-50/30 rounded-xl p-4 sm:p-5 text-center transition-all"
                              >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-[#EA580C] mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                                  <FileVideo className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <p className="text-xs font-bold text-neutral-800">
                                  {isProcessingVideo ? '동영상 파일을 불러오는 중입니다...' : '클릭하여 동영상 파일 첨부 또는 여기에 드래그'}
                                </p>
                                <p className="text-[11px] text-neutral-400 mt-1">
                                  MP4, WebM, MOV 포맷 지원 (권장 50MB 이하)
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Video External URL Input (YouTube, Vimeo, MP4 Direct Link) */
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={formVideoUrl}
                                onChange={(e) => setFormVideoUrl(e.target.value)}
                                placeholder="예: https://youtu.be/xxx 또는 https://vimeo.com/xxx 또는 https://example.com/video.mp4"
                                className="flex-1 min-w-0 px-3.5 py-2.5 bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs font-mono focus:border-neutral-900 focus:outline-none"
                              />
                              {formVideoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setFormVideoUrl('')}
                                  className="shrink-0 px-3 py-2.5 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-xs font-bold text-neutral-700 transition-colors"
                                >
                                  비우기
                                </button>
                              )}
                            </div>

                            {/* Helpful Tips */}
                            <div className="text-[11px] text-neutral-500 bg-neutral-100 p-2.5 rounded-lg border border-neutral-200 flex items-start gap-1.5 leading-relaxed">
                              <Sparkles className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                              <span>
                                <strong>💡 추천 가이드:</strong> 유튜브에 <strong>'일부공개'</strong>로 영상을 올린 후 링크를 여기에 복사해 넣으시면, <strong>서버 트래픽 과부하 및 비용 부담 0원</strong>으로 버퍼링 없는 고화질 스트리밍이 지원됩니다.
                              </span>
                            </div>

                            {/* Live Video Preview for External URL */}
                            {formVideoUrl && (() => {
                              const parsed = parseVideoUrl(formVideoUrl);
                              return (
                                <div className="bg-black/95 rounded-xl p-3 border border-neutral-300 space-y-2.5">
                                  <div className="flex items-center justify-between text-xs pb-1">
                                    <div className="flex items-center gap-2">
                                      {parsed.type === 'youtube' && (
                                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                                          YouTube 감지됨 (트래픽 0원)
                                        </span>
                                      )}
                                      {parsed.type === 'vimeo' && (
                                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">
                                          Vimeo 감지됨 (고화질)
                                        </span>
                                      )}
                                      {parsed.type === 'direct' && (
                                        <span className="px-2 py-0.5 rounded bg-neutral-700 text-white font-bold text-[10px]">
                                          직접 비디오 링크 (Direct MP4)
                                        </span>
                                      )}
                                      <span className="text-neutral-300 text-[11px]">미리보기 확인</span>
                                    </div>
                                  </div>

                                  <div className="relative aspect-[16/9] w-full max-h-56 mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center border border-neutral-800">
                                    {parsed.type === 'youtube' || parsed.type === 'vimeo' ? (
                                      <iframe
                                        src={parsed.embedUrl}
                                        title="외부 영상 미리보기"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full border-0"
                                      />
                                    ) : (
                                      <video
                                        src={parsed.originalUrl}
                                        controls
                                        playsInline
                                        className="w-full h-full object-contain"
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* 2. Main Thumbnail Attachment Card */}
                      <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-xl border border-neutral-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <ImageIcon className="w-4 h-4 text-[#EA580C] shrink-0" />
                            <label className="text-xs font-black text-neutral-800 break-keep">
                              2. 대표 썸네일 이미지 직접 첨부 <span className="text-red-500">* (필수)</span>
                            </label>
                          </div>

                          {/* Mode Toggle */}
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-neutral-200 text-[11px] w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setThumbnailMode('upload')}
                              className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded font-bold transition-colors ${
                                thumbnailMode === 'upload' ? 'bg-[#EA580C] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              내 파일 직접 첨부
                            </button>
                            <button
                              type="button"
                              onClick={() => setThumbnailMode('url')}
                              className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded font-bold transition-colors ${
                                thumbnailMode === 'url' ? 'bg-[#EA580C] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              외부 이미지 URL 입력
                            </button>
                          </div>
                        </div>

                        {thumbnailMode === 'upload' ? (
                          <div>
                            {/* Hidden Image File Input */}
                            <input
                              type="file"
                              ref={thumbnailInputRef}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleThumbnailFileSelect(f);
                              }}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                              {/* Left: Preview */}
                              <div className="sm:col-span-5 relative aspect-[16/9] rounded-xl overflow-hidden bg-black border-2 border-neutral-200 shadow-xs">
                                <img
                                  src={formThumbnail}
                                  alt="대표 썸네일 미리보기"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop';
                                  }}
                                />
                                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded">
                                  대표 썸네일
                                </span>
                              </div>

                              {/* Right: Upload Actions */}
                              <div className="sm:col-span-7 space-y-2">
                                <div
                                  onClick={() => thumbnailInputRef.current?.click()}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const f = e.dataTransfer.files?.[0];
                                    if (f) handleThumbnailFileSelect(f);
                                  }}
                                  className="group cursor-pointer border-2 border-dashed border-neutral-300 hover:border-[#EA580C] bg-white hover:bg-orange-50/30 rounded-xl p-4 text-center transition-all"
                                >
                                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-[#EA580C] mx-auto mb-1 transition-colors" />
                                  <p className="text-xs font-bold text-neutral-800">
                                    {isProcessingThumbnail ? '이미지를 최적화하는 중...' : '클릭하여 내 PC에서 새 썸네일 이미지 선택'}
                                  </p>
                                  <p className="text-[11px] text-neutral-400 mt-0.5">
                                    또는 이미지를 이곳으로 드래그 (JPG, PNG, WebP)
                                  </p>
                                </div>

                                {thumbnailFileName && (
                                  <div className="flex items-center justify-between text-[11px] text-neutral-600 bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200">
                                    <span className="truncate max-w-[200px] font-medium">첨부파일: {thumbnailFileName}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormThumbnail('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop');
                                        setThumbnailFileName('');
                                      }}
                                      className="text-neutral-400 hover:text-red-500 font-bold"
                                    >
                                      초기화
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Thumbnail External URL Input */
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={formThumbnail}
                              onChange={(e) => setFormThumbnail(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="flex-1 min-w-0 px-3 py-2 bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs font-mono focus:border-neutral-900 focus:outline-none"
                            />
                            {formThumbnail && (
                              <div className="w-12 h-9 rounded border border-neutral-300 overflow-hidden shrink-0 bg-neutral-100">
                                <img src={formThumbnail} alt="미리보기" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 3. Video Still Cuts Multi-Attachment Card */}
                      <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-xl border border-neutral-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Layers className="w-4 h-4 text-[#EA580C] shrink-0" />
                            <label className="text-xs font-black text-neutral-800 break-keep">
                              3. 영상 주요 장면 스틸컷 첨부 <span className="font-normal text-neutral-500">({formFrames.length}개)</span>
                            </label>
                          </div>

                          {/* Mode Toggle */}
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-neutral-200 text-[11px] w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setFramesMode('upload')}
                              className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded font-bold transition-colors ${
                                framesMode === 'upload' ? 'bg-[#EA580C] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              파일 첨부 (다중)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFramesMode('url');
                                setFormFramesText(formFrames.join('\n'));
                              }}
                              className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded font-bold transition-colors ${
                                framesMode === 'url' ? 'bg-[#EA580C] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              URL 줄바꿈 목록
                            </button>
                          </div>
                        </div>

                        {framesMode === 'upload' ? (
                          <div className="space-y-3">
                            {/* Hidden Multi-file Input */}
                            <input
                              type="file"
                              ref={framesInputRef}
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleStillCutFilesSelect(e.target.files);
                                }
                              }}
                            />

                            {/* Still Cuts Grid */}
                            {formFrames.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {formFrames.map((frameUrl, idx) => (
                                  <div
                                    key={idx}
                                    className="group relative aspect-[16/9] rounded-lg overflow-hidden bg-black border-2 border-neutral-300 hover:border-[#EA580C] shadow-xs"
                                  >
                                    <img
                                      src={frameUrl}
                                      alt={`스틸컷 ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    {/* Badge Index */}
                                    <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-black/80 text-white font-mono text-[9px] rounded font-bold">
                                      컷 0{idx + 1}
                                    </span>

                                    {/* Action Overlays */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white">
                                      <div className="flex justify-between items-center">
                                        <button
                                          type="button"
                                          onClick={() => handleSetFrameAsThumbnail(frameUrl)}
                                          className="text-[9px] bg-[#EA580C] hover:bg-[#C2410C] px-1.5 py-0.5 rounded font-bold"
                                          title="이 스틸컷을 대표 썸네일로 지정"
                                        >
                                          대표 지정
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveStillCut(idx)}
                                          className="text-[10px] bg-red-600 hover:bg-red-700 p-1 rounded-full text-white"
                                          title="삭제"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {/* Order Controls */}
                                      <div className="flex justify-center gap-2">
                                        {idx > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => handleMoveStillCut(idx, 'left')}
                                            className="p-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200"
                                            title="앞으로 이동"
                                          >
                                            <ArrowLeft className="w-3 h-3" />
                                          </button>
                                        )}
                                        {idx < formFrames.length - 1 && (
                                          <button
                                            type="button"
                                            onClick={() => handleMoveStillCut(idx, 'right')}
                                            className="p-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200"
                                            title="뒤로 이동"
                                          >
                                            <ArrowRight className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Still Cuts Drop / Click Button */}
                            <div
                              onClick={() => framesInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  handleStillCutFilesSelect(e.dataTransfer.files);
                                }
                              }}
                              className="group cursor-pointer border-2 border-dashed border-neutral-300 hover:border-[#EA580C] bg-white hover:bg-orange-50/20 rounded-xl p-3 text-center transition-all flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4 text-[#EA580C] group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-neutral-800">
                                {isProcessingFrames ? '스틸컷 이미지를 최적화하는 중...' : '+ 스틸컷 이미지 추가 첨부 (여러 장 동시 선택 가능)'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* Still Cuts URL List Textarea */
                          <div>
                            <p className="text-[11px] text-neutral-500 mb-1.5">
                              * 각 줄마다 이미지 URL을 하나씩 입력해주세요.
                            </p>
                            <textarea
                              rows={3}
                              value={formFramesText}
                              onChange={(e) => {
                                setFormFramesText(e.target.value);
                                const parsed = e.target.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                                setFormFrames(parsed);
                              }}
                              placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                              className="w-full px-3 py-2 bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs font-mono focus:border-neutral-900 focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Row 4: Motion Features (줄바꿈 구분) */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        모션 그래픽 & 영상 연출 핵심 포인트 (줄바꿈으로 구분)
                      </label>
                      <textarea
                        rows={3}
                        value={formFeaturesText}
                        onChange={(e) => setFormFeaturesText(e.target.value)}
                        placeholder="메이플 시럽과 버터가 녹아내리는 60fps 고화질 슬로모션 컷&#10;신선한 원두 핸드드립과 잔잔한 커피 스팀의 유려한 루프 모션&#10;시간대별 자동 전환되는 텍스트 애니메이션"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs focus:border-neutral-900 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-neutral-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
                      <div>
                        {!isNewItem && editingItem && (
                          <button
                            type="button"
                            onClick={() => handleRequestTrashItem(editingItem)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-amber-300 text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-amber-600" />
                            <span>휴지통으로 이동</span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        {editingItem && (
                          <button
                            type="button"
                            onClick={() => handleCopySingleItem(editingItem)}
                            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                              copiedItemId === editingItem.id
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                            }`}
                            title="현재 수정 중인 이 영상 데이터만 클립보드에 복사"
                          >
                            {copiedItemId === editingItem.id ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span>복사 완료!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-blue-600" />
                                <span>이 영상 클립보드 복사</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg border border-neutral-300 text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors text-center cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sm font-extrabold text-white shadow flex items-center justify-center gap-1.5 transition-colors text-center cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>저장하기</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* List Mode */
                <div className="space-y-4 sm:space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-neutral-200 shadow-sm">
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        등록된 작업 영상 총 <strong className="text-neutral-900">{activePortfolioItems.length}</strong>개
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-500">
                        여기서 추가하거나 수정한 내용은 웹사이트에 즉시 반영됩니다.
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                      <button
                        type="button"
                        onClick={handleRequestResetToDefaults}
                        className="flex-1 sm:flex-initial justify-center flex items-center gap-1 px-3 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                        title="기본 샘플 데이터로 복원"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>기본 복원</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCategoryManagerOpen(!isCategoryManagerOpen)}
                        className={`flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer border ${
                          isCategoryManagerOpen
                            ? 'bg-orange-50 border-orange-300 text-[#EA580C]'
                            : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                        }`}
                        title="작업물 카테고리 실시간 생성 및 관리"
                      >
                        <Tag className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>카테고리 관리</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-orange-100 text-[#EA580C] font-bold">
                          {allCategories.length}개
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsExportDialogOpen(true)}
                        className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="등록된 영상 데이터를 다른 모든 방문자가 볼 수 있도록 영구 코드 반영용 데이터 복사"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                        <span>데이터 내보내기/백업</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAdminTab('trash');
                          setTrashSubTab('portfolio');
                        }}
                        className="flex-1 sm:flex-initial justify-center flex items-center gap-1 px-3 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                        title="영상 휴지통 열기"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
                        <span>휴지통 ({trashedVideosCount})</span>
                      </button>

                      <button
                        onClick={handleStartCreate}
                        className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-extrabold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>새 작업영상 추가</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Management Drawer / Card */}
                  {isCategoryManagerOpen && (
                    <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-orange-200 shadow-sm space-y-4 animate-in fade-in duration-150">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                        <div>
                          <div className="text-sm font-extrabold text-neutral-900 flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-[#EA580C]" />
                            <span>작업물 카테고리 자유 생성 & 완전 삭제 관리</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            고정된 기본 카테고리 없이 모든 카테고리를 자유롭게 생성하고 삭제할 수 있습니다. 변경사항은 홈페이지 <strong>'작업물' 탭 상단 필터에 즉시 자동 연동</strong>됩니다.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCategoryManagerOpen(false)}
                          className="self-end sm:self-center text-xs font-semibold text-neutral-500 hover:text-neutral-800 px-2 py-1 rounded hover:bg-neutral-100 cursor-pointer"
                        >
                          닫기
                        </button>
                      </div>

                      {/* Add New Category Input Form */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNewCategory(newCategoryInput);
                              }
                            }}
                            placeholder="새로 추가할 카테고리 이름 입력 (예: 3D 모션 그래픽, 드론/항공 영상, 기업 홍보, 인터뷰/다큐)"
                            className="w-full pl-9 pr-3 py-2 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 rounded-lg text-xs font-bold focus:border-[#EA580C] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddNewCategory(newCategoryInput)}
                          className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-extrabold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ 새 카테고리 생성</span>
                        </button>
                      </div>

                      {/* Quick preset recommendations */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] text-neutral-500 font-medium">
                          💡 클릭하여 추천 카테고리 1초 만에 바로 추가:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            '광고',
                            '숏폼',
                            '인포그래픽',
                            '디지털 메뉴보드',
                            '영상 카드뉴스',
                            '카드뉴스',
                            '브랜딩 동화',
                            '3D 모션 그래픽',
                            '드론/항공 영상',
                            '기업/기관 홍보',
                            '인터뷰/다큐멘터리',
                            '유튜브/웹예능',
                            '브랜드 필름',
                            '미디어아트/전시'
                          ]
                            .filter(preset => !allCategories.includes(preset))
                            .map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleAddNewCategory(preset)}
                                className="px-2.5 py-1 bg-neutral-100 hover:bg-orange-50 hover:text-[#EA580C] hover:border-orange-200 border border-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3 text-[#EA580C]" />
                                <span>{preset}</span>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Current Categories List Badges (전체 자유 삭제 및 관리) */}
                      <div className="space-y-3 pt-3 border-t border-neutral-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-neutral-800">
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-[#EA580C]" />
                            <span>현재 등록된 카테고리 목록 (총 {allCategories.length}개)</span>
                          </span>
                          <span className="text-[11px] text-neutral-500 font-normal">
                            * 고정된 카테고리 없이 모든 카테고리를 <strong className="text-red-600 font-bold">[삭제]</strong>할 수 있습니다.
                          </span>
                        </div>

                        {allCategories.length === 0 ? (
                          <div className="py-6 text-center text-xs text-neutral-400 bg-neutral-50 rounded-lg border border-neutral-200">
                            등록된 카테고리가 없습니다. 위 입력창이나 추천 버튼을 눌러 새 카테고리를 생성해보세요.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {allCategories.map((cat) => {
                              const count = activePortfolioItems.filter(i => i.category === cat).length;
                              return (
                                <div
                                  key={cat}
                                  className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-white text-neutral-900 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
                                >
                                  <span className="text-neutral-900 font-extrabold">{cat}</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700">
                                    {count}개 영상
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCategory(cat)}
                                    className="px-2 py-0.5 rounded bg-white hover:bg-red-50 text-neutral-500 hover:text-red-600 border border-neutral-200 hover:border-red-200 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer ml-1 shadow-2xs"
                                    title={`'${cat}' 카테고리 완전히 삭제`}
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                    <span>삭제</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-neutral-50 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                      {['전체', ...allCategories].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setListFilterCategory(cat)}
                          className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors whitespace-nowrap text-[11px] sm:text-xs ${
                            listFilterCategory === cat
                              ? 'bg-neutral-900 text-white'
                              : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64 shrink-0">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={listSearchQuery}
                        onChange={(e) => setListSearchQuery(e.target.value)}
                        placeholder="제목, 기업명, 배지 검색..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-lg text-xs focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Portfolio Items List Cards */}
                  <div className="space-y-3">
                    {activePortfolioItems
                      .filter((item) => {
                        const matchesSearch = 
                          listSearchQuery.trim() === '' ||
                          item.title.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
                          item.clientOrStore.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
                          item.badge.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(listSearchQuery.toLowerCase());

                        if (!matchesSearch) return false;

                        if (listFilterCategory === '전체') return true;
                        return item.category === listFilterCategory;
                      })
                      .map((item, index) => (
                      <div 
                        key={item.id}
                        className="bg-white rounded-xl p-3 sm:p-4 border border-neutral-200 hover:border-neutral-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-all"
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                          <div className="relative w-20 sm:w-24 aspect-[16/9] rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-200">
                            <img 
                              src={item.videoThumbnail} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 py-0.2 bg-black/80 text-white rounded">
                              {item.duration.split(' ')[0]}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#EA580C] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 shrink-0">
                                {item.badge}
                              </span>
                              <span className="text-xs text-neutral-500 font-medium truncate">
                                {item.clientOrStore}
                              </span>
                            </div>

                            <h5 className="text-sm sm:text-base font-black text-neutral-900 truncate">
                              {item.title}
                            </h5>

                            <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span>규격: {item.videoFormat.split(' ')[0]}</span>
                              <span>·</span>
                              <span>{item.category}</span>
                              {item.videoUrl && (
                                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  <FileVideo className="w-3 h-3" />
                                  영상 첨부됨
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                                <Layers className="w-3 h-3 text-neutral-400" />
                                스틸컷 {item.videoFrames?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopySingleItem(item)}
                            className={`flex-1 sm:flex-initial justify-center flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer border ${
                              copiedItemId === item.id
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                            }`}
                            title="이 영상의 데이터(JSON)만 클립보드에 복사하여 AI Studio에 전달"
                          >
                            {copiedItemId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>복사 완료!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-blue-600" />
                                <span>클립보드 복사</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="flex-1 sm:flex-initial justify-center flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                            <span>수정</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequestTrashItem(item);
                            }}
                            className="flex-1 sm:flex-initial justify-center flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-neutral-600 hover:text-amber-700 bg-neutral-100 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="휴지통으로 이동"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-neutral-500 hover:text-amber-600" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
            )
          )}

        </div>

        {/* Bottom Footer Information */}
        <div className="bg-white border-t border-neutral-200 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <div className="truncate text-[11px] sm:text-xs">
            강원 필링 라이프 통합 관리자 콘솔 · GFL Admin Console
          </div>
          <button
            onClick={onClose}
            className="font-bold text-neutral-700 hover:text-black cursor-pointer px-2 py-1 rounded hover:bg-neutral-100 transition-colors shrink-0"
          >
            닫기
          </button>
        </div>

        {/* Custom Confirmation Modal (Replaces blocked window.confirm) */}
        {confirmDialog && confirmDialog.isOpen && (
          <div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDialog(null);
            }}
          >
            <div 
              className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmDialog.confirmColor === 'red' || confirmDialog.type.includes('permanent') || confirmDialog.type.includes('empty')
                    ? 'bg-red-100 text-red-600'
                    : confirmDialog.confirmColor === 'amber' || confirmDialog.type.includes('trash')
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {confirmDialog.type.includes('permanent') || confirmDialog.type.includes('empty') ? (
                    <Trash2 className="w-5 h-5 text-red-600" />
                  ) : confirmDialog.type.includes('trash') ? (
                    <Trash2 className="w-5 h-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-neutral-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-black text-neutral-900 leading-snug">
                    {confirmDialog.title}
                  </h4>
                  <p className="text-sm font-bold text-neutral-800 mt-1 truncate">
                    {confirmDialog.itemTitle}
                  </p>
                  {confirmDialog.itemSubtitle && (
                    <p className="text-xs text-neutral-500 mt-0.5 whitespace-pre-line line-clamp-2">
                      {confirmDialog.itemSubtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-600 leading-relaxed break-keep">
                {confirmDialog.warningText}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await confirmDialog.onConfirm();
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                    confirmDialog.confirmColor === 'red' || confirmDialog.type.includes('permanent') || confirmDialog.type.includes('empty')
                      ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                      : confirmDialog.confirmColor === 'amber' || confirmDialog.type.includes('trash')
                      ? 'bg-amber-600 hover:bg-amber-700 active:scale-95'
                      : 'bg-neutral-900 hover:bg-black active:scale-95'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{confirmDialog.confirmLabel}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export Data / Code Sync Dialog */}
        {isExportDialogOpen && (
          <div 
            className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setIsExportDialogOpen(false);
            }}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <Copy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-neutral-900">
                      등록된 작업 영상 데이터 내보내기 / 클립보드 복사
                    </h3>
                    <p className="text-xs text-neutral-500">
                      현재 등록된 활성 영상 총 {activePortfolioItems.length}개의 데이터입니다.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExportDialogOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector: 개별 복사 vs 전체 일괄 복사 */}
              <div className="flex border-b border-neutral-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setExportTab('single')}
                  className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    exportTab === 'single'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>영상 1개씩 개별 복사</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    용량 초과 방지 · 권장
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportTab('all')}
                  className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    exportTab === 'all'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>전체 일괄 복사 & 다운로드</span>
                </button>
              </div>

              {/* Tab 1 Content: 영상 1개씩 개별 복사 */}
              {exportTab === 'single' && (
                <div className="space-y-3 flex-1 overflow-hidden flex flex-col min-h-0">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1 text-xs text-blue-900 leading-relaxed shrink-0">
                    <div className="font-extrabold flex items-center gap-1.5 text-blue-950">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>클립보드 용량이 너무 크다는 메시지가 발생할 때:</span>
                    </div>
                    <p className="text-[11px] sm:text-xs">
                      영상 데이터(스틸컷, 설명 등)가 많아 전체 복사 시 브라우저 용량 한도를 초과할 수 있습니다. 아래 목록에서 필요한 영상을 <strong>[이 영상 복사]</strong> 버튼으로 1개씩 복사하여 AI Studio 대화창에 전달해주시면 오류 없이 완벽하게 등록됩니다!
                    </p>
                  </div>

                  {/* Search filter inside modal */}
                  <div className="relative shrink-0">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={exportSearchQuery}
                      onChange={(e) => setExportSearchQuery(e.target.value)}
                      placeholder="복사할 영상 검색 (제목, 배지, 매장명, 카테고리)..."
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Scrollable List of Videos */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[200px]">
                    {activePortfolioItems
                      .filter((item) => {
                        if (!exportSearchQuery.trim()) return true;
                        const q = exportSearchQuery.toLowerCase();
                        return (
                          item.title.toLowerCase().includes(q) ||
                          item.badge.toLowerCase().includes(q) ||
                          item.clientOrStore.toLowerCase().includes(q) ||
                          item.category.toLowerCase().includes(q)
                        );
                      })
                      .map((item) => {
                        const isCopied = copiedItemId === item.id;
                        const isPreviewOpen = expandedPreviewId === item.id;
                        const sanitized = getSanitizedItemForCopy(item);
                        const itemJson = JSON.stringify(sanitized, null, 2);

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border transition-all ${
                              isCopied
                                ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                                : 'bg-white border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-200">
                                  <img
                                    src={item.videoThumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[10px] font-extrabold text-[#EA580C] bg-orange-50 px-1.5 py-0.2 rounded border border-orange-100 shrink-0">
                                      {item.badge}
                                    </span>
                                    <span className="text-[11px] text-neutral-500 font-medium truncate">
                                      {item.clientOrStore}
                                    </span>
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                                    {item.title}
                                  </h4>
                                  <div className="text-[10px] text-neutral-500 flex items-center gap-2 mt-0.5">
                                    <span>{item.category}</span>
                                    <span>·</span>
                                    <span>스틸컷 {item.videoFrames?.length || 0}개</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setExpandedPreviewId(isPreviewOpen ? null : item.id)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                                  title="이 영상의 JSON 코드 직접 확인"
                                >
                                  <Code className="w-3.5 h-3.5" />
                                  <span>{isPreviewOpen ? '코드 닫기' : '코드 보기'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopySingleItem(item)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                    isCopied
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                                  }`}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>복사 완료!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>이 영상 복사</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Collapsible JSON Preview for this individual video */}
                            {isPreviewOpen && (
                              <div className="mt-3 pt-3 border-t border-neutral-200/80 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                                  <span>이 영상의 단일 JSON 데이터:</span>
                                  <span className="text-[10px] text-neutral-400">클릭 시 전체 선택됩니다</span>
                                </div>
                                <textarea
                                  readOnly
                                  rows={5}
                                  value={itemJson}
                                  onFocus={(e) => e.target.select()}
                                  className="w-full font-mono text-[10px] p-2.5 bg-neutral-900 text-emerald-400 rounded-lg border border-neutral-700 focus:outline-none select-all"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {activePortfolioItems.length === 0 && (
                      <div className="text-center py-8 text-neutral-400 text-xs">
                        등록된 활성 영상이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2 Content: 전체 일괄 복사 & 파일 다운로드 */}
              {exportTab === 'all' && (
                <div className="space-y-3 flex-1 overflow-hidden flex flex-col min-h-0">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed shrink-0">
                    <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>전체 복사 시 용량 한도 주의사항:</span>
                    </div>
                    <p className="mt-1 text-[11px] sm:text-xs">
                      등록된 영상이 많거나 고해상도 스틸컷이 포함된 경우 브라우저 클립보드 용량 한도를 초과할 수 있습니다. 오류 발생 시 상단 <strong>[영상 1개씩 개별 복사]</strong> 탭을 이용하시거나, 아래 <strong>[JSON 파일로 다운로드]</strong>를 이용해주세요.
                    </p>
                  </div>

                  <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-700 shrink-0">
                      <span>전체 데이터 미리보기 (JSON 포맷)</span>
                      <span className="text-[11px] font-normal text-neutral-400">
                        전체 선택(Ctrl+A) 후 직접 복사 가능
                      </span>
                    </div>
                    <textarea
                      readOnly
                      value={activeVideosJson}
                      onFocus={(e) => e.target.select()}
                      className="w-full flex-1 min-h-[160px] font-mono text-[11px] p-3 bg-neutral-900 text-emerald-400 rounded-xl border border-neutral-700 focus:outline-none select-all"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-neutral-100 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadExportData}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="전체 데이터를 JSON 파일로 다운로드 (클립보드 용량 제한 없음)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON 파일로 다운로드</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExportDialogOpen(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    닫기
                  </button>

                  {exportTab === 'all' && (
                    <button
                      type="button"
                      onClick={handleCopyExportData}
                      className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        copiedDataSuccess ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {copiedDataSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>복사 완료! (대화창에 붙여넣기 해주세요)</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>클립보드에 전체 복사</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
