import React from 'react'
import Dashboard from '../components/Dashboard'
import { useUser } from '../contexts/user.context'
import { Navigate } from 'react-router-dom'
import { EMPLOYEE_ROLE_ID } from '../constants/common.constants'
import ShiftsVisualization from '../components/ShiftVisualization'

const AdminPage: React.FC = () => {
  const { user } = useUser()

  if (user?.role_id === EMPLOYEE_ROLE_ID) {
    return <Navigate to={`/profile/${user.id}`} />
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <ShiftsVisualization />
      <Dashboard />
    </div>
  )
}

export default AdminPage
