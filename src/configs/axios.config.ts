import axios from 'axios'
import { notification } from 'antd'
import { RequestType } from '../types/common.type'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const sendRequest = async <T>(
  method: RequestType,
  url: string,
  data: any = null
): Promise<T | undefined> => {
  try {
    const token = localStorage.getItem('access_token')
    const bearerToken = token ? JSON.parse(token) : ''

    const response = await instance.request<T>({
      method,
      url,
      ...(data && { data }),
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
    return response.data
  } catch (error: any) {
    console.log({ error })
    const errorMessage =
      error.response?.data?.message || 'Something went wrong!'

    notification.error({
      message: 'Error',
      description: errorMessage
    })
  }
}

export default instance
