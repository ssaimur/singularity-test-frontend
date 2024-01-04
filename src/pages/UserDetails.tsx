import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IResUser, IShifts, ICreateUser } from '../types/user.type'
import { Spin, Form, Input, Button, message, Select } from 'antd'
import { IList, RequestType } from '../types/common.type'
import { sendRequest } from '../configs/axios.config'
import {
  ADMIN_ROLE_ID,
  EMPLOYEE_ROLE_ID,
  weekdays
} from '../constants/common.constants'
import { useUser } from '../contexts/user.context'
import { filterNullValues } from '../helpers/filterNullValues'

interface IUserDetails {
  edit?: boolean
  profile?: boolean
  fetchUsers?: () => void
}

const UserDetails: React.FC<IUserDetails> = ({ edit, fetchUsers, profile }) => {
  const { userId } = useParams<{ userId: string }>()
  const isEdit = edit && userId
  const { user: loggedInUser, setNewUser } = useUser()
  const [user, setUser] = useState<Partial<IResUser> | null>(
    profile ? loggedInUser : null
  )
  const [shifts, setShifts] = useState<IShifts[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [roleId, setRoleId] = useState(user?.role_id)
  const isAdmin = loggedInUser?.role_id === ADMIN_ROLE_ID

  const getUser = useCallback(async () => {
    const userDetails = await sendRequest<IResUser>(
      RequestType.GET,
      `/users/${userId}`
    )
    userDetails && setUser(userDetails)
    userDetails && setRoleId(userDetails.role_id)
    form.setFieldsValue(userDetails)

    profile && userDetails && setNewUser(userDetails)
  }, [form, userId, profile, setNewUser])

  const updateUser = async (user_id: string, data: Partial<ICreateUser>) => {
    setLoading(true)
    const body = filterNullValues(data)
    await sendRequest(RequestType.PATCH, `/users/${user_id}`, body)
    message.success('User updated successfully')
    setLoading(false)
    fetchUsers && fetchUsers()
  }

  const createUser = async (data: ICreateUser) => {
    setLoading(true)
    const body = filterNullValues(data)
    const user = await sendRequest<IResUser>(RequestType.POST, `/users`, body)
    user && message.success('User Created successfully')
    user && form.resetFields()
    setLoading(false)
    fetchUsers && fetchUsers()
  }

  useEffect(() => {
    const getShifts = async () => {
      const shifts = await sendRequest<IList<IShifts>>(
        RequestType.GET,
        `/apps/shifts`
      )
      shifts && setShifts(shifts.rows)
    }

    getShifts()
    isEdit && getUser()
  }, [userId, form, isEdit, getUser])

  const onFinish = async (values: ICreateUser) => {
    setUser({ ...user, ...values })
    if (isEdit || profile) {
      await updateUser(userId!, values)
    } else {
      await createUser(values)
    }
  }

  if (loading) {
    return (
      <Spin size='large' style={{ margin: '20px auto', display: 'block' }} />
    )
  }

  return (
    <div style={styles.container}>
      <h2>
        {isEdit ? 'User Details' : profile ? 'Profile Information' : 'Add User'}
      </h2>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={(isEdit || profile) && user ? user : undefined}
      >
        <Form.Item
          rules={[{ required: true, message: 'Please input your full name!' }]}
          label='Full Name'
          name='fullName'
          style={styles.leftAligned}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input your username!' }]}
          label='Username'
          name='userName'
          style={styles.leftAligned}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: isEdit || profile ? false : true,
              message: 'Please input your password!'
            }
          ]}
          label='Password'
          name='password'
          style={styles.leftAligned}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          rules={[
            { required: true, message: 'Please input your phone number!' }
          ]}
          label='Phone Number'
          name='phoneNumber'
          style={styles.leftAligned}
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please input your email!' }]}
          label='Email'
          name='email'
          style={styles.leftAligned}
        >
          <Input />
        </Form.Item>

        {
          <Form.Item
            rules={[{ required: true, message: 'Please select a status!' }]}
            label='Status'
            name='is_active'
          >
            <Select
              disabled={loggedInUser?.role_id === EMPLOYEE_ROLE_ID}
              placeholder='Select a Status'
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        }

        <Form.Item
          rules={[{ required: !profile, message: 'Please select a role!' }]}
          label='Role Name'
          name='role_id'
        >
          <Select
            placeholder='Select a role'
            onSelect={(value) => setRoleId(value)}
            disabled={profile}
          >
            {profile && <Select.Option value={1}>Administrator</Select.Option>}
            {(isAdmin || profile) && (
              <Select.Option value={2}>Supervisor</Select.Option>
            )}
            <Select.Option value={3}>Employee</Select.Option>
          </Select>
        </Form.Item>

        {roleId === EMPLOYEE_ROLE_ID && (
          <Form.Item
            rules={[{ required: !profile, message: 'Please select a shift!' }]}
            label='Shifts'
            name='shift_id'
          >
            <Select placeholder='Select a Shift' disabled={profile}>
              {shifts?.map((shift) => (
                <Select.Option value={shift.id}>{shift.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {roleId === EMPLOYEE_ROLE_ID && (
          <Form.Item
            rules={[
              { required: !profile, message: 'Please select a start day!' }
            ]}
            label='Weekday Start'
            name='weekday_start'
          >
            <Select placeholder='Select a Start Day' disabled={profile}>
              {weekdays?.map((weekday) => (
                <Select.Option value={weekday[0]}>{weekday[1]}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {roleId === EMPLOYEE_ROLE_ID && (
          <Form.Item
            rules={[
              { required: !profile, message: 'Please select a end day!' }
            ]}
            label='Weekday End'
            name='weekday_end'
          >
            <Select placeholder='Select a End Day' disabled={profile}>
              {weekdays?.map((weekday) => (
                <Select.Option value={weekday[0]}>{weekday[1]}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button type='primary' htmlType='submit' disabled={loading}>
            {isEdit || profile ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    border: '1px solid #e8e8e8',
    borderRadius: '5px',
    maxWidth: '600px',
    margin: '0 auto',
    marginTop: '20px',
    backgroundColor: '#fff'
  },
  leftAligned: {
    textAlign: 'left'
  }
}

export default UserDetails
