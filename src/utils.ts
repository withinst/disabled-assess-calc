import { CommonOption } from './CommonType'

export function toFloat(v: unknown): number | '' {
  const ret =
    typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : NaN
  return isNaN(ret) ? '' : ret
}

export function toInt(v: unknown): number | '' {
  const ret =
    typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : NaN
  return isNaN(ret) ? '' : Math.floor(ret)
}

export const numberRange = (
  v: number | string,
  min = 0,
  max = 10,
  integer = false
): number | '' => {
  const value = toFloat(v)
  if (typeof value !== 'number') {
    return ''
  }
  const ret = Math.max(Math.min(parseFloat(value + ''), max), min)
  return integer ? Math.floor(ret) : ret
}

export const isEmptyOrNull = (v: unknown): boolean => {
  return v === '' || v === null
}

export function dictLabel(list: CommonOption[], value: string): string {
  return list.find((o) => o.value === value)?.label || ''
}
