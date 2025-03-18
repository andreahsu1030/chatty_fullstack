import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Menu from './menu'
import ChatView from './chatView'
import { useEffect } from 'react'
import { ChatProvider } from '../context/chatContext'
import Loading from '../pages/loading'

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
      {isLoading && <Loading />}
      <div className='h-screen flex'>
        <Menu />

        <div className='w-full flex'>
          <div className='w-1/3'>
            <Outlet />
          </div>
          <div className='w-2/3'>
            <ChatView />
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}

export default Layout
