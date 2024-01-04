import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Layout } from 'antd'
import Sidebar from '../components/Sidebar'

const { Header, Content } = Layout

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Navbar />
        </Header>
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
