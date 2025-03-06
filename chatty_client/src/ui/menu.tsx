import { Link, useNavigate } from 'react-router-dom'

import { menuIcons, others } from '../utils/icons'
import { useAuth } from '../hooks/useAuth'

export default function Menu() {
  const navigate = useNavigate()
  const Logout = others.logout
  const { logout } = useAuth()
  return (
    <>
      <header className='bg-red-300 p-2'>
        <div className='items-center'>
          <Link to='/'>
            <h1 className='text-slate-50 font-bold mb-4'>Chatty</h1>
          </Link>
          <div className='space-y-6 flex-col flex items-center mt-5'>
            <div className='space-y-6'>
              {menuIcons.map((item) => {
                const IconComponent = item.icon

                return (
                  <div key={item.name} className='cursor-pointer'>
                    <IconComponent
                      color='#fff'
                      size={35}
                      onClick={() => {
                        navigate(item.url)
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <div className='cursor-pointer text-center'>
              <Logout
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/login')
                  logout()
                }}
                color='#fff'
                size={35}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
