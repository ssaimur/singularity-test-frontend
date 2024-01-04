import React from 'react'
import { Card, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, CalendarOutlined } from '@ant-design/icons'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  const handleWidgetClick = (pagePath: string) => {
    navigate(`/${pagePath}`)
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card
            hoverable
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px'
            }}
            onClick={() => handleWidgetClick('users')}
          >
            <UserOutlined style={{ fontSize: '48px', marginBottom: '10px' }} />
            <h2>Employees</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card
            hoverable
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px'
            }}
            onClick={() => handleWidgetClick('shifts')}
          >
            <CalendarOutlined
              style={{ fontSize: '48px', marginBottom: '10px' }}
            />
            <h2>Shifts</h2>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
