import React, { createContext, useState, useContext, ReactNode } from 'react'
import { IResUser } from '../types/user.type'
import { IResLogin } from '../types/auth.type'

interface UserContextProps {
  user: IResUser | null
  saveUser: (login_info: IResLogin) => void
  setNewUser: (user: IResUser) => void
  logout: () => void
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  saveUser: () => null,
  setNewUser: () => null,
  logout: () => null
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const localUser = localStorage.getItem('user_info')
  const [user, setUser] = useState<IResUser | null>(
    localUser ? JSON.parse(localUser) : null
  )

  const setNewUser = (user: IResUser) => {
    localStorage.setItem('user_info', JSON.stringify(user))
    setUser(user)
  }

  const saveUser = (login_info: IResLogin) => {
    localStorage.setItem('user_info', JSON.stringify(login_info.userInfo))
    localStorage.setItem('access_token', JSON.stringify(login_info.accessToken))
    localStorage.setItem(
      'refreshToken',
      JSON.stringify(login_info.refreshToken)
    )
    setUser(login_info.userInfo)
  }

  const logout = () => {
    localStorage.removeItem('user_info')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, saveUser, logout, setNewUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
