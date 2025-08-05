Rythmixx

음악 플레이리스트 큐레이션 서비스

⸻

✨ 프로젝트 개요

**Rythmixx**는 사용자에게 날씨나 기분, 상황, 장르에 따라 어울리는 유튜브 음악 플레이리스트를 큐레이션 방식으로 추천해주는 음악 감상 웹 앱입니다.
복잡한 검색 없이, 사용자는 다양한 테마의 플레이리스트 중 원하는 카테고리를 선택하기만 하면 됩니다. 노래를 한 곡씩 고르는 대신, **선별된 다양한 카테고리 별 음악 모음**을 감상할 수 있으며, 마음에 드는 플리는 '좋아요' 기능으로 저장해 마이페이지에서 다시 들을 수 있습니다.
웹 기반으로 어디서든 이용 가능하며, **PWA 설치 지원**으로 앱처럼 사용할 수 있습니다.

⸻

🎯 개발 목적

“플레이리스트만 선택하면, 상황과 기분에 어울리는 음악들이 자연스럽게 흐르면 어떨까?”

- 사용자가 직접 곡을 고르지 않아도, 다양한 카테고리(기분·상황·장르 등)에 맞춘 음악을 손쉽게 감상할 수 있도록 기획했습니다.
- 직접 큐레이팅한 감성 중심의 플레이리스트를 제공합니다.
- 좋아요 기능을 통해, 유저는 마음에 드는 플레이리스트를 마이페이지에 저장해 나만의 감성 음악 모음을 만들 수 있습니다.
- 로그인 없이도 편하게 감상할 수 있으며, 누구나 쉽게 접근 가능한 음악 큐레이션 경험을 목표로 했습니다.

⸻

🧑‍💻 개발 정보

- **개발자**: 김성준 (Frontend 단독 개발)
- **개발 기간**: 약 6주

🔧 주요 역할

- **UI/UX 설계 및 구현**
  - 날씨에 따라 감성이 달라지는 흐름을 반영한 직관적 사용자 인터페이스 설계
  - 메인 페이지, 마이페이지, 로그인/회원가입, 큐레이션 수정 등 전체 화면 제작
  - 모바일 전용 UI 구조로, Tailwind CSS 기반의 일관된 스타일 구성
- **상태 관리 구조 설계**
  - Zustand를 활용한 전역 상태 관리 시스템 구축
  - 로그인 상태, 날씨 정보, 큐레이션 데이터, 모달, 좋아요, 검색 상태 등 세분화된 store 구성
  - 불필요한 리렌더링을 방지하는 구조로 최적화
- **Supabase 연동**
  - Google OAuth 기반 로그인 구현
  - 사용자 정보 저장 및 좋아요 기반 마이페이지 큐레이션 기능 개발
  - Storage를 통한 이미지 저장 및 DB 연동 처리
- **날씨 기반 추천 로직 구현**
  - Geolocation API로 사용자의 현재 위치 정보 수집
  - OpenWeather API와 연동해 실시간 날씨 데이터 호출
- **YouTube API 연동 및 플레이리스트 구성**
  - YouTube Data API를 통해 큐레이션 플레이리스트 정보를 직접 불러오는 기능 구현
  - 영상 썸네일, 제목, 링크 등의 데이터를 활용하여 유저가 쉽게 접근할 수 있는 카드 UI로 가공
  - 날씨나 테마에 맞는 다양한 플레이리스트를 수동 큐레이션하여 관리
  - 유저는 곡을 하나하나 선택하지 않고, 상황에 맞는 큐레이션 하나만 선택하면 음악을 감상할 수 있는 구조 설계

⸻

🔧 실행 방법

# 1. 레포지토리 클론

git clone https://github.com/your-id/rythmixx.git
cd rythmixx

# 2. 패키지 설치

npm install

# 3. 환경변수

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# 4. 로컬 서버 실행

npm run dev

⸻

📦 주요 기술 스택

| 구분       | 사용 기술                   | 설명                                  |
| ---------- | --------------------------- | ------------------------------------- |
| 프레임워크 | React 19, Vite, TypeScript  | 최신 React 기반의 빠르고 안정적인 SPA |
| 스타일링   | Tailwind CSS, framer-motion | 유틸리티 CSS + 애니메이션             |
| 상태 관리  | Zustand                     | 모듈화된 전역 상태 관리               |
| 인증/DB    | Supabase                    | OAuth 인증, 실시간 DB, Storage 통합   |
| 날씨 API   | OpenWeather API             | 유저 위치 기반 날씨 정보 제공         |
| 위치 탐지  | Geolocation API             | 현재 위치 자동 수집                   |
| 음악 API   | YouTube Data API v3         | 큐레이션된 유튜브 영상 연결           |
| 라우팅     | React Router v7             | CSR 기반 라우팅                       |
| PWA 구성   | vite-plugin-pwa, Workbox    | 앱 설치 지원 및 캐싱 처리             |

