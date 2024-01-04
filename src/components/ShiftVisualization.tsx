import React, { useEffect, useState } from 'react'
import ShiftsChart from './ShiftsChart'
import { IShiftData, RequestType } from '../types/common.type'
import { Spin } from 'antd'
import { sendRequest } from '../configs/axios.config'
import { parseShiftUsers } from '../helpers/parseShiftUser'

const ShiftsVisualization: React.FC = () => {
  const [shiftUsers, setShiftUsers] = useState<IShiftData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAllUsers = async () => {
    setLoading(true)

    const userRes = await sendRequest<IShiftData[]>(
      RequestType.GET,
      'apps/shifts/users/count'
    )
    userRes && setShiftUsers(userRes)
    setLoading(false)
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  if (loading) {
    return (
      <Spin size='large' style={{ margin: '20px auto', display: 'block' }} />
    )
  }

  const parsedShiftUsers = parseShiftUsers(shiftUsers)

  return (
    <div>
      <h2>Users per Shift</h2>
      <ShiftsChart shiftsData={parsedShiftUsers} />
    </div>
  )
}

export default ShiftsVisualization
