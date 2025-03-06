import { createContext, ReactNode, useEffect, useState } from 'react'
import { getMessageByChatId } from '../services/msgService'
import io from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'

interface ChatContextProps {
  getChatViewData: (
    currentChatId: string,
    recipientId: string,
    nickname: string,
    avatar: string
  ) => void
  msgData: MessageData | null
  handleSendMsg: (content: string) => void
}

interface MessageData {
  nickname: string
  avatar: string
  chatId: string
  recipientId: string
  data: DataProps[]
}

interface DataProps {
  sender: string
  content: string
  read: boolean
  timestamp: string
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [msgData, setMsgData] = useState<MessageData | null>(null)
  const socket = io('http://localhost:3001', {
    auth: { userId: user?.id, username: user?.username }
  })

  socket.on('receiveMessage', (data) => {
    console.log('📩 收到訊息:', data)
    setMsgData((prev) =>
      prev
        ? {
            ...prev,
            data: [
              ...prev.data,
              {
                sender: data.senderId,
                content: data.message,
                read: false,
                timestamp: new Date().toISOString()
              }
            ]
          }
        : prev
    )
  })

  useEffect(() => {
    if (!user || !msgData) return;
  
    socket.emit('join', {
      userId: user.id,
      chatId: msgData.chatId,
      username: user.username,
    });
  
    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [user, msgData?.chatId]); 
  

  const getChatViewData = async (
    chatId: string,
    recipientId: string,
    nickname: string,
    avatar: string,

  ) => {
    setMsgData(null)
    try {
      const res = await getMessageByChatId(chatId)
      setMsgData({ chatId, recipientId, nickname, avatar, data: res })
    } catch (err) {
      console.log('getChatViewData: ', err)
    }
  }

  const handleSendMsg = (content: string) => {
    if (!msgData || !user) return

    // 透過 Socket.IO 發送訊息
    socket.emit('sendMessage', {
      chatId: msgData.chatId,
      sender: user.id,
      recipient: msgData.recipientId,
      content
    })


    setMsgData((prev) =>
      prev
        ? {
            ...prev,
            data: [
              ...prev.data,
              {
                sender: user.id,
                content,
                read: false,
                timestamp: new Date().toISOString()
              }
            ]
          }
        : prev
    )
  }

  return (
    <ChatContext.Provider value={{ getChatViewData, handleSendMsg, msgData }}>
      {children}
    </ChatContext.Provider>
  )
}
