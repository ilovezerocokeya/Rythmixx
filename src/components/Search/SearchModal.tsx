'use client';

import { useMemo } from 'react';
import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { useModalStore } from '@/stores/useModalStore';
import { useDebounce } from '@/hooks/useDebounce';
import { HighlightedText } from '@/components/Search/HighlightedText';

const SearchModal = () => {
  const { keyword, setKeyword, clearKeyword } = useSearchStore();
  const { allPlaylists } = usePlaylistStore();
  const close = useModalStore((state) => state.close);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = () => close();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const debouncedKeyword = useDebounce(keyword, 300); // 키워드 입력 시 300ms 지연 후 반영되도록 디바운싱 처리

  // 디바운싱된 키워드를 소문자 기준으로 공백 단위 분리
  const keywords = useMemo(() => {
    const trimmed = debouncedKeyword.trim().toLowerCase();
    if (!trimmed) return [];
    return trimmed.split(/\s+/);
  }, [debouncedKeyword]);

  // 입력한 키워드가 포함된 플레이리스트 필터링
  const filtered = useMemo(() => {
    if (keywords.length === 0) return [];

    return allPlaylists.filter((pl) => {
      const title = pl.title.toLowerCase();
      const genre = pl.genre?.toLowerCase?.() ?? '';
      const keywordsInItem = pl.keywords?.map((kw: string) => kw.toLowerCase()) ?? [];

      // 제목, 장르, 키워드 중 하나라도 포함되면 필터링 결과에 포함
      return keywords.some((kw) =>
        title.includes(kw) ||
        genre.includes(kw) ||
        keywordsInItem.some((itemKw) => itemKw.includes(kw))
      );
    });
  }, [keywords, allPlaylists]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        onClick={stopPropagation}
        className="w-[320px] bg-white rounded-2xl shadow-xl border border-blue-600 overflow-hidden"
      >
        {/* 검색 입력창 및 닫기 버튼 */}
        <div className="relative">
          <input
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="🔍 플레이리스트 검색"
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

        {/* 검색어가 존재하면 필터링된 결과 표시 */}
        {keyword && (
          <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((pl) => (
                <div
                  key={pl.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                >
                  {/* 제목과 장르에 하이라이트 적용 */}
                  <p className="text-sm font-semibold text-gray-900">
                    <HighlightedText text={pl.title} keywords={keywords} />
                  </p>
                  <p className="text-xs text-gray-500">
                    <HighlightedText text={pl.genre ?? ''} keywords={keywords} />
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