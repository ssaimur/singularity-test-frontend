import { IResUser } from './user.type'

export interface IResLogin {
  accessToken: string
  userInfo: IResUser
  refreshToken: string
}

export interface IReqLogin {
  userName: string
  password: string
}

export interface IReqRegister {
  userName: string
  password: string
  role_id: number
  phoneNumber: string
  email?: string
  fullName: string
}
