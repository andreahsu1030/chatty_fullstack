import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  getFriendships,
  getFriendsReqList,
  updateFriendshipsStatus
} from '../services/friendshipService'
import Card from '../ui/card'
import Search from '../ui/search'
import { getUsersProfile } from '../services/profileService'

export interface FriendshipsProfileProps {
  owner: string
  nickname: string
  avatar: string
}

export default function Friendship() {
  const { user } = useAuth()
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [friendList, setFriendList] = useState<string[]>([]) //目前好友清單
  const [reqIdList, setReqIdList] = useState<string[]>([]) //收到的申請
  const [sendReqList, setSendReqList] = useState<string[]>([]) //送出的申請

  const [friendsProfile, setFriendsProfile] = useState<
    FriendshipsProfileProps[] | null
  >(null)
  const [searchProfile, setSearchProfile] = useState<
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
      setReqIdList(usersId)

      setFriendList(await getFriendships(user.id))
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

  const handleSendReq = async (requester: string, status: string) => {
    //送出申請
    console.log('handleSendReq', requester)

    try {
      await updateFriendshipsStatus(user!.id, requester, status)
      setSendReqList([...sendReqList, requester])
    } catch (err) {
      console.log(err)
    }
  }
console.log('setFriendsProfile', friendsProfile)
  const handleAcceptReq = async (requester: string, status: string) => {
    //處理收到的申請
    console.log('handleAcceptReq', requester)
    try {
      await updateFriendshipsStatus(requester, user!.id, status)
      setFriendsProfile(friendsProfile!.filter(i=>i.owner !== requester))
      setFriendList([...friendList, requester])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    console.log('目前好友清單 friendList：', friendList)
    console.log('收到的申請 reqIdList', reqIdList)
    console.log('送出的申請 sendReqList', sendReqList)
  }, [friendList, reqIdList, sendReqList])

  return (
    <div className=' bg-slate-50 px-4 h-screen overflow-y-auto'>
      <div className='py-3'>
        <div>
          <Search
            setIsSearch={setIsSearch}
            setSearchProfile={setSearchProfile}
          />
        </div>
      </div>
      <div className='border-t border-gray-200 pt-3 space-y-2 '>
        {isNull && !isSearch && (
          <div className='text-xs text-gray-400 text-center mt-3'>
            You have no friends
          </div>
        )}
        {!isSearch &&
          friendsProfile?.map((user) => (
            <div key={user.owner}>
              <Card
                friendship={{
                  onClick: handleAcceptReq,
                  id: user.owner,
                  name: user.nickname,
                  avatar: user.avatar
                }}
              />
            </div>
          ))}

        {isSearch &&
          searchProfile
            ?.filter(
              (i) => i.owner !== user!.id && !friendList.includes(i.owner)
            )
            .map((user) => (
              <div key={user.owner}>
                <Card
                  searchFriends={{
                    onClick: handleSendReq,
                    sendReqList,
                    reqIdList,
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