⸻

🗂️ 디렉터리 구조

📦src
┣ 📂Routersㄷ
┃ ┗ 📜index.tsx
┣ 📂components
┃ ┣ 📂CommonUI
┃ ┃ ┣ 📜CurationVideoCard.tsx
┃ ┃ ┗ 📜Header.tsx
┃ ┣ 📂Edit
┃ ┃ ┣ 📜EditCurationControlPanel.tsx
┃ ┃ ┣ 📜EditCurationHeader.tsx
┃ ┃ ┗ 📜EditCurationSlider.tsx
┃ ┣ 📂Login
┃ ┃ ┗ 📜LoginModal.tsx
┃ ┣ 📂Search
┃ ┃ ┣ 📜HighlightedText.tsx
┃ ┃ ┗ 📜SearchModal.tsx
┃ ┣ 📂Slider
┃ ┃ ┣ 📜MainCurationPlaylistSlider.tsx
┃ ┃ ┗ 📜PlaylistSlider.tsx
┃ ┣ 📂Weather
┃ ┃ ┗ 📜WeatherDisplay.tsx
┃ ┣ 📂location
┃ ┃ ┗ 📜LocationDisplay.tsx
┃ ┗ 📜.DS_Store
┣ 📂constants
┃ ┗ 📜curation.ts
┣ 📂hooks
┃ ┣ 📜useCurrentWeatherType.ts
┃ ┣ 📜useDebounce.ts
┃ ┣ 📜useGeolocation.ts
┃ ┣ 📜useReverseGeocoding.ts
┃ ┗ 📜useWeather.ts
┣ 📂pages
┃ ┣ 📂auth
┃ ┃ ┗ 📜Callback.tsx
┃ ┣ 📜.DS_Store
┃ ┣ 📜EditCurationPage.tsx
┃ ┣ 📜Home.tsx
┃ ┣ 📜MyPage.tsx
┃ ┗ 📜SignupPage.tsx
┣ 📂stores
┃ ┣ 📜useAuthStore.ts
┃ ┣ 📜useCurationStore.ts
┃ ┣ 📜useLikeStore.ts
┃ ┣ 📜useLocationStore.ts
┃ ┣ 📜useModalStore.ts
┃ ┣ 📜useMyPagePaginationStore.ts
┃ ┣ 📜useSearchStore.ts
┃ ┗ 📜useWeatherStore.ts
┣ 📂supabase
┃ ┗ 📜createClient.ts
┣ 📂utils
┃ ┣ 📂apis
┃ ┃ ┣ 📜supabaseCuration.ts
┃ ┃ ┗ 📜youtube.ts
┃ ┣ 📜validateNickname.ts
┃ ┗ 📜youtube.ts
┣ 📜.DS_Store
┣ 📜App.css
┣ 📜App.tsx
┣ 📜PWABadge.css
┣ 📜PWABadge.tsx
┣ 📜index.css
┣ 📜main.tsx
┗ 📜vite-env.d.ts

⸻

📝 특징 및 차별점

- 카테고리만 선택하면 감성에 맞는 음악 감상 가능
- 로그인 없이도 자유롭게 탐색 가능, 로그인 시 좋아요 저장 기능 제공
- Zustand를 활용한 상태 분리 및 리렌더 최소화 → 쾌적한 UX 제공
- Supabase 연동으로 인증 / DB / Storage 기능 통합 처리
- 모든 큐레이션은 직접 선별 → 감성 중심 큐레이션의 완성도 확보

⸻

🧹 유지 관리 상태

**불필요한 의존성 제거**  
 → `depcheck`를 활용해 실제 사용되지 않는 패키지를 전부 정리하여 빌드 최적화 완료

**타입 안정성 보장**  
 → `any` 타입을 전혀 사용하지 않고, 모든 변수와 함수에 명확한 타입을 지정해 안정성 확보

**Zustand를 통한 효율적인 상태 분리**  
 → 카테고리별 상태를 모듈화하여 컴포넌트 리렌더링을 최소화하는 구조 유지

**확장 가능한 구조 설계**  
 → 감정 태그 기반 큐레이션, 날씨에 맞는 자동 추천 플레이리스트 등 기능을 손쉽게 추가할 수 있도록 컴포넌트 단위 분리 및 유틸리티 구조 적용

**코드 일관성 유지 및 클린업 점검**  
 → ESLint 규칙 기반으로 일관된 코딩 스타일을 유지하며, 주기적인 리팩토링으로 코드 품질 관리
⸻
