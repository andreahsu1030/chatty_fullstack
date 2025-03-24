const BASE_URL = 'http://localhost:3000/api/'

// Signin
export const API_AUTH_POST_SIGNIN = `${BASE_URL}auth/signin`

// Signup
export const API_AUTH_POST_SIGNUP = `${BASE_URL}auth/signup`

//Get User Profile
export const API_PROFILE_GET_USER = `${BASE_URL}profiles/search`

//blur search
export const API_PROFILE_POST_PROFILES = `${BASE_URL}profiles/search`

//create
export const API_PROFILES_POST_CREATE = `${BASE_URL}profiles/create`

//Get Users Profile
export const API_PROFILE_POST_USERS = `${BASE_URL}profiles/batch`

//Upload avatar 帶入userId, file
export const API_PROFILE_POST_AVATAR = `${BASE_URL}profiles/upload`

//update profile
export const API_PROFILE_PATCH_CONTENT = `${BASE_URL}profiles`

//get user
export const API_AUTH_GET_USER = `${BASE_URL}auth/me`

//用登入者id拿好友ids
export const API_FRIENDSHIPS_POST_SEARCH =
  `${BASE_URL}friendships/search`

//update 好友申請狀態
export const API_FRIENDSHIPS_PATCH_STATUS =
  `${BASE_URL}friendships/status`

//create chats
export const API_CHATS_POST_CREATE = `${BASE_URL}chats`

//get user chat list
export const API_CHATS_GET_LIST = `${BASE_URL}chats`

// search chats by id
export const API_CHATS_GET_SEARCH = `${BASE_URL}chats/search`

//search chats by participants
export const API_CHATS_POST_SEARCH = `${BASE_URL}chats/search`

// preview msg
export const API_MESSAGES_POST_PREVIEW =
  `${BASE_URL}messages/preview`

//messages
export const API_MESSAGES_POST_CREATE = `${BASE_URL}messages`

// search by query
export const API_MESSAGES_POST_SEARCH = `${BASE_URL}messages/search`

// update status
export const API_MESSAGES_POST_STATUS = `${BASE_URL}messages/status`
