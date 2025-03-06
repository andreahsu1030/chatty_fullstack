import {
  API_CHATS_POST_CREATE,
  API_CHATS_GET_SEARCH,
  API_CHATS_POST_SEARCH,
  API_CHATS_GET_LIST
} from '../config/api'

export const getUserChatList = async (id: string) => {
  try {
    const res = await fetch(`${API_CHATS_GET_LIST}/${id}`)
    const result = res.json()
    return result
  } catch (err) {
    console.log('getChatroomList: ', err)
  }
}

export const getChatById = async (id: string) => {
  try {
    const res = await fetch(`${API_CHATS_GET_SEARCH}/${id}`)
    const result = res.json()
    console.log(result)
    return result
  } catch (err) {
    console.log('getChatroomList: ', err)
  }
}

export const createChatroom = async (participants: string[]) => {

  try {
    const res = await fetch(API_CHATS_POST_CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participants)
    })
    const result = res.json()
    console.log(result)
    return result
  } catch (err) {
    console.log('createChatroom: ', err)
  }
}

export const getChatsByParticipants = async (ids: string[]) => {
  const obj= {participants: ids}
  try {
    const res = await fetch(API_CHATS_POST_SEARCH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
    const result = await res.json()
    if(!result.data){
      console.log('getChatsByParticipants', result)
    }
    
    return result.data.chatId
  } catch (err) {
    console.log('getChatsByParticipants: ', err)
  }
}
