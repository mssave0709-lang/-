export const INITIAL_CATEGORIES: string[] = [
  '광고',
  '숏폼',
  '인포그래픽',
  '디지털 메뉴보드',
  '영상 카드뉴스',
  '카드뉴스',
  '브랜딩 동화'
];

export const DEFAULT_PORTFOLIO_CATEGORIES = INITIAL_CATEGORIES;

export const CATEGORIES_STORAGE_KEY = 'gfl_categories_dynamic_v1';

export function getStoredCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map((s) => String(s).trim())
          .filter((s) => s.length > 0);
      }
    }
  } catch (e) {
    console.error('Failed to load categories from localStorage:', e);
  }
  // 기본 초기 카테고리로 시작하되, 이후 사용자가 자유롭게 삭제/추가 가능
  return [...INITIAL_CATEGORIES];
}

export function saveStoredCategories(categories: string[]): void {
  try {
    const cleaned = Array.from(
      new Set(
        categories
          .map((c) => c.trim())
          .filter((c) => c.length > 0)
      )
    );
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cleaned));
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e);
  }
}

// 기존 참조 호환용 alias
export const getStoredCustomCategories = getStoredCategories;
export const saveStoredCustomCategories = saveStoredCategories;
