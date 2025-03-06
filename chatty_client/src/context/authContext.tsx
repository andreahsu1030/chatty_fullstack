import { createContext, ReactNode, useEffect, useState } from 'react'
import { API_AUTH_GET_USER, API_AUTH_POST_SIGNIN } from '../config/api'

interface User {
  id: string
  username: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true)
      const res = await whosTheUser()
      if (!res) {
        localStorage.removeItem('token')
        setUser(null)
      }
      setUser(res)
      setIsLoading(false)
    }
    checkUser()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(API_AUTH_POST_SIGNIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        throw new Error(`11, HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      setUser(await whosTheUser())
    } catch (err) {
      console.error('Login err:', err)
      throw err
    }
  }

  const whosTheUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('No token found, user is not authenticated.')
        return null
      }
      const res = await fetch(API_AUTH_GET_USER, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok || res.status === 401) {
        localStorage.removeItem('token')
        return null
      }
      
      return await res.json()
    } catch (err) {
      console.log('Auth: ', err)
      return null
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
