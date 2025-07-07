export type CategoryType =
  | 'mood'
  | 'weather'
  | 'genre'
  | 'situation'
  | 'place'
  | 'time'
  | 'thisWeek'
  | 'activity'
  | 'era'
  | 'vibe'
  | 'instrument'
  | 'language'
  | 'season'
  | 'energy'
  | 'trend';

// 여기에 'all' 포함한 타입 정의
export type ExtendedCategoryType = CategoryType | 'all';

// 카테고리 라벨
export const CATEGORY_LABELS: Record<ExtendedCategoryType, string> = {
  all: '전체',  
  thisWeek: '이번 주 추천',     // 메인 슬라이더, 매주 한 가지 추천 큐레이션
  mood: '기분별',               // 슬픔, 행복, 설렘 등 감정 상태
  weather: '날씨별',           // 비, 맑음, 눈 등 날씨 상황
  genre: '장르별',             // 힙합, 발라드, 락 등 음악 장르
  situation: '상황별',         // 출근길, 운동할 때, 공부할 때 등
  place: '장소별',             // 드라이브, 카페, 방 안 등 공간
  time: '시간대별',            // 아침, 저녁, 새벽 등 시간대
  activity: '활동별',          // 청소, 러닝, 요가 등 활동
  season: '계절별',            // 봄, 여름, 가을, 겨울
  vibe: '분위기별',            // chill, dreamy, dark 등 감성적 무드
  energy: '에너지 레벨',       // 느린 템포 ~ 격렬한 사운드까지
  era: '시대별',               // 90s, 2000s, 최신 트렌드 등
  language: '언어별',          // 한국어, 영어, 일본어 등
  instrument: '악기 중심',     // 피아노, 기타, 드럼 등 중심 악기
  trend: '지금 인기',          // 지금 핫한 바이럴/차트 음악
};

// 순서 지정은 그대로 CategoryType만 사용
export const CATEGORY_ORDER: CategoryType[] = [
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
];