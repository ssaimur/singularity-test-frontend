export type TWeekDays =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'

export interface IResUser {
  id: number
  userName: string
  role_id: number
  role_name: string
  phoneNumber: string
  email?: string
  fullName: string
  avatarUri?: string
  is_active: boolean
  shift_id?: number
  shift?: {
    name: string
    start_at: string
    end_at: string
  }
  weekday_start?: TWeekDays
  weekday_end?: TWeekDays
}

export interface IShifts {
  id: number
  name: string
  start_at: string
  end_at: string
}

export interface ICreateUser {
  userName: string
  password: string
  role_id: number
  phoneNumber: string
  email: string
  fullName: string
  is_active: boolean
  shift_id?: number
  weekday_start?: TWeekDays
  weekday_end?: TWeekDays
}
