import { useEffect, useState } from 'react'
import { getUserProfile, getUsersProfile } from '../services/profileService'
import { useAuth } from '../hooks/useAuth'
import { getFriendships } from '../services/friendshipService'
import { FriendsProfileProps, ProfileProps } from '../types/profileTypes'
import Card from '../ui/card'
import Profile from '../ui/profile'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/modal'
import Loading from './loading'

export interface ChildrenProps {
  getChatViewData: (chatId: string) => void
}

const FriendsList = () => {
  const [isModelShow, setIsModelShow] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hoverProfile, setHoverProfile] = useState<FriendsProfileProps>({
    nickname: '',
    bio: '',
    owner: '',
    avatar: ''
  })
  const [isProfileShow, setIsProfileShow] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<ProfileProps>({
    id: '',
    nickname: '',
    bio: '',
    avatar: '',
    friends: []
  })

  const navigate = useNavigate()

  // 拿到登入者的個人資料
  const { user } = useAuth()

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login')
  //   }
  //   if (user) {
  //     fetchUserProfile(user.id)

  //     //拿到登入者的好友id []
  //     fetchRelationship(user.id)
  //   }
  //   // setIsLoading(false)
  // }, [user])

  useEffect(() => {
    const init = async () => {
      if (!user) {
        navigate('/login')
        return
      }
  
      await fetchUserProfile(user.id)
      await fetchRelationship(user.id)
      setIsLoading(false)
    }
  
    init()
  }, [user])
  

  const fetchUserProfile = async (id: string) => {
    try {
      const res = await getUserProfile(id)
      if (res.statusCode === 404) {
        setIsModelShow(true)
      }
      if (!res) return
      setUserProfile({
        ...userProfile,
        id: res.owner,
        nickname: res.nickname,
        bio: res.bio,
        avatar: res.avatar || user?.url
      })
      console.log('aa: ',res.nickname)

    } catch (err) {
      console.log('fetchUserProfile: ', err)
      return null
    }
  }

  //拿到登入者的好友
  const fetchRelationship = async (userId: string) => {
    const idList: string[] = await getFriendships(userId)
    if (idList.length > 0) {
      getFriendsProfile(idList)
    }
  }

  //用好友 id 拿到他們的資料
  const getFriendsProfile = async (ids: string[]) => {
    const res = await getUsersProfile(ids)
    setUserProfile((prev) => ({
      ...prev,
      friends: res ||[]
    }))
  }

  return (
    <div className=' bg-slate-50 px-4 h-screen overflow-y-auto'>
      {isLoading && <Loading />}
      {isModelShow && (
        <Modal
          setUserProfile={setUserProfile}
          userProfile={userProfile}
          onClose={setIsModelShow}
        />
      )}
      <div className='py-3'>
        <div
          onClick={() => {
            setHoverProfile({
              owner: user!.id,
              nickname: userProfile.nickname,
              bio: userProfile.bio,
              avatar: userProfile.avatar
            })
            setIsProfileShow(true)
          }}
        >
          <Card
            friendList={{
              name: userProfile.nickname,
              text: userProfile.bio,
              avatar: userProfile.avatar
            }}
          />
        </div>
      </div>
      <div className='border-t border-gray-200 pt-3 space-y-2 '>
        {userProfile.friends.map((friend) => (
          <div
            className='cursor-pointer'
            key={friend.owner}
            onClick={() => {
              setHoverProfile(friend)
              setIsProfileShow(true)
            }}
          >
            <Card
              friendList={{
                name: friend.nickname,
                text: friend.bio,
                avatar: friend.avatar
              }}
            />
          </div>
        ))}
        {isProfileShow && (
          <div className='absolute left-[22rem] transform -translate-y-1/2 top-52 bg-white shadow-lg rounded-lg p-4 min-w-60 min-h-60'>
            <Profile
              userData={hoverProfile}
              setUserData={setHoverProfile}
              setIsProfileShow={setIsProfileShow}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsList
