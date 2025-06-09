import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateNickname } from '../utils/validateNickname';
import { validatePassword } from '@/utils/validatePassword';
import { validateUserId } from '@/utils/validateId'; 

const musicGenres = [
  'Dance', 'Pop', 'Rap/Hiphop', 'R&B/Soul',
  'Rock', 'Jazz', 'Classic', 'EDM',
  'Indie', 'Ballad', '트로트', 'Folk',
];

const SignupPage = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
	const [customDomain, setCustomDomain] = useState('');
	const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [showPassword, setShowPassword] = useState(false);
	const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [birth, setBirth] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [isUserIdValid, setIsUserIdValid] = useState(false);
	const [isNicknameValid, setIsNicknameValid] = useState(false);

  const isPasswordMatch = password === passwordCheck;
  const actualDomain = emailDomain === '직접입력' ? customDomain : emailDomain;

  const fullEmail = `${emailPrefix}@${isCustomDomain ? customDomain : emailDomain}`;

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres((prev) => prev.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres((prev) => [...prev, genre]);
    } else {
      alert('최대 3개의 장르만 선택할 수 있어요.');
    }
  };

  const handleSignup = () => {
	  if (!emailPrefix || !actualDomain || !nickname || !password || !birth || selectedGenres.length === 0) {
	    alert('모든 항목을 입력해주세요.');
	    return;
	  }

	  if (!isUserIdValid) {
	    alert('아이디 중복 확인을 해주세요.');
	    return;
	  }

	  if (!isNicknameValid) {
	    alert('닉네임 중복 확인을 해주세요.');
	    return;
	  }

	  const passwordError = validatePassword(password);
	  if (passwordError) {
	    alert(passwordError);
	    return;
	  }

	  if (!isPasswordMatch) {
	    alert('비밀번호가 일치하지 않습니다.');
	    return;
	  }

	  const userData = {
	    userId,
	    nickname,
	    email: fullEmail,
	    password,
	    birth,
	    selectedGenres,
	  };

	  console.log('회원가입 정보:', userData);
	  alert(`회원가입 완료: ${nickname}`);
	  navigate('/');
	};

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#F5F7FA] text-gray-800">
		  <div className="relative flex flex-col items-center w-[320px] max-w-md max-h-[640px] bg-white rounded-2xl px-5 py-6 space-y-4 shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
		    <button
		      onClick={() => navigate(-1)}
		      className="absolute top-3 left-3 text-xs text-blue-600 hover:underline"
		    >
		      ← 돌아가기
		    </button>

		    <h2 className="text-xl font-bold text-center mb-4 text-blue-600">회원가입</h2>

		    {/* 아이디 */}
		    <div className="w-full flex gap-2 items-center">
		      <input
		        type="text"
		        placeholder="아이디"
		        value={userId}
		        onChange={(e) => setUserId(e.target.value)}
		        className="w-full px-2.5 py-1.5 rounded-md bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
		      />
		      <button
					  className="px-2 py-1.5 rounded-md text-[9px] bg-blue-500 text-white hover:bg-blue-600 transition whitespace-nowrap min-w-[64px]"
					  onClick={() => {
					    const error = validateUserId(userId);
					    if (error) {
					      alert(error);
					      setIsUserIdValid(false);
					    } else {
					      alert('사용 가능한 아이디입니다! (중복 확인 기능은 추후 연결 예정)');
					      setIsUserIdValid(true);
					    }
					  }}
					>
					  중복확인
					</button>
		    </div>

		    {/* 닉네임 */}
		    <div className="w-full flex gap-2 items-center">
				  <input
				    type="text"
				    placeholder="닉네임"
				    value={nickname}
				    onChange={(e) => setNickname(e.target.value)}
				    className="w-full px-2.5 py-1.5 rounded-md bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
				  />
				  <button
				    className="px-2 py-1.5 rounded-md text-[9px] bg-blue-500 text-white hover:bg-blue-600 transition whitespace-nowrap min-w-[64px]"
				    onClick={() => {
					    const error = validateNickname(nickname);
					    if (error) {
					      alert(error);
					      setIsNicknameValid(false);
					    } else {
					      alert('사용 가능한 닉네임입니다! (중복 확인 기능은 추후 연결 예정)');
					      setIsNicknameValid(true);
					    }
					  }}
					>
				    중복확인
				  </button>
				</div>

		    {/* 이메일 */}
		    <div className="w-full flex gap-2 items-center">
		      <input
		        type="text"
		        placeholder="이메일 아이디"
		        value={emailPrefix}
		        onChange={(e) => setEmailPrefix(e.target.value)}
		        className="w-1/2 px-2.5 py-1.5 rounded-md bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
		      />
		      <span className="text-xs">@</span>

		      {isCustomDomain ? (
		        <input
		          type="text"
		          placeholder="example.com"
		          value={customDomain}
		          onChange={(e) => setCustomDomain(e.target.value)}
		          className="w-1/2 px-2.5 py-1.5 rounded-md bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
		        />
		      ) : (
		        <select
		          value={emailDomain}
		          onChange={(e) => {
		            const selected = e.target.value;
		            if (selected === '직접입력') {
		              setIsCustomDomain(true);
		              setEmailDomain('');
		            } else {
		              setIsCustomDomain(false);
		              setEmailDomain(selected);
		            }
		          }}
		          className="w-1/2 px-2.5 py-1.5 rounded-md bg-white text-gray-900 border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
		        >
		          <option value="">선택</option>
		          <option value="naver.com">naver.com</option>
		          <option value="gmail.com">gmail.com</option>
		          <option value="daum.net">daum.net</option>
		          <option value="icloud.com">icloud.com</option>
		          <option value="직접입력">직접입력</option>
		        </select>
		      )}
		    </div>
				
		    {/* 비밀번호 */}
		    {[{ value: password, setValue: setPassword, show: showPassword, toggle: () => setShowPassword(p => !p), placeholder: '비밀번호' },
		      { value: passwordCheck, setValue: setPasswordCheck, show: showPasswordCheck, toggle: () => setShowPasswordCheck(p => !p), placeholder: '비밀번호 확인' }
		    ].map(({ value, setValue, show, toggle, placeholder }, i) => (
		      <div className="w-full relative" key={i}>
		        <input
		          type={show ? 'text' : 'password'}
		          placeholder={placeholder}
		          value={value}
		          onChange={(e) => setValue(e.target.value)}
		          className={`w-full px-2.5 py-1.5 rounded-md bg-white text-gray-900 border ${
		            !isPasswordMatch && i === 1 && passwordCheck ? 'border-red-400' : 'border-gray-300'
		          } placeholder:text-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300`}
		        />
		        <button
		          onClick={toggle}
		          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[10px] text-gray-500"
		        >
		          {show ? '숨기기' : '보기'}
		        </button>
		      </div>
		    ))}

		    {/* 생년월일 */}
		    <input
		      type="date"
		      value={birth}
		      onChange={(e) => setBirth(e.target.value)}
		      className="w-full px-2.5 py-1.5 rounded-md bg-white text-gray-900 border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
		    />

		    {/* 장르 선택 */}
		    <div className="w-full mt-1">
		      <p className="text-[11px] text-gray-500 leading-snug mb-1 text-center">
		        선호 장르를 먼저 선택해주시면<br />추천 플레이리스트에 우선 반영돼요!
		      </p>
		      <p className="text-xs font-medium mb-1 text-center">선호하는 음악 장르 (최대 3개)</p>
		      <div className="flex flex-wrap gap-2 justify-center mt-1.5">
		        {musicGenres.map((genre) => {
		          const isSelected = selectedGenres.includes(genre);
		          return (
		            <button
		              key={genre}
		              type="button"
		              onClick={() => toggleGenre(genre)}
		              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border ${
		                isSelected
		                  ? 'bg-blue-500 text-white border-blue-500'
		                  : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-100'
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
		      className="w-full py-1.5 mt-2 rounded-md bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
		    >
		      회원가입
		    </button>
		  </div>
		</div>
  );
};

export default SignupPage;