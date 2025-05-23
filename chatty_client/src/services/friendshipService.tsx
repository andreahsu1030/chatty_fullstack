import {
  API_FRIENDSHIPS_PATCH_STATUS,
  API_FRIENDSHIPS_POST_SEARCH
} from '../config/api'

export const getFriendships = async (userId: string) => {
  const obj = { userId: userId, options: 1 }
  try {
    const res = await fetch(API_FRIENDSHIPS_POST_SEARCH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    if (!res.ok) {
      return null
    }
    const result = await res.json()
    return result.data
  } catch (err) {
    console.log('findRelation: ', err)
  }
}

export const getFriendsReqList = async (userId: string) => {
  const obj = { userId: userId, options: 2 }
  try {
    const res = await fetch(API_FRIENDSHIPS_POST_SEARCH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    if (!res.ok) {
      console.warn(`API returned status ${res.status}`)
    }

    const result = await res.json()
    if (result.data.length === 0) {
      return null
    }
    return result.data
  } catch (err) {
    console.log('findRelation: ', err)
  }
}

export const updateFriendshipsStatus = async (
  requester: string,
  recipient: string,
  status: string
) => {
  const obj = {
    requester,
    recipient,
    status
  }

  try {
    const res = await fetch(API_FRIENDSHIPS_PATCH_STATUS, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })

    const result = await res.json()
    console.log(result)
    return result.data
  } catch (err) {
    console.log('updateFriendshipsStatus ERR', err)
  }
}
