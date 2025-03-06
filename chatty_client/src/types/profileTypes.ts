import React from "react"

export interface FriendsProfileProps {
  owner: string
  nickname: string
  bio: string
  avatar: string
}

export interface ProfileProps {
  id: string
  nickname: string
  bio: string
  avatar: string
  friends: FriendsProfileProps[]
}

export interface ProfileUserDataProps {
  userData: {
    nickname: string
    bio: string
    owner: string
    avatar: string
  }
  setIsProfileShow: React.Dispatch<React.SetStateAction<boolean>>
  setUserData: React.Dispatch<React.SetStateAction<FriendsProfileProps>>
}
