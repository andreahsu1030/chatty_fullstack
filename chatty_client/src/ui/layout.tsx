import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Menu from './menu'
import ChatView from './chatView'
import { useEffect } from 'react'
import { ChatProvider } from '../context/chatContext'

const Layout = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (user === null && !isLoading) {
      navigate('/login')
    }
  }, [user, isLoading])

  return (
    <ChatProvider>
      <div className='h-screen flex'>
        <Menu />

        <div className='w-full flex'>
          <div className='w-2/5'>
            <Outlet />
          </div>
          <div className='w-3/5'>
            <ChatView />
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}

export default Layout
