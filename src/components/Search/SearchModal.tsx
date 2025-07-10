'use client';

import { useMemo } from 'react';
import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { useModalStore } from '@/stores/useModalStore';

const SearchModal = () => {
  const { keyword, setKeyword, clearKeyword } = useSearchStore();
  const { allPlaylists } = usePlaylistStore();
  const close = useModalStore((state) => state.close);

  const handleOverlayClick = () => close();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const filtered = useMemo(() => {
    const lower = keyword.toLowerCase();
    return allPlaylists.filter((pl) =>
      pl.title.toLowerCase().includes(lower) ||
      (pl.genre?.toLowerCase?.().includes(lower) ?? false) ||
      (pl.keywords?.some?.((kw: string) => kw.toLowerCase().includes(lower)) ?? false)
    );
  }, [keyword, allPlaylists]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        onClick={stopPropagation}
        className="w-[320px] bg-white rounded-2xl shadow-xl border border-blue-600 overflow-hidden"
      >
        {/* 검색창 + X 버튼 */}
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

        {keyword && (
          <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((pl) => (
                <div
                  key={pl.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                >
                  <p className="text-sm font-semibold text-gray-900">{pl.title}</p>
                  <p className="text-xs text-gray-500">{pl.genre}</p>
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