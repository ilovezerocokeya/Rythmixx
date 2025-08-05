'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/CommonUI/Header';
import { validateNickname } from '@/utils/validateNickname';
import { useDebounce } from '@/hooks/useDebounce';
import CurationVideoCard from '@/components/CommonUI/CurationVideoCard';
import { useLikeStore } from '@/stores/useLikeStore';
import { useMyPagePaginationStore } from '@/stores/useMyPagePaginationStore';

const Mypage = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();
  const liked = useLikeStore((s) => s.liked);
  const likedPlaylists = Object.values(liked);

  const { currentPage, setCurrentPage, resetCurrentPage } = useMyPagePaginationStore();

  // 닉네임 수정 관련 상태
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname ?? '');
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const debouncedNickname = useDebounce(nicknameInput, 300);
  const trimmedDebouncedNickname = debouncedNickname.trim();

  // 유저 없으면 리디렉션 + 페이지 초기화
  useEffect(() => {
    resetCurrentPage();
    if (!user) navigate('/');
  }, [user, navigate, resetCurrentPage]);

  if (!user) return null;

  // 닉네임 유효성 검사
  useEffect(() => {
    if (!editingNickname || trimmedDebouncedNickname === user?.nickname) {
      setNicknameError(null);
      return;
    }
    const validate = async () => {
      const error = await validateNickname(trimmedDebouncedNickname);
      setNicknameError(error);
    };
    validate();
  }, [trimmedDebouncedNickname, editingNickname, user?.nickname]);

  // 닉네임 저장 처리
  const handleNicknameUpdate = async () => {
    if (!user) return;
    const trimmed = nicknameInput.trim();
    const errorMsg = await validateNickname(trimmed);
    if (errorMsg) {
      setNicknameError(errorMsg);
      return;
    }
    const { error } = await supabase
      .from('users')
      .update({ nickname: trimmed })
      .eq('user_id', user.id);
    if (error) {
      alert('닉네임 업데이트 실패');
      console.error(error);
      return;
    }
    login({ id: user.id, email: user.email, nickname: trimmed });
    setEditingNickname(false);
    setNicknameError(null);
    alert('닉네임이 변경되었습니다!');
  };

  // 페이지네이션 계산
  const itemsPerPage = 6;
  const totalPages = Math.ceil(likedPlaylists.length / itemsPerPage);
  const paginatedPlaylists = likedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <Header />

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-[50px] z-10 flex items-center justify-center border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500">© 2025 Rythmixx</p>
        </div>

        <div className="px-4 pt-16 pb-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-400 text-center">My페이지</h2>

          {/* 닉네임 영역 */}
          <div className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm space-y-1.5">
            <p className="text-sm font-semibold text-gray-600 mb-2">닉네임</p>
            {editingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNicknameUpdate();
                    else if (e.key === 'Escape') {
                      setNicknameInput(user?.nickname ?? '');
                      setEditingNickname(false);
                      setNicknameError(null);
                    }
                  }}
                  className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleNicknameUpdate}
                  className="px-2 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setNicknameInput(user?.nickname ?? '');
                    setEditingNickname(false);
                    setNicknameError(null);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-900">{user?.nickname}</p>
                <button
                  onClick={() => setEditingNickname(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ✏️
                </button>
              </div>
            )}
            {nicknameError && (
              <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
            )}
          </div>

          {/* 좋아요한 플레이리스트 영역 */}
          <div className="border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              '{user.nickname}'님의 플레이리스트 <span className="text-red-500">♥</span>
            </p>
            {likedPlaylists.length > 0 ? (
              <>
                <ul className="grid grid-cols-3 gap-x-4 gap-y-2">
                  {paginatedPlaylists.map((playlist) => (
                    <li key={playlist.playlist_id}>
                      <CurationVideoCard
                        id={playlist.playlist_id}
                        title={playlist.title}
                        imageUrl={playlist.image_url}
                        variant="xs"
                        onClick={() => {
                          const youtubeUrl = `https://www.youtube.com/watch?v=${playlist.playlist_id}`;
                          window.open(youtubeUrl, '_blank');
                        }}
                      />
                    </li>
                  ))}
                </ul>

                {/* 페이지네이션 버튼 */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex-1 mr-2 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex-1 ml-2 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400">좋아요한 플레이리스트가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;