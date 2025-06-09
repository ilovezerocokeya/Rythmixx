import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';

const Mypage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [preference, setPreference] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserPreference = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('preference')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('유저 preference 불러오기 실패:', error);
        return;
      }

      if (Array.isArray(data?.preference)) {
        setPreference(data.preference);
      }
    };

    fetchUserPreference();
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <Header />

        <div className="px-4 pt-[70px] pb-6">
          <h2 className="text-lg font-bold mb-4 text-blue-600">마이페이지</h2>

          <div className="space-y-2 text-sm">
            <p>
              <strong>닉네임:</strong> {user?.nickname}
            </p>
            <p>
              <strong>이메일:</strong> {user?.email}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">🎧 선호 장르</p>
            {preference.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {preference.map((genre) => (
                  <li
                    key={genre}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">선호 장르 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;