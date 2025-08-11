'use client';

import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchStore } from '@/stores/useSearchStore';
import { useModalStore } from '@/stores/useModalStore';
import { useCurationStore } from '@/stores/useCurationStore';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORY_LABELS } from '@/constants/curation';

const SearchModal = () => {
  const { keyword, setKeyword, clearKeyword } = useSearchStore();
  const { curationVideosByCategory } = useCurationStore();
  const close = useModalStore((state) => state.close);
  const debouncedKeyword = useDebounce(keyword, 300);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc 키 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  // 오버레이 클릭 닫기
  const handleOverlayClick = useCallback(() => {
    close();
  }, [close]);

  // 모달 내부 클릭 버블링 방지
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 검색 입력 변경
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    [setKeyword]
  );

  // 검색어 지우기
  const handleClear = useCallback(() => {
    clearKeyword();
  }, [clearKeyword]);

  // 결과 항목 클릭 핸들러 생성(Map으로 재사용)
  const allCurationVideos = useMemo(
    () => Object.values(curationVideosByCategory).flat(),
    [curationVideosByCategory]
  );

  const openMap = useMemo(() => {
    const m = new Map<string, () => void>();
    for (const v of allCurationVideos) {
      m.set(v.id, () => window.open(v.youtube_url, '_blank'));
    }
    return m;
  }, [allCurationVideos]);

  // 검색어 토큰화
  const keywords = useMemo(() => {
    const trimmed = debouncedKeyword.trim().toLowerCase();
    return trimmed ? trimmed.split(/\s+/) : [];
  }, [debouncedKeyword]);

  // 필터링
  const filtered = useMemo(() => {
    if (keywords.length === 0) return [];
    return allCurationVideos.filter((video) => {
      const title = video.title.toLowerCase();
      const categoryLabel = CATEGORY_LABELS[video.category].toLowerCase();
      return keywords.some((kw) => title.includes(kw) || categoryLabel.includes(kw));
    });
  }, [keywords, allCurationVideos]);

  // 결과 항목 키보드 접근성
  const handleResultKeyDown = useCallback(
    (id: string, url: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const fn = openMap.get(id) ?? (() => window.open(url, '_blank'));
        fn();
      }
    },
    [openMap]
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
        onClick={stopPropagation}
        className="w-[320px] bg-white rounded-2xl shadow-xl border border-blue-600 overflow-hidden"
      >
        {/* 검색 입력창 */}
        <div className="relative">
          <input
            autoFocus
            value={keyword}
            onChange={handleInputChange}
            placeholder="플레이리스트 검색"
            className="w-full px-4 py-3 pr-10 text-base font-medium border-0 border-b border-gray-200 focus:outline-none focus:ring-0"
            aria-labelledby="search-modal-title"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>

        {/* 검색 결과 영역 */}
        {keyword && (
          <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((video) => (
                <div
                  key={video.id}
                  tabIndex={0}
                  role="button"
                  onClick={openMap.get(video.id)}
                  onKeyDown={handleResultKeyDown(video.id, video.youtube_url)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition focus:outline-none focus:bg-gray-50"
                  aria-label={`${video.title} 열기`}
                >
                  <img
                    src={video.imageUrl}
                    alt={video.title}
                    className="w-[120px] aspect-[3/2] object-cover rounded-md flex-shrink-0"
                    draggable={false}
                  />
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {video.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-4 py-4 text-sm text-gray-500">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;