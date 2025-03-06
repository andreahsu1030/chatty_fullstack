import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  getFriendsReqList,
  updateFriendshipsStatus
} from '../services/friendshipService'
import Card from '../ui/card'
import Search from '../ui/search'
import { getUsersProfile } from '../services/profileService'

interface FriendshipsProfileProps {
  owner: string
  nickname: string
  avatar: string
}

export default function Friendship() {
  const { user } = useAuth()
  const [friendsProfile, setFriendsProfile] = useState<
    FriendshipsProfileProps[] | null
  >(null)
  const [isNull, setIsNull] = useState<boolean>(false)
  useEffect(() => {
    fetchFriendList()
  }, [user])

  const fetchFriendList = async () => {
    try {
      if (!user) return null
      const usersId = await getFriendsReqList(user.id)

      if (!usersId) {
        setIsNull(true)
        return
      }
      const usersProfile: FriendshipsProfileProps[] = await getUsersProfile(
        usersId
      )
      if (!usersProfile) return

      setFriendsProfile(
        usersProfile.map((user) => ({
          owner: user.owner,
          nickname: user.nickname,
          avatar: user.avatar
        }))
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleFriendshipStatus = async (requester: string, status: string) => {
    try {
      console.log('1', requester, user!.id, status)
      const res = await updateFriendshipsStatus(requester, user!.id, status)
      console.log('handleFriendshipStatus res', res)
    } catch (err) {
      console.log('handleFriendshipStatus', err)
    }
  }
  console.log('friendsProfile', friendsProfile)
  return (
    <div className=' bg-slate-50 px-4 h-screen'>
      <div className='my-3'>
        <div>
          <Search />
        </div>
      </div>
      <div className='border-t border-gray-200 pt-3 space-y-2 '>
        {isNull && (<div className='text-xs text-gray-400 text-center mt-3'> You are so lonely.. </div>)}
        {friendsProfile?.map((user) => (
          <div key={user.owner}>
            <Card
              friendship={{
                onClick: handleFriendshipStatus,
                id: user.owner,
                name: user.nickname,
                avatar: user.avatar
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
