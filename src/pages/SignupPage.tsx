import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { validateNickname } from '@/utils/validateNickname';

const musicGenres = [
  'Dance', 'Pop', 'Rap/Hiphop', 'R&B/Soul',
  'Rock', 'Jazz', 'Classic', 'EDM',
  'Indie', 'Ballad', '트로트', 'Folk',
];

const SignupPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [nickname, setNickname] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  useEffect(() => {
	  // 로그인 안 했거나, 닉네임이 이미 있는 경우 → 홈으로 이동
	  if (!user || user.nickname) {
	    navigate('/');
	  }
	}, [user]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres((prev) => prev.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres((prev) => [...prev, genre]);
    } else {
      alert('최대 3개의 장르만 선택할 수 있어요.');
    }
  };

  const handleSignup = async () => {
  if (!nickname || selectedGenres.length === 0) {
    alert('닉네임과 장르는 필수 항목입니다.');
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

  const { error } = await supabase
    .from('users')
    .update({
      nickname,
      preference: selectedGenres,
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('회원정보 저장 오류:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  } else {
    useAuthStore.getState().login({
      id: user.id,
      email: user.email,
      nickname,
    });

    alert(`환영합니다, ${nickname}님!`);
    navigate('/');
  }
};

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#F5F7FA] text-gray-800">
      <div className="flex flex-col items-center w-[320px] max-w-md bg-white rounded-2xl px-5 py-6 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-blue-600">회원 정보 입력</h2>

        {/* 닉네임 */}
        <div className="w-full flex gap-2 items-center">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
          />
          <button
					  onClick={async () => {
					    const errorMessage = await validateNickname(nickname);
						
					    if (errorMessage) {
					      alert(errorMessage);
					      setIsNicknameValid(false);
					    } else {
					      alert('사용 가능한 닉네임입니다!');
					      setIsNicknameValid(true);
					    }
					  }}
					  className="px-2 py-1.5 bg-blue-500 text-white text-[10px] rounded hover:bg-blue-600"
					>
					  중복확인
					</button>
        </div>

        {/* 장르 선택 */}
        <div className="w-full">
          <p className="text-xs text-center mb-1">선호 장르 (최대 3개)</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {musicGenres.map((genre) => {
              const selected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-2 py-1 rounded-full text-[11px] border transition ${
                    selected
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* 제출 */}
        <button
          onClick={handleSignup}
          className="w-full py-1.5 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600"
        >
          가입 완료하기
        </button>
      </div>
    </div>
  );
};

export default SignupPage;