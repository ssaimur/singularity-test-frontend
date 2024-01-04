import React from 'react'
import { Form, Input, Button, Select, Typography } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { sendRequest } from '../configs/axios.config'
import { useUser } from '../contexts/user.context'
import { RequestType } from '../types/common.type'
import { IReqRegister, IResLogin } from '../types/auth.type'

const { Title } = Typography
const { Option } = Select

const Register: React.FC = () => {
  const { saveUser } = useUser()
  const navigate = useNavigate()

  const onFinish = async (values: IReqRegister) => {
    console.log('clicked')
    const response = await sendRequest<IResLogin>(
      RequestType.POST,
      '/auth/register',
      values
    )

    if (!response) return

    saveUser(response)
    navigate('/')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Form
        name='register'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ width: 300 }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          Register
        </Title>
        <Form.Item
          name='fullName'
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder='Full Name' />
        </Form.Item>
        <Form.Item
          name='userName'
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder='Username' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='Password' />
        </Form.Item>
        <Form.Item
          name='phoneNumber'
          rules={[
            { required: true, message: 'Please input your phone number!' }
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder='Phone Number' />
        </Form.Item>
        <Form.Item name='email'>
          <Input prefix={<MailOutlined />} type='email' placeholder='Email' />
        </Form.Item>
        <Form.Item
          name='role_id'
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder='Select a role'>
            <Option value={1}>Administrator</Option>
            <Option value={2}>Supervisor</Option>
            <Option value={3}>Employee</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <p>
          Already registered? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
