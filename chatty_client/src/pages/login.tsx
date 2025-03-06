import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [hasErr, setHasErr] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user, isLoading, login } = useAuth()

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/')
    }
  }, [user, isLoading, navigate])

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password)
      setHasErr(false)
    } catch (err) {
      console.log('Auth', err)
      setHasErr(true)
      navigate('/')
    }
  }

  return (
    <div className='h-screen flex flex-col justify-between'>
      <div className='flex justify-center items-center flex-grow bg-gray-50'>
        <form
          className='bg-white p-8 shadow-lg rounded-lg sm:w-96'
          method='post'
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin(username, password)
          }}
        >
          <h2 className='mb-6 text-center text-xl font-bold text-slate-700'>
            Chatty
          </h2>
          {hasErr && (
            <div className='bg-red-100 w-full p-2'>
              <p className='text-red-500 text-center'>請輸入正確的帳號密碼。</p>
            </div>
          )}

          <div className='relative mt-16'>
            <input
              name='username'
              id='username'
              type='text'
              placeholder='example@gmail.com'
              className='form-input p-1 outline-none focus:border-slate-600 peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            <label
              htmlFor='username'
              className='absolute left-0 -top-4 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-sm'
            >
              帳號
            </label>
          </div>

          <div className='relative mt-16'>
            <input
              name='password'
              id='password'
              type='password'
              placeholder='密碼'
              className='form-input p-1 outline-none focus:border-slate-600 peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <label
              htmlFor='password'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-sm'
            >
              密碼
            </label>
          </div>
          <div>
            <button
              type='submit'
              className='w-full mt-14 py-2 text-lg text-white font-semibold text-center rounded-full bg-slate-500 transition-all hover:bg-slate-600'
            >
              登入
            </button>
          </div>
          {/* 已有帳號？轉跳登入 */}
          <div className='text-center mt-4 text-sm text-gray-600'>
            新使用者？
            <button
              type='button'
              onClick={() => navigate('/signup')}
              className='text-blue-500 hover:underline'
            >
              註冊
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
