import React from 'react'
import { Avatar, Menu, Dropdown } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/user.context'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const handleProfile = () => {
    navigate(`/profile/${user?.id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menu = (
    <Menu>
      <Menu.Item
        key='profile'
        onClick={handleProfile}
        icon={<ProfileOutlined />}
      >
        Profile
      </Menu.Item>
      <Menu.Item key='logout' onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  )

  const navbarStyles: React.CSSProperties = {
    backgroundColor: '#e0e8f1',
    padding: '10px',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end'
  }

  const avatarStyles: React.CSSProperties = {
    cursor: 'pointer',
    backgroundColor: '#1890ff',
    marginRight: '50px'
  }

  return (
    <div style={navbarStyles}>
      <Dropdown overlay={menu} placement='bottomRight'>
        <Avatar size='large' icon={<UserOutlined />} style={avatarStyles} />
      </Dropdown>
    </div>
  )
}

export default Navbar
