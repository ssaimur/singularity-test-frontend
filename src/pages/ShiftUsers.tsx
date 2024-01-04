import React, { useEffect, useState } from 'react'
import { Table, Button, Space, message, Select } from 'antd'
import { IResUser } from '../types/user.type'
import { sendRequest } from '../configs/axios.config'
import { IList, RequestType } from '../types/common.type'
import { Link, useLocation, useParams } from 'react-router-dom'

const { Option } = Select

const ShiftUsersPage: React.FC = () => {
  const [users, setUsers] = useState<IResUser[]>([])
  const [loading, setLoading] = useState(false)
  const { shiftId } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const shiftName = queryParams.get('shiftName')

  useEffect(() => {
    fetchAllUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllUsers = async () => {
    setLoading(true)

    const userRes = await sendRequest<IList<IResUser>>(
      RequestType.GET,
      `apps/shifts/${shiftId}/users`
    )
    userRes && setUsers(userRes.rows)

    setLoading(false)
  }

  const changeUserRole = async (user_id: number, role_id: number) => {
    setLoading(true)
    await sendRequest(RequestType.PATCH, `/users/${user_id}`, { role_id })
    message.success('User role changed successfully')
    fetchAllUsers()
    setLoading(false)
  }

  const removeUser = async (user_id: number) => {
    setLoading(true)
    await sendRequest(RequestType.DELETE, `/users/${user_id}`)
    message.success('User removed successfully')
    fetchAllUsers()
    setLoading(false)
  }

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (fullName: string, record: IResUser) => (
        <Link to={`/users/${record.id}`}>{fullName}</Link>
      )
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
      render: (role_id: number, record: IResUser) => {
        return (
          <Select
            defaultValue={role_id}
            style={{ width: 120 }}
            onChange={(value) => changeUserRole(record.id, value)}
          >
            <Option value={2}>Supervisor</Option>
            <Option value={3}>Employee</Option>
            {/* Add more options if needed */}
          </Select>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: IResUser) => (
        <Space size='middle'>
          <Button onClick={() => removeUser(record.id)} danger>
            Remove
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <h1>User List {shiftName && `of Shift ${shiftName}`}</h1>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey='id'
      />
    </div>
  )
}

export default ShiftUsersPage
