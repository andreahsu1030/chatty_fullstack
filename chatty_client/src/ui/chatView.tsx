import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { timeFormat } from '../utils/dateFormate'
import { others } from '../utils/icons'
import { getUserProfile } from '../services/profileService'

export default function ChatView() {
  const SendIcon = others.send
  const { msgData, handleSendMsg } = useChat()
  const { user } = useAuth()
  const [enteredContent, setEnteredContent] = useState('')
  const [userAvatar, setUserAvatar] = useState<string>('')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [msgData])

  useEffect(() => {
    const getUserAvatar = async () => {
      if (!user) return
      const res = await getUserProfile(user.id)
      setUserAvatar(res.avatar)
    }
    getUserAvatar()
  }, [user])

  return (
    <div className='h-screen w-full p-5 flex flex-col'>
      <div className='h-[5%] flex items-center font-bold text-lg'>
        {msgData?.nickname}
      </div>

      <div className='scroll-auto h-4/5 overflow-auto' ref={chatContainerRef}>
        {msgData?.data === null
          ? ''
          : msgData?.data.map((i) => (
              <div className='p-3' key={`${i.timestamp}-${i.content}`}>
                <ChatBubble
                  sender={i.sender === user?.id}
                  content={i.content}
                  timestamp={i.timestamp}
                  recipientImg={msgData.avatar}
                  senderImg={userAvatar}
                  read={i.read}
                />
              </div>
            ))}
      </div>

      {msgData && (
        <div className='h-[15%] w-full flex items-center relative border-t p-3'>
          {/* 發訊息 */}
          <div className='relative w-full'>
            <textarea
              className='w-full pr-12 py-2 px-4 text-sm bg-gray-100 rounded-lg outline-none border-none resize-none overflow-auto'
              placeholder='Type your message here...'
              value={enteredContent}
              onChange={(e) => {
                setEnteredContent(e.target.value)
              }}
            />
            <button
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              onClick={() => {
                handleSendMsg(enteredContent)
                setEnteredContent('')
              }}
            >
              <SendIcon size={25} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface ChatBubbleProps {
  sender: boolean
  content: string
  timestamp: string
  recipientImg?: string
  senderImg?: string
  read: boolean
}

const ChatBubble = ({
  sender,
  content,
  timestamp,
  recipientImg,
  senderImg,
  read
}: ChatBubbleProps) => {
  const detail = (
    <div className={`text-xs opacity-55 ${sender ? 'mr-2' : 'ml-3'}`}>
      <p className='mx-1'>{read && 'read'}</p>
      {timeFormat(timestamp).time}
    </div>
  )
  return (
    <div
      className={`flex items-end ${sender ? 'justify-end' : 'justify-start'}`}
    >
      {/* 使用者頭像 */}
      {!sender && (
        <img
          src={recipientImg}
          alt='avatar'
          className='w-9 h-9 rounded-full mr-3'
        />
      )}
      {sender && detail}
      {/* 對話框 */}
      <div
        className={`max-w-[75%] px-4 py-2 rounded-lg text-white flex ${
          sender ? 'bg-blue-500' : 'bg-gray-500'
        }`}
      >
        {content}
      </div>

      {!sender && detail}

      {/* 右邊對齊的頭像 */}
      {sender && (
        <img
          src={senderImg}
          alt='avatar'
          className='w-9 h-9 rounded-full ml-3'
        />
      )}
    </div>
  )
}
