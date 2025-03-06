import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { API_AUTH_POST_SIGNUP } from '../config/api'

export default function Register() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [hasErr, setHasErr] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !password || !confirmPassword) {
      setHasErr('請填寫所有欄位！')
      return
    }
    if (password !== confirmPassword) {
      setHasErr('密碼與確認密碼不一致！')
      return
    }
    try {
      const response = await fetch(API_AUTH_POST_SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
    } catch (err) {
      console.log(err)
    }
    navigate('/login')
  }

  return (
    <div className='h-screen flex flex-col justify-center bg-gray-50'>
      <div className='flex justify-center items-center flex-grow'>
        <form
          className='bg-white p-8 shadow-lg rounded-lg sm:w-96 space-y-5'
          method='post'
          onSubmit={handleRegister}
        >
          <h2 className='mb-6 text-center text-xl font-bold text-slate-700'>
            Chatty
          </h2>

          {hasErr && (
            <div className='bg-red-100 w-full p-2 mb-4 rounded'>
              <p className='text-red-500 text-center'>{hasErr}</p>
            </div>
          )}

          {/* 使用者帳號 */}
          <div className='relative mt-4'>
            <input
              name='username'
              id='username'
              type='text'
              placeholder='使用者帳號'
              className='form-input p-1 outline-none peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-slate-600'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label
              htmlFor='username'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-sm'
            >
              使用者帳號
            </label>
          </div>

          {/* 密碼 */}
          <div className='relative mt-6'>
            <input
              name='password'
              id='password'
              type='password'
              placeholder='密碼'
              className='form-input  p-1 outline-none peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-slate-600'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor='password'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-sm'
            >
              密碼
            </label>
          </div>

          {/* 確認密碼 */}
          <div className='relative mt-6'>
            <input
              name='confirmPassword'
              id='confirmPassword'
              type='password'
              placeholder='確認密碼'
              className='form-input  p-1 outline-none peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-slate-600'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor='confirmPassword'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-sm'
            >
              確認密碼
            </label>
          </div>

          {/* 註冊按鈕 */}
          <div>
            <button
              type='submit'
              className='w-full mt-8 py-1 text-lg text-white font-semibold text-center rounded-full bg-slate-500 transition-all hover:bg-slate-700'
            >
              註冊
            </button>
          </div>

          {/* 已有帳號？轉跳登入 */}
          <div className='text-center mt-4 text-sm text-gray-600'>
            已有帳號？
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='text-blue-500 hover:underline'
            >
              立即登入
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
