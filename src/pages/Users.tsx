import React, { useCallback, useEffect, useState } from 'react'
import { Table, Button, Space, message, Select, Tabs } from 'antd'
import { IResUser } from '../types/user.type'
import { sendRequest } from '../configs/axios.config'
import { IList, RequestType } from '../types/common.type'
import TabPane from 'antd/es/tabs/TabPane'
import { Link } from 'react-router-dom'
import UserDetails from './UserDetails'
import { useUser } from '../contexts/user.context'
import {
  ADMIN_ROLE_ID,
  SUPERVISOR_ROLE_ID
} from '../constants/common.constants'

const { Option } = Select

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<IResUser[]>([])
  const [deletedUsers, setDeletedUsers] = useState<IResUser[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const fetchAllUsers = useCallback(async () => {
    setLoading(true)

    const forWho = user?.role_id === ADMIN_ROLE_ID ? 'admin' : 'supervisor'

    const userRes = await sendRequest<IList<IResUser>>(
      RequestType.GET,
      `users/for-${forWho}`
    )
    userRes && setUsers(userRes.rows)

    const deletedUserRes = await sendRequest<IList<IResUser>>(
      RequestType.GET,
      'users/for-admin?recycleBin=true'
    )
    deletedUserRes && setDeletedUsers(deletedUserRes.rows)

    setLoading(false)
  }, [user?.role_id])

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

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

  const restoreUser = async (user_id: number) => {
    setLoading(true)
    await sendRequest(RequestType.PATCH, `/users/${user_id}/restore`)
    message.success('User restored successfully')
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
            disabled={user?.role_id === SUPERVISOR_ROLE_ID}
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

  const deletedColumns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName'
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
      dataIndex: 'role_name',
      key: 'role_name'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: IResUser) => (
        <Space size='middle'>
          <Button onClick={() => restoreUser(record.id)}>Restore</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <h1>User List</h1>
      <Tabs defaultActiveKey='currentUsers'>
        <TabPane tab='Current Users' key='currentUsers'>
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey='id'
          />
        </TabPane>
        <TabPane tab='Deleted Users' key='deletedUsers'>
          <Table
            columns={deletedColumns}
            dataSource={deletedUsers}
            loading={loading}
            rowKey='id'
          />
        </TabPane>
        <TabPane tab='Add User' key='addUser'>
          <UserDetails fetchUsers={fetchAllUsers} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default UsersPage
