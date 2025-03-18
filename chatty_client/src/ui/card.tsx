import p1 from '../avatars/p1.jpeg'
import { TimeFormateProps } from '../types/chatroomProps'

interface CardProps {
  friendList?: {
    name?: string
    text?: string
    avatar?: string
  }
  chatroom?: {
    name: string
    text?: string
    avatar: string
    timestamp?: TimeFormateProps
  }
  friendship?: {
    id: string
    name: string
    avatar: string
    onClick: (requester: string, status: string) => void
  }
  searchFriends?: {
    id: string
    name: string
    avatar: string
    reqIdList: string[]
    sendReqList: string[]
    onClick: (requester: string, status: string) => void
  }
}

const Card = ({
  friendList,
  chatroom,
  friendship,
  searchFriends
}: CardProps) => {
  const data = friendList || chatroom || friendship || searchFriends

  if (!data) return null

  return (
    <div className='flex items-center p-2'>
      {/* 頭像 */}
      <div className='mr-5 w-14 h-14 overflow-hidden rounded-full'>
        <img
          src={data.avatar || p1}
          alt='Profile'
          className='w-full h-full object-cover'
        />
      </div>

      <div className='flex-1'>
        <div className='font-bold'>{data.name}</div>

        {friendList && (
          <div className='w-4/5 text-gray-500 text-sm truncate'>
            {friendList.text}
          </div>
        )}
        {chatroom && (
          <div className='w-4/5 text-gray-500 text-sm truncate'>
            {chatroom.text}
          </div>
        )}
        {searchFriends && (
          <div className='mt-1 flex gap-2'>
            <button
              disabled={searchFriends.sendReqList.includes(searchFriends.id)}
              onClick={() => {
                searchFriends.onClick(searchFriends.id, 'pending')
              }}
              className={`text-xs font-medium rounded-3xl py-1 px-3 border transition ${
                searchFriends.sendReqList.includes(searchFriends.id)
                  ? 'border-gray-500 text-gray-500'
                  : 'border-green-500 text-green-500 hover:bg-green-100'
              }`}
            >
              {searchFriends.sendReqList.includes(searchFriends.id)
                ? '已送出申請'
                : '添加好友'}
            </button>
          </div>
        )}
        {friendship && (
          <div className='mt-1 flex gap-2'>
            <button
              onClick={() => friendship.onClick(friendship.id, 'accept')}
              className='text-xs font-medium rounded-3xl py-1 px-3 border border-green-400 bg-green-100 text-green-600 transition hover:bg-green-200 active:scale-95'
            >
              接受
            </button>
            <button
              onClick={() => friendship.onClick(friendship.id, 'reject')}
              className='text-xs font-medium rounded-3xl py-1 px-3 border border-red-500 text-red-500 transition hover:bg-red-100 active:scale-95'
            >
              拒絕
            </button>
          </div>
        )}
      </div>

      {chatroom?.timestamp && (
        <div className='ml-auto text-xs text-gray-300 text-center'>
          <div>{chatroom.timestamp.date}</div>
          <div>{chatroom.timestamp.time}</div>
        </div>
      )}
    </div>
  )
}

export default Card
