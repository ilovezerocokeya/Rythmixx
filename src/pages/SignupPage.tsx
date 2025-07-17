'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { validateNickname } from '@/utils/validateNickname';
import Header from '@/components/ui/Header';

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [nickname, setNickname] = useState(''); 
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // 유저 정보가 없거나 이미 닉네임이 등록된 경우 홈으로 리다이렉트
    if (!user || user.nickname) {
      navigate('/');
    }
  }, [user?.id, user?.nickname]);

  // 닉네임 저장 처리
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname) {
      alert('닉네임은 필수 항목입니다.');
      return;
    }

    if (!isNicknameValid) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    if (!user?.id || !user?.email) {
      alert('유저 정보가 없습니다.');
      return;
    }

    // Supabase users 테이블 업데이트
    const { error } = await supabase
      .from('users')
      .update({ nickname })
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      alert(error.message || '회원가입 중 오류가 발생했습니다.');
      return;
    }

    // 상태 관리 스토어 갱신
    login({ id: user.id, email: user.email, nickname });

    alert(`환영합니다, ${nickname}님!`);
    navigate('/');
  };

  // 닉네임 중복 확인 처리
  const handleNicknameCheck = async () => {
    setIsChecking(true);

    const errorMessage = await validateNickname(nickname);

    if (errorMessage) {
      alert(errorMessage);
      setIsNicknameValid(false);
    } else {
      alert('사용 가능한 닉네임입니다!');
      setIsNicknameValid(true);
    }

    setIsChecking(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      {/* 중앙 카드 레이아웃 */}
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* 상단 공통 헤더 */}
        <Header />

        {/* 회원가입 폼 */}
        <form
          onSubmit={handleSignup}
          className="flex flex-col justify-center px-6 pt-8 pb-20 min-h-[640px] h-full space-y-8"
        >
          {/* 타이틀 */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">회원 정보 입력</h2>
            <p className="text-sm text-gray-500 mt-1">서비스 이용을 위한 닉네임을 등록해주세요</p>
          </div>

          {/* 닉네임 입력 영역 */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">닉네임</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="닉네임 입력"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                disabled={isChecking}
                className="shrink-0 whitespace-nowrap px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isChecking ? '확인 중...' : '중복확인'}
              </button>
            </div>
          </div>

          {/* 가입 완료 버튼 */}
          <button
            type="submit"
            className="w-full py-3 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            가입 완료하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;