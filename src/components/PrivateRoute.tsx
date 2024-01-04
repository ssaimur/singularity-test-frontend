import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/user.context'

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const { user } = useUser()
  return user ? element : <Navigate to='/login' />
}

export default PrivateRoute
