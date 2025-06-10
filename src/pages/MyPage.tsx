'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import { validateNickname } from '@/utils/validateNickname';
import { useDebounce } from '@/hooks/useDebounce';

const Mypage = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();
  const [preference, setPreference] = useState<string[]>([]);
  const [savedPlaylists, setSavedPlaylists] = useState<
    { id: string; title: string; thumbnail_url: string; channel_title: string }[]
  >([]);

  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname ?? '');
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const debouncedNickname = useDebounce(nicknameInput, 300);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchUserPreference = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('preference')
        .eq('user_id', user.id)
        .single();

      const raw = data?.preference;
      if (error) return console.error('유저 preference 불러오기 실패:', error);

      try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        setPreference(Array.isArray(parsed) ? parsed : []);
      } catch {
        setPreference([]);
      }
    };

    fetchUserPreference();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchSavedPlaylists = async () => {
      const { data, error } = await supabase
        .from('saved_playlists')
        .select('id, title, thumbnail_url, channel_title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('플레이리스트 불러오기 실패:', error);
        return;
      }

      setSavedPlaylists(data ?? []);
    };

    fetchSavedPlaylists();
  }, [user]);

  useEffect(() => {
    if (!editingNickname || debouncedNickname === user?.nickname) {
      setNicknameError(null);
      return;
    }

    const validate = async () => {
      const error = await validateNickname(debouncedNickname.trim());
      setNicknameError(error);
    };

    validate();
  }, [debouncedNickname, editingNickname, user?.nickname]);

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <Header />

        <div className="px-4 pt-16 pb-6 space-y-4">
          <h2 className="text-lg font-bold  text-blue-400 text-center">마이페이지</h2>

          {/* 닉네임 */}
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

          {/* 선호 장르 */}
          <div className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">🎧 선호 장르</p>
            {preference.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {preference.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">선호 장르 정보가 없습니다.</p>
            )}
          </div>

          {/* 저장된 플레이리스트 */}
          <div className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">📂 저장된 플레이리스트</p>
            {savedPlaylists.length > 0 ? (
              <ul className="space-y-3">
                {savedPlaylists.map((pl) => (
                  <li
                    key={pl.id}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <img
                      src={pl.thumbnail_url}
                      alt={pl.title}
                      className="w-14 h-14 rounded-md object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold truncate">{pl.title}</p>
                      <p className="text-[11px] text-gray-500">{pl.channel_title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">저장된 플레이리스트가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;