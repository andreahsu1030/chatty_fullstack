import { useEffect, useState } from 'react'
import Card from '../ui/card'
import useAuth from '../hooks/useAuth'
import { getUserChatList } from '../services/chatService'
import { getUsersProfile } from '../services/profileService'
import { getPreviewMsg } from '../services/msgService'
import Search from '../ui/search'
import { timeFormat } from '../utils/dateFormate'
import { ChatroomDataProps } from '../types/chatroomProps'
import useChat from '../hooks/useChat'

export default function Chatroom() {
  const { user } = useAuth()
  const { getChatViewData } = useChat()
  const [chatroomData, setChatroomData] = useState<ChatroomDataProps[]| null>(null)

  useEffect(() => {
    if (user) {
      const userId = user.id
      fetchChatRoom(userId)
    }
  }, [user])

  const fetchChatRoom = async (userId: string) => {
    try {
      const res = await getUserChatList(userId)
      if (res.length === 0) return
      fetchFriendsProfile(res)
    } catch (err) {
      console.log('fetchChatRoom err', err)
    }
  }

  const fetchFriendsProfile = async (
    chatData: { chatId: string; participant: string }[]
  ) => {
    const users: string[] = chatData.map((item) => item.participant)
    const ids: string[] = chatData.map((i) => i.chatId)
    try {
      const profiles = await getUsersProfile(users)
      const friendsProfile = chatData.map((row) => {
        const matchedProfile = profiles.find(
          (i: {
            owner: string
            status: string
            nickname: string
            avatar: string
          }) => row.participant === i.owner
        )
        return {
          ...row,
          id: matchedProfile ? matchedProfile.owner : row.participant,
          chatId: row.chatId,
          nickname: matchedProfile ? matchedProfile.nickname : '',
          avatar: matchedProfile ? matchedProfile.avatar : ''
        }
      })

      fetchFriendsMsg(ids, friendsProfile)
    } catch (err) {
      console.log('fetchFriendsProfile: ', err)
    }
  }

  const fetchFriendsMsg = async (
    ids: string[],
    friendsProfile: {
      chatId: string
      id: string
      nickname: string
      avatar: string
    }[]
  ) => {
    try {
      const res = await getPreviewMsg(ids)
      if (!res?.length) {
        console.log('getPreviewMsg got no data')
        return
      }

      setChatroomData(
        friendsProfile.flatMap((row) => {
          const matchedMsg = res.find(
            (msg: { chatId: string; timestamp: string; content: string }) =>
              row.chatId === msg.chatId
          )
          if (!matchedMsg?.content) return [] // ✅ 直接跳過沒有 `text` 的項目
          return {
            ...row,
            text: matchedMsg.content,
            timestamp: timeFormat(matchedMsg.timestamp)
          }
        })
      )
    } catch (err) {
      console.error('fetchFriendsMsg :', err)
    }
  }

  return (
    <div className=' bg-slate-50 px-4 h-screen'>
      <div className='pt-3 space-y-2 '>
        <Search />
        {chatroomData? chatroomData.map((room) => (
          <div
            key={room.chatId}
            onClick={() => {
              getChatViewData(room.chatId, '' ,room.nickname, room.avatar)
            }}
          >
            <Card
              chatroom={{
                name: room.nickname,
                text: room.text,
                avatar: room.avatar,
                timestamp: {
                  year: room.timestamp?.year,
                  date: room.timestamp?.date,
                  time: room.timestamp?.time
                }
              }}
            />
          </div>
        )) :(
          <div className='text-xs text-gray-400 text-center mt-3'>Chat with your friend ..</div>
        )
      }
      </div>
    </div>
  )
}
