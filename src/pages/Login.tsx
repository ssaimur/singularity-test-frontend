import React from 'react'
import { Form, Input, Button, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { sendRequest } from '../configs/axios.config'
import { RequestType } from '../types/common.type'
import { useUser } from '../contexts/user.context'
import { IReqLogin, IResLogin } from '../types/auth.type'

const { Title } = Typography

const Login: React.FC = () => {
  const { saveUser } = useUser()
  const navigate = useNavigate()

  const onFinish = async (values: IReqLogin) => {
    const response = await sendRequest<IResLogin>(
      RequestType.POST,
      '/auth/login',
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
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Form
        name='login'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ width: 300 }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          Login
        </Title>
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
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <p>
          Not registered? <Link to='/register'>Register now</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
