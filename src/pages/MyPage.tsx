import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'

const MyPage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    alert('로그아웃 되었습니다.')
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="p-4">
        <p>로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">마이페이지</h2>
      <p><strong>아이디:</strong> {user.id}</p>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>닉네임:</strong> {user.nickname}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
      >
        로그아웃
      </button>
    </div>
  )
}

export default MyPage