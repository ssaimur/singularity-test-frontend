export const filterNullValues = <T extends Record<string, any>>(
  value: T
): T => {
  const tempObj: Record<string, any> = {}

  Object.entries(value).forEach(([key, value]) => {
    if (value) {
      tempObj[key] = value
    }
  })

  return tempObj as T
}
