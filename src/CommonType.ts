export type RetType<T> = {
  data: T
  error: string
  level: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | string
  hint: string
}

export type CommonOption = {
  label: string
  value: string | number
}
