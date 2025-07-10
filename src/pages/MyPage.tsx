'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import { validateNickname } from '@/utils/validateNickname';
import { useDebounce } from '@/hooks/useDebounce';
import CurationVideoCard from "@/components/ui/CurationVideoCard";
import { useLikeStore } from "@/stores/useLikeStore";

const Mypage = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();
  const liked = useLikeStore((s) => s.liked);
  const likedPlaylists = Object.values(liked);

  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname ?? '');
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const debouncedNickname = useDebounce(nicknameInput, 300);
  const trimmedDebouncedNickname = debouncedNickname.trim();

  // 유저 정보가 없으면 홈으로 리디렉션
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // 닉네임 변경 시 중복 및 유효성 검사
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

    // 상태 업데이트 및 반영
    login({
      id: user.id,
      email: user.email,
      nickname: trimmed,
    });

    setEditingNickname(false);
    setNicknameError(null);
    alert('닉네임이 변경되었습니다!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <Header />

        <div className="px-4 pt-16 pb-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-400 text-center">My페이지</h2>

          {/* 닉네임 섹션 */}
          <div className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm space-y-1.5">
            <p className="text-sm font-semibold text-gray-600 mb-2">닉네임</p>

            {editingNickname ? (
              // 닉네임 수정 중인 경우
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
              // 닉네임 표시 상태
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

            {/* 닉네임 에러 메시지 */}
            {nicknameError && (
              <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
            )}
          </div>

          {/* 저장된 플레이리스트 섹션 */}
          <div className="border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              <span className="text-red-500">♥</span> My 플리zip
            </p>

            {likedPlaylists.length > 0 ? (
              <ul className="grid grid-cols-3 gap-x-4 gap-y-2">
                {likedPlaylists.slice(0, 9).map((playlist) => (
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