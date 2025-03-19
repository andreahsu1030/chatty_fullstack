import p1 from '../avatars/p1.jpeg'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { uploadAvatar, updateProfile } from '../services/profileService'
import { ProfileUserDataProps } from '../types/profileTypes'
import { others } from '../utils/icons'
import { IconType } from 'react-icons'
import { getChatsByParticipants } from '../services/chatService'
import { useChat } from '../hooks/useChat'

export default function Profile({
  userData,
  setIsProfileShow,
  setUserData
}: ProfileUserDataProps) {
  const { user,setUser } = useAuth()
  const { getChatViewData } = useChat()
  const isMe = user?.id === userData.owner

  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const EditIcon: IconType = others.edit
  const CloseIcon: IconType = others.close
  const DoneIcon: IconType = others.done
  const ChatIcon: IconType = others.chat

  // 點擊圖片上傳 (僅限本人)
  const handleImageClick = () => {
    if (isMe && inputRef.current) {
      inputRef.current.click()
    }
  }

  useEffect(()=>{
    if(userData.avatar === '') return

  },[userData])



  // 上傳新頭像 (僅限本人)
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadAvatar(userData.owner, file)
      if(!res || !user) return
      setUserData({ ...userData, avatar: res.fileUrl })
      console.log('user',user)
      setUser({...user, url: res.fileUrl})

    } catch (err) {
      console.error('上傳圖片失敗', err)
    }
  }

  //狀態更新提交 (僅限本人)
  const handleEditProfile = async (
    owner: string,
    enteredNickname: string,
    enteredBio: string
  ) => {
    const data = {
      id: owner,
      nickname: enteredNickname,
      bio: enteredBio
    }
    const res = await updateProfile(data)

    if (!res) {
      console.log('updateProfile err: ', res)
      return
    }
    setUserData({
      ...userData,
      nickname: res.nickname,
      bio: res.bio,
      owner: res.owner
    })
  }

  // chat
  const handleOpenMsg = async () => {
    try {
      if (!user) return
      const participants: string[] = [user?.id, userData.owner]
      const chatId = await getChatsByParticipants(participants)
      
      if (!chatId) return
      await getChatViewData(
        chatId,
        userData.owner,
        userData.nickname,
        userData.avatar
      )
      
      setIsProfileShow(false)
    } catch (err) {
      console.log('handleOpenMsg: ', err)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div
        className='ml-auto cursor-pointer'
        onClick={() => {
          setIsProfileShow(false)
        }}
      >
        <CloseIcon size={20} color='grey' />
      </div>

      {/* 頭像 (僅自己可以點擊上傳) */}
      <div
        className={`w-16 h-16 overflow-hidden rounded-full mt-4 border border-gray-300 ${
          isMe ? 'cursor-pointer' : ''
        }`}
        onClick={handleImageClick}
      >
        <img
          src={userData.avatar || p1}
          alt='Profile'
          className='w-full h-full object-cover'
        />
      </div>
      {isMe && (
        <input
          type='file'
          ref={inputRef}
          className='hidden'
          onChange={handleImageChange}
          accept='image/*'
        />
      )}
      {editing ? (
        <div className='mt-2'>
          <DoneIcon
            size={18}
            className='ml-'
            onClick={() => {
              setEditing(false)
              handleEditProfile(userData.owner, userData.nickname, userData.bio)
            }}
          />
        </div>
      ) : isMe ? (
        <div className='mt-2 cursor-pointer'>
          <EditIcon
            onClick={() => {
              setEditing(true)
            }}
            size={18}
            className='ml-'
          />
        </div>
      ) : null}

      {/* 姓名 */}
      {editing ? (
        <div className='flex items-center '>
          <input
            type='text'
            value={userData.nickname}
            placeholder={isMe ? "What's on your mood ?" : ''}
            readOnly={!isMe}
            onChange={(e) =>
              setUserData({ ...userData, nickname: e.target.value })
            }
            className={`text-center mt-5 text-sm  rounded px-2 py-1 outline-none ${
              isMe && 'border border-gray-300 text-gray-600'
            }`}
          />
        </div>
      ) : (
        <div
          className={`text-center mt-5 text-gray-500 text-sm ${
            isMe ? 'cursor-pointer hover:text-gray-700' : ''
          }`}
        >
          <div className='space-x-6'>{userData.nickname}</div>
        </div>
      )}

      {/* 狀態文字 (僅自己可以點擊編輯) */}
      {editing ? (
        <input
          type='text'
          value={userData.bio}
          readOnly={!isMe}
          placeholder={isMe ? "What's on your mood ?" : ''}
          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          className={`text-center mt-5 text-gray-500 text-sm  rounded px-2 py-1 outline-none ${
            isMe && 'border border-gray-300'
          }`}
        />
      ) : (
        <div
          className={`text-center mt-5 text-gray-500 text-sm ${
            isMe ? 'cursor-pointer hover:text-gray-700' : ''
          }`}
        >
          <div className='space-x-6'>{userData.bio || ''}</div>
        </div>
      )}
      {!isMe && (
        <button
          onClick={() => {
            handleOpenMsg()
          }}
          className='text-xs flex items-center  rounded-2xl py-1 px-3 border pt-1 border-gray-300 transition hover:bg-gray-50 active:scale-95'
        >
          <p className='text-gray-500 mr-1'>Chat</p>
          <ChatIcon size='20' color={'gray'} />
        </button>
      )}
    </div>
  )
}
