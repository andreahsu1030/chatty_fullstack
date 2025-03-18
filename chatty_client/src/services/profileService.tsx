import {
  API_PROFILE_PATCH_CONTENT,
  API_PROFILE_POST_AVATAR,
  API_PROFILE_GET_USER,
  API_PROFILE_POST_USERS,
  API_PROFILES_POST_CREATE,
  API_PROFILE_POST_PROFILES
} from '../config/api'
import { FriendsProfileProps } from '../types/profileTypes'

export const blurSearch = async (params: string) => {
  try {
    const res = await fetch(API_PROFILE_POST_PROFILES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({params})
    })
    return await res.json()
  } catch (err) {
    console.log('blurSearch: ', err)
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const res = await fetch(`${API_PROFILE_GET_USER}/${userId}`)
    return await res.json()
  } catch (err) {
    console.log('http err: ', err)
    return null
  }
}

export const getUsersProfile = async (users: string[]) => {
  try {
    const res = await fetch(API_PROFILE_POST_USERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ users })
    })
    if (!res.ok) {
      throw new Error('無法獲取使用者資訊')
    }

    const result = await res.json()
    const usersProfile = result.map((user: FriendsProfileProps) => ({
      owner: user.owner,
      nickname: user.nickname,
      bio: user.bio,
      avatar: user.avatar || ''
    }))
    return usersProfile
  } catch (err) {
    console.log(err)
  }
}

export const uploadAvatar = async (userId: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)
  try {
    const res = await fetch(API_PROFILE_POST_AVATAR, {
      method: 'POST',
      body: formData
    })
    if (!res.ok) {
      throw new Error('無法上傳')
    }
    return await res.json()
  } catch (err) {
    console.log('http err: ', err)
  }
}

export const updateProfile = async (data: object) => {
  try {
    const res = await fetch(API_PROFILE_PATCH_CONTENT, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    return await res.json()
  } catch (err) {
    console.log('updateProfile: ', err)
  }
}

export const createProfile = async (data: object) => {
  try {
    const res = await fetch(API_PROFILES_POST_CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (err) {
    console.log('updateProfile: ', err)
  }
}
