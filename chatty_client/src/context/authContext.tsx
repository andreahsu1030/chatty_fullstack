import { createContext, ReactNode, useEffect, useState } from 'react'
import { API_AUTH_GET_USER, API_AUTH_POST_SIGNIN } from '../config/api'

interface User {
  id: string
  username: string
  nickname?: string
  url?: string
  bio?: string
}


interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  // setProfile: React.Dispatch<React.SetStateAction<Profile>>
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setHasErr: React.Dispatch<React.SetStateAction<boolean>>
  hasErr: boolean
  setErrMsg: React.Dispatch<React.SetStateAction<string>>
  errMsg: string
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasErr, setHasErr] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string>('')

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
        setHasErr(true)
        setErrMsg('連線問題：請稍後再試')
        return
      }
      const result = await res.json()
      console.log('authContext: ', result)
      if(result.data === '1'){
        setHasErr(true)
        setErrMsg('請輸入正確帳號密碼')
      }
      localStorage.setItem('token', result.access_token)
      setUser(await whosTheUser())
    } catch (err) {
      setHasErr(true)
      console.log(err)
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        login,
        logout,
        hasErr,
        setHasErr,
        errMsg,
        setErrMsg
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
