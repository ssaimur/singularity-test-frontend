export enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface IList<T> {
  rows: T[]
  count: number
}

export interface IShiftData {
  shift_name: string | null
  users_count: string
}
