'use client';

import { useMemo } from 'react';
import { useSearchStore } from '@/stores/useSearchStore';
import { useModalStore } from '@/stores/useModalStore';
import { useCurationStore } from '@/stores/useCurationStore';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORY_LABELS } from '@/constants/curation';

const SearchModal = () => {
  
  const { keyword, setKeyword, clearKeyword } = useSearchStore(); 
  const { curationVideosByCategory } = useCurationStore(); 
  const close = useModalStore((state) => state.close);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = () => close();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // 검색어 입력 후 300ms 지연 처리
  const debouncedKeyword = useDebounce(keyword, 300);

  // 검색어를 소문자로 변환하고 공백 기준으로 분리
  const keywords = useMemo(() => {
    const trimmed = debouncedKeyword.trim().toLowerCase();
    return trimmed ? trimmed.split(/\s+/) : [];
  }, [debouncedKeyword]);

  // 모든 큐레이션 영상을 배열로 변환
  const allCurationVideos = useMemo(() => {
    return Object.values(curationVideosByCategory).flat();
  }, [curationVideosByCategory]);

  // 검색어와 제목 또는 카테고리 라벨이 일치하는 영상 필터링
  const filtered = useMemo(() => {
    if (keywords.length === 0) return [];

    return allCurationVideos.filter((video) => {
      const title = video.title.toLowerCase();
      const categoryLabel = CATEGORY_LABELS[video.category].toLowerCase();

      return keywords.some((kw) =>
        title.includes(kw) || categoryLabel.includes(kw)
      );
    });
  }, [keywords, allCurationVideos]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        onClick={stopPropagation}
        className="w-[320px] bg-white rounded-2xl shadow-xl border border-blue-600 overflow-hidden"
      >
        {/* 검색 입력창 */}
        <div className="relative">
          <input
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="🔎 플레이리스트 검색"
            className="w-full px-4 py-3 pr-10 text-base font-medium border-0 border-b border-gray-200 focus:outline-none focus:ring-0"
          />
          {keyword && (
            <button
              onClick={clearKeyword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
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
                  onClick={() => window.open(video.youtube_url, '_blank')}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                >
                  <img
                    src={video.imageUrl}
                    alt={video.title}
                    className="w-[120px] aspect-[3/2] object-cover rounded-md flex-shrink-0"
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