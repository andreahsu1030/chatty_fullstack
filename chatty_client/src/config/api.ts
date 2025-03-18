// Signin
export const API_AUTH_POST_SIGNIN = 'http://localhost:3000/auth/signin'

// Signup
export const API_AUTH_POST_SIGNUP = 'http://localhost:3000/auth/signup'

//Get User Profile
export const API_PROFILE_GET_USER = 'http://localhost:3000/profiles/search'

//blur search
export const API_PROFILE_POST_PROFILES = 'http://localhost:3000/profiles/search'

//create
export const API_PROFILES_POST_CREATE = 'http://localhost:3000/profiles/create'

//Get Users Profile
export const API_PROFILE_POST_USERS = 'http://localhost:3000/profiles/batch'

//Upload avatar 帶入userId, file
export const API_PROFILE_POST_AVATAR = 'http://localhost:3000/profiles/upload'

//update profile
export const API_PROFILE_PATCH_CONTENT = 'http://localhost:3000/profiles'

//get user
export const API_AUTH_GET_USER = 'http://localhost:3000/auth/me'

//用登入者id拿好友ids
export const API_FRIENDSHIPS_POST_SEARCH =
  'http://localhost:3000/friendships/search'

//update 好友申請狀態
export const API_FRIENDSHIPS_PATCH_STATUS =
  'http://localhost:3000/friendships/status'

//create chats
export const API_CHATS_POST_CREATE = 'http://localhost:3000/chats'

//get user chat list
export const API_CHATS_GET_LIST = 'http://localhost:3000/chats'

// search chats by id
export const API_CHATS_GET_SEARCH = 'http://localhost:3000/chats/search'

//search chats by participants
export const API_CHATS_POST_SEARCH = 'http://localhost:3000/chats/search'

// preview msg
export const API_MESSAGES_POST_PREVIEW =
  'http://localhost:3000/messages/preview'

//messages
export const API_MESSAGES_POST_CREATE = 'http://localhost:3000/messages'

// search by query
export const API_MESSAGES_POST_SEARCH = 'http://localhost:3000/messages/search'

// update status
export const API_MESSAGES_POST_STATUS = 'http://localhost:3000/messages/status'
