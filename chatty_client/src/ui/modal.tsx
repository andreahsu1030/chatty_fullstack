import { SetStateAction, useState } from 'react'
import { createProfile } from '../services/profileService'
import { ProfileProps } from '../types/profileTypes'
import { useAuth } from '../hooks/useAuth'

interface ModalProps {
  setUserProfile: React.Dispatch<SetStateAction<ProfileProps>>
  userProfile: ProfileProps
  onClose: React.Dispatch<SetStateAction<boolean>>
}

export default function modal({
  setUserProfile,
  userProfile,
  onClose
}: ModalProps) {
  const [nickname, setNickname] = useState<string>('')
  const [hasErr, setHasErr] = useState<boolean>(false)
  const { user } = useAuth()

  const handleEditNickname = async (nickname: string) => {
    if (nickname.trim() === '') return setHasErr(true)
    if (!user) return
    const data = {
      id: user.id,
      nickname: nickname,
      bio: ''
    }
    const res = await createProfile(data)
    if (res) {
      setUserProfile({
        ...userProfile,
        nickname: res.nickname
      })
    }
    onClose(false)
    console.log('handleEditNickname', res)
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
      <div className='bg-white p-8 shadow-lg rounded-lg sm:w-96 space-y-5'>
        <h2 className='mb-6 text-center text-xl font-bold text-slate-700'>
          輸入您的暱稱
        </h2>

        {/* 暱稱輸入框 */}
        <div className='relative mt-6'>
          <input
            name='nickname'
            id='nickname'
            type='text'
            className='form-input p-1 outline-none peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-slate-600'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        {hasErr && (
          <div className='text-xs text-red-600 font-semibold'>
            暱稱不可為空
          </div>
        )}
        {/* 送出 */}
        <div>
          <button
            type='submit'
            className='w-full mt-4 py-1 text-lg text-white font-semibold text-center rounded-full bg-slate-500 transition-all hover:bg-slate-700'
            onClick={() => {
              handleEditNickname(nickname)
            }}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  )
}
