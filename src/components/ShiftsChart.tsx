import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { IShiftData } from '../types/common.type'

interface ShiftsChartProps {
  shiftsData: IShiftData[]
}

const ShiftsChart: React.FC<ShiftsChartProps> = ({ shiftsData }) => {
  return (
    <BarChart width={600} height={400} data={shiftsData}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='shift_name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar name='Users' dataKey='users_count' fill='#8884d8' />
    </BarChart>
  )
}

export default ShiftsChart
