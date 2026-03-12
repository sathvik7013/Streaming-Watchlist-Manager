import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')
    if (token && username) {
      setUser({ token, username, role })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password })
    const { token, username: name, role } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('username', name)
    localStorage.setItem('role', role)
    setUser({ token, username: name, role })
    return response.data
  }

  const register = async (username, email, password) => {
    const response = await authAPI.register({ username, email, password })
    const { token, username: name, role } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('username', name)
    localStorage.setItem('role', role)
    setUser({ token, username: name, role })
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
