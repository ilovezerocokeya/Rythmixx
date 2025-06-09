import React, { useState } from 'react'

type NewUser = {
  id: string
  password: string
  email: string
  nickname: string
}

const SignupForm: React.FC = () => {
  const [form, setForm] = useState<NewUser>({
    id: '',
    password: '',
    email: '',
    nickname: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem('users') || '[]') as NewUser[]

    const isDuplicate = users.some((user) => user.id === form.id)
    if (isDuplicate) {
      setError('이미 존재하는 아이디입니다.')
      return
    }

    users.push(form)
    localStorage.setItem('users', JSON.stringify(users))
    alert('회원가입 완료!')
    setForm({ id: '', password: '', email: '', nickname: '' })
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <input
        name="id"
        placeholder="아이디"
        value={form.id}
        onChange={handleChange}
        required
        className="border px-2 py-1"
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        required
        className="border px-2 py-1"
      />
      <input
        name="email"
        type="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
        required
        className="border px-2 py-1"
      />
      <input
        name="nickname"
        placeholder="닉네임"
        value={form.nickname}
        onChange={handleChange}
        required
        className="border px-2 py-1"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white py-2 rounded">
        회원가입
      </button>
    </form>
  )
}

export default SignupForm