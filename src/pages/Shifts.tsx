import React, { useEffect, useState } from 'react'
import {
  Table,
  Input,
  Button,
  Typography,
  TimePicker,
  Row,
  Col,
  Spin
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { IShifts } from '../types/user.type'
import { sendRequest } from '../configs/axios.config'
import { IList, RequestType } from '../types/common.type'
import { Link } from 'react-router-dom'

const { Title } = Typography

const ShiftsPage: React.FC = () => {
  // const initialShifts: IShifts[] = [
  //   {
  //     id: 1,
  //     name: 'Shift 1',
  //     start_at: '08:00',
  //     end_at: '16:00'
  //   },
  //   {
  //     id: 2,
  //     name: 'Shift 2',
  //     start_at: '09:00',
  //     end_at: '17:00'
  //   }
  //   // Add more shifts as needed
  // ]

  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [shifts, setShifts] = useState<IShifts[]>([])
  const [newShift, setNewShift] = useState<Omit<IShifts, 'id'>>({
    name: '',
    start_at: '',
    end_at: ''
  })
  const [addingNewShift, setAddingNewShift] = useState(false)
  const [loading, setLoading] = useState(false)

  const createShift = async (shift: Omit<IShifts, 'id'>) => {
    setLoading(true)

    await sendRequest<IShifts>(RequestType.POST, 'apps/shifts', shift)

    await fetchAllShifts()
    setLoading(false)
  }

  const updateShift = async (shift: Omit<IShifts, 'id'>, id: number) => {
    setLoading(true)

    await sendRequest<IShifts>(RequestType.PATCH, `apps/shifts/${id}`, shift)

    await fetchAllShifts()
    setLoading(false)
  }

  const deleteShift = async (id: number) => {
    setLoading(true)

    await sendRequest<IShifts>(RequestType.DELETE, `apps/shifts/${id}`)

    await fetchAllShifts()
    setLoading(false)
  }

  const fetchAllShifts = async () => {
    setLoading(true)

    const userRes = await sendRequest<IList<IShifts>>(
      RequestType.GET,
      'apps/shifts'
    )
    userRes && setShifts(userRes.rows)
    setLoading(false)
  }

  useEffect(() => {
    fetchAllShifts()
  }, [])

  const handleEdit = (id: number) => {
    setEditingRow(id)
  }

  const handleSave = (record: Omit<IShifts, 'id'>, id: number) => {
    updateShift(record, id)
    setEditingRow(null)
  }

  const handleTimeChange = (
    field: string,
    value: Dayjs | null,
    record: IShifts
  ) => {
    if (value) {
      const formattedTime = value.format('HH:mm')
      const updatedRecord = { ...record, [field]: formattedTime }
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift.id === record.id ? updatedRecord : shift
        )
      )
    }
  }

  const handleInputChange = (field: string, value: string, record: IShifts) => {
    const updatedRecord = { ...record, [field]: value }
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === record.id ? updatedRecord : shift
      )
    )
  }

  const handleAddNewShift = () => {
    setAddingNewShift(true)
  }

  const handleCancelNewShift = () => {
    setAddingNewShift(false)
    setNewShift({ name: '', start_at: '', end_at: '' })
  }

  const handleSaveNewShift = () => {
    if (newShift.name && newShift.start_at && newShift.end_at) {
      createShift(newShift)
      setAddingNewShift(false)
      setNewShift({ name: '', start_at: '', end_at: '' })
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: IShifts) =>
        editingRow === record.id ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange('name', e.target.value, record)}
          />
        ) : (
          <Link to={`/shifts/${record.id}/users?shiftName=${record.name}`}>
            {text}
          </Link>
        )
    },
    {
      title: 'Start At',
      dataIndex: 'start_at',
      key: 'start_at',
      render: (text: string, record: IShifts) =>
        editingRow === record.id ? (
          <TimePicker
            value={dayjs(text, 'HH:mm')}
            format='HH:mm'
            onChange={(value) => handleTimeChange('start_at', value, record)}
          />
        ) : (
          <span>{text}</span>
        )
    },
    {
      title: 'End At',
      dataIndex: 'end_at',
      key: 'end_at',
      render: (text: string, record: IShifts) =>
        editingRow === record.id ? (
          <TimePicker
            value={dayjs(text, 'HH:mm')}
            format='HH:mm'
            onChange={(value) => handleTimeChange('end_at', value, record)}
          />
        ) : (
          <span>{text}</span>
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: IShifts) => (
        <div>
          {addingNewShift && !record ? (
            <>
              <Button onClick={handleCancelNewShift}>Cancel</Button>
              <Button type='primary' onClick={handleSaveNewShift}>
                Save
              </Button>
            </>
          ) : editingRow !== (record?.id || null) ? (
            <>
              <Button onClick={() => handleEdit(record.id)}>Edit</Button>
              <Button onClick={() => deleteShift(record.id)} danger>
                Remove
              </Button>
            </>
          ) : (
            <Button
              type='primary'
              onClick={() => {
                const { id, ...rest } = record
                handleSave(rest, id)
              }}
            >
              Save
            </Button>
          )}
        </div>
      )
    }
  ]

  const newShiftFields = (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Input
          placeholder='Name'
          value={newShift.name}
          onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
        />
      </Col>
      <Col span={6}>
        <TimePicker
          placeholder='Start At'
          value={
            newShift.start_at ? dayjs(newShift.start_at, 'HH:mm') : undefined
          }
          format='HH:mm'
          onChange={(value) =>
            setNewShift({ ...newShift, start_at: value?.format('HH:mm') || '' })
          }
        />
      </Col>
      <Col span={6}>
        <TimePicker
          placeholder='End At'
          value={newShift.end_at ? dayjs(newShift.end_at, 'HH:mm') : undefined}
          format='HH:mm'
          onChange={(value) =>
            setNewShift({ ...newShift, end_at: value?.format('HH:mm') || '' })
          }
        />
      </Col>
      <Col span={6}>
        <Button type='primary' onClick={handleSaveNewShift}>
          Save
        </Button>
        <Button onClick={handleCancelNewShift}>Cancel</Button>
      </Col>
    </Row>
  )

  return (
    <div>
      <Title level={2}>List of Shifts</Title>
      <Button type='primary' onClick={handleAddNewShift}>
        Add New Shift
      </Button>
      {addingNewShift && (
        <>
          {newShiftFields}
          <br />
        </>
      )}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size='large' />
        </div>
      ) : (
        <Table dataSource={shifts} columns={columns} rowKey='id' />
      )}
    </div>
  )
}

export default ShiftsPage
