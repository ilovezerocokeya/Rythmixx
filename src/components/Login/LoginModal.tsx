import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

const LoginModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const close = useLoginModalStore((state) => state.close);

  const handleLogin = () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const fakeUser = {
      id: crypto.randomUUID(),
      email,
      nickname: '사용자',
    };

    login(fakeUser);
    close();
  };

  const handleOverlayClick = () => close();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={handleOverlayClick}
    >
      <div
        onClick={stopPropagation}
        className="bg-white w-[300px] px-6 py-6 rounded-2xl shadow-xl border border-gray-200 space-y-5 relative"
      >
        <button
          onClick={close}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-900 text-center">로그인</h2>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          로그인
        </button>

        <div className="text-xs text-gray-500 flex justify-between pt-2">
          <button onClick={() => { close(); navigate('/signup'); }} className="hover:underline text-blue-600">회원가입</button>
          <button onClick={() => { close(); navigate('/find-id'); }} className="hover:underline">아이디 찾기</button>
          <button onClick={() => { close(); navigate('/reset-password'); }} className="hover:underline">비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;