import Chatroom from './pages/chatroom'
import Friendship from './pages/friendship'
import Home from './pages/home'
import Notification from './pages/notification'

const pages = [
  { path: '/', element: <Home /> },
  { path: '/friendship', element: <Friendship /> },
  { path: '/notification', element: <Notification /> },
  { path: '/chatroom', element: <Chatroom /> },
]

export default pages
