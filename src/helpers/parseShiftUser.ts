import { IShiftData } from '../types/common.type'

export const parseShiftUsers = (shiftUsers: IShiftData[]) => {
  return shiftUsers.map((shiftUser) => {
    if (shiftUser.shift_name === null) {
      return { ...shiftUser, shift_name: 'Not Assigned' }
    }

    return shiftUser
  })
}
