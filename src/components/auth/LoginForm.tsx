import React, { useState } from 'react'
import { useAuthStore, User } from '@/stores/authStore'

type LoginInput = {
  id: string
  password: string
}

const LoginForm: React.FC = () => {
  const [input, setInput] = useState<LoginInput>({ id: '', password: '' })
  const [error, setError] = useState('')
  const login = useAuthStore((state) => state.login)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInput((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const storedUsers = localStorage.getItem('users')
    let users: (User & { password: string })[] = []

    try {
      users = storedUsers ? JSON.parse(storedUsers) : []
    } catch {
      setError('유저 데이터를 불러올 수 없습니다.')
      return
    }

    const foundUser = users.find(
      (user) => user.id === input.id && user.password === input.password
    )

    if (!foundUser) {
      setError('아이디 또는 비밀번호가 잘못되었습니다.')
      return
    }

    // 👇 password를 제외한 필요한 필드만 명시적으로 추출
    const userWithoutPassword: User = {
      id: foundUser.id,
      email: foundUser.email,
      nickname: foundUser.nickname,
    }

    login(userWithoutPassword)
    alert(`로그인 성공! 환영합니다, ${foundUser.nickname}님`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <input
        name="id"
        placeholder="아이디"
        value={input.id}
        onChange={handleChange}
        required
        className="border px-2 py-1"
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={input.password}
        onChange={handleChange}
        required
        className="border px-2 py-1"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-green-500 text-white py-2 rounded">
        로그인
      </button>
    </form>
  )
}

export default LoginForm