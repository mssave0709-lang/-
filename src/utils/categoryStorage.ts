export const DEFAULT_PORTFOLIO_CATEGORIES: string[] = [
  '광고',
  '숏폼',
  '인포그래픽',
  '디지털 메뉴보드',
  '영상 카드뉴스',
  '카드뉴스',
  '브랜딩 동화'
];

export const CATEGORIES_STORAGE_KEY = 'gfl_custom_categories';

export function getStoredCustomCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0 && !DEFAULT_PORTFOLIO_CATEGORIES.includes(s));
    }
  } catch (e) {
    console.error('Failed to load custom categories from localStorage:', e);
  }
  return [];
}

export function saveStoredCustomCategories(categories: string[]): void {
  try {
    const cleaned = Array.from(
      new Set(
        categories
          .map((c) => c.trim())
          .filter((c) => c.length > 0 && !DEFAULT_PORTFOLIO_CATEGORIES.includes(c))
      )
    );
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cleaned));
  } catch (e) {
    console.error('Failed to save custom categories to localStorage:', e);
  }
}
