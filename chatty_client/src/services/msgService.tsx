import {
  API_MESSAGES_POST_CREATE,
  API_MESSAGES_POST_PREVIEW,
  API_MESSAGES_POST_SEARCH,
  API_MESSAGES_POST_STATUS
} from '../config/api'

export const sendMessage = async (
  chatId: string,
  sender: string,
  content: string
) => {
  const req = {
    chatId,
    sender,
    content
  }
  try {
    const res = await fetch(API_MESSAGES_POST_CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    })
    const result = await res.json()
    return result.data
  } catch (err) {
    console.log('getChatroomList: ', err)
  }
}

export const getMessageByChatId = async (chatId:string)=>{
  
  try{
    const res = await fetch(`${API_MESSAGES_POST_SEARCH}/${chatId}`)
    if(res.ok){
      const result = await res.json()
      return result.data
    }
    return null
  }catch(err){
    console.log('getMessageByChatId: ', err)
  }
}

export const getMessageByQuery = async (chatId: string) => {
  const req = {
    chatId
  }
  try {
    const res = await fetch(API_MESSAGES_POST_SEARCH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    })
    const result = await res.json()
    console.log(result)
    return result.data
  } catch (err) {
    console.log('getChatroomList: ', err)
  }
}

export const updateMessageStatus = async (chatId: string, read: boolean) => {
  const req = {
    chatId,
    read
  }
  try {
    const res = await fetch(API_MESSAGES_POST_STATUS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    })
    const result = res.json()
    console.log(result)
    return result
  } catch (err) {
    console.log('getChatroomList: ', err)
  }
}

export const getPreviewMsg = async (chatIds: string[]) => {
  try {
    const res = await fetch(API_MESSAGES_POST_PREVIEW, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatIds)
    })
   const result = await res.json()
    if(result.status !== 'success') {
      console.log('getPreviewMsg err: ',result.message)
      return null
    }
   return result.data
  } catch (err) {
    console.log('getPreviewMsg :', err)
  }
}
