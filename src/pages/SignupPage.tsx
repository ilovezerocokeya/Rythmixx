import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { validateNickname } from '@/utils/validateNickname';
import Header from '@/components/ui/Header';

const SignupPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  useEffect(() => {
    // 닉네임이 이미 존재하거나 유저가 없을 경우 홈으로 이동
    if (!user || user.nickname) {
      navigate('/');
    }
  }, [user]);

  // 닉네임 등록 및 유저 상태 업데이트 처리
  const handleSignup = async () => {
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

    // Supabase users 테이블에서 닉네임 업데이트
    const { error } = await supabase
      .from('users')
      .update({ nickname })
      .eq('user_id', user.id);

    if (error) {
      console.error('회원정보 저장 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } else {
      // Zustand 전역 상태의 로그인 정보 갱신
      useAuthStore.getState().login({
        id: user.id,
        email: user.email,
        nickname,
      });

      alert(`환영합니다, ${nickname}님!`);
      navigate('/');
    }
  };

  // 닉네임 유효성 검사 및 중복 체크
  const handleNicknameCheck = async () => {
    const errorMessage = await validateNickname(nickname);

    if (errorMessage) {
      alert(errorMessage);
      setIsNicknameValid(false);
    } else {
      alert('사용 가능한 닉네임입니다!');
      setIsNicknameValid(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* 상단 공통 헤더 */}
        <Header />

        <div className="flex flex-col justify-center px-6 pt-8 pb-20 min-h-[640px] h-full space-y-8">
          {/* 타이틀 영역 */}
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
                onClick={handleNicknameCheck}
                className="shrink-0 whitespace-nowrap px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition"
              >
                중복확인
              </button>
            </div>
          </div>
          
          {/* 가입 완료 버튼 */}
          <button
            onClick={handleSignup}
            className="w-full py-3 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            가입 완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;