import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { UserOutlined, ScheduleOutlined, HomeOutlined } from '@ant-design/icons'
import { useUser } from '../contexts/user.context'
import { EMPLOYEE_ROLE_ID } from '../constants/common.constants'

const { Sider } = Layout

const Sidebar = () => {
  const { user } = useUser()
  const { pathname } = useLocation()
  let defaultSelectedKey = ''

  if (pathname === '/') {
    defaultSelectedKey = 'home'
  } else if (pathname.startsWith('/users')) {
    defaultSelectedKey = 'users'
  } else if (pathname.startsWith('/shifts')) {
    defaultSelectedKey = 'shifts'
  }

  if (user?.role_id === EMPLOYEE_ROLE_ID) {
    return null
  }

  return (
    <Sider width={200} style={{ background: '#fff', paddingTop: '64px' }}>
      <Menu
        mode='inline'
        defaultSelectedKeys={[defaultSelectedKey]}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key='home' icon={<HomeOutlined />}>
          <Link to='/'>Dashboard</Link>
        </Menu.Item>
        <Menu.Item key='users' icon={<UserOutlined />}>
          <Link to='/users'>Users</Link>
        </Menu.Item>
        <Menu.Item key='shifts' icon={<ScheduleOutlined />}>
          <Link to='/shifts'>Shifts</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Sidebar
