export const CATEGORY_LIST = [
  'thisWeek',
  'mood',
  'weather',
  'genre',
  'situation',
  'place',
  'time',
  'activity',
  'season',
  'vibe',
  'energy',
  'era',
  'language',
  'instrument',
  'trend',
] as const;

// 타입 자동 추론
export type CategoryType = typeof CATEGORY_LIST[number];
export type ExtendedCategoryType = CategoryType | 'all';

// label 정의
export const CATEGORY_LABELS: Record<ExtendedCategoryType, string> = {
  all: '전체',
  thisWeek: '이번 주 추천',
  mood: '기분별',
  weather: '날씨별',
  genre: '장르별',
  situation: '상황별',
  place: '장소별',
  time: '시간대별',
  activity: '활동별',
  season: '계절별',
  vibe: '분위기별',
  energy: '에너지 레벨',
  era: '시대별',
  language: '언어별',
  instrument: '악기 중심',
  trend: '지금 인기',
};

// 순서가 필요한 곳은 CATEGORY_LIST를 그대로 사용
export const CATEGORY_ORDER = [...CATEGORY_LIST];