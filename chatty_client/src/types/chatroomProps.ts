export interface TimeFormateProps {
  year: string;
  date: string
  time: string
}

export interface ChatroomDataProps {
  chatId: string
  nickname: string
  avatar: string
  text: string
  timestamp: TimeFormateProps
}