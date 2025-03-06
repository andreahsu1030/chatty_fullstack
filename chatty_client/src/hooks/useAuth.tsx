import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內使用')
  }
  return context
}

export default useAuth