// 精神残疾等级计算
import { CommonOption, RetType } from './CommonType'
import { dictLabel, toInt } from './utils'

export type SpiritForm = {
  adaptiveBehavior: string
  whoDas: number | ''
  whoDasLevelType: string | null
}

export function spiritCalc(
  formData: SpiritForm,
  age: number,
  spiritAdaptive: CommonOption[]
): RetType<SpiritForm> {
  const ret: RetType<SpiritForm> = {
    data: { ...formData },
    error: '',
    level: '',
    hint: '',
  }
  ret.data.whoDas = toInt(ret.data.whoDas)
  ret.data.whoDasLevelType =
    ret.data.whoDas === '' ||
    ret.data.whoDas === null ||
    ret.data.whoDas === undefined
      ? null
      : ret.data.whoDas >= 116
      ? '1'
      : ret.data.whoDas >= 106
      ? '2'
      : ret.data.whoDas >= 96
      ? '3'
      : ret.data.whoDas >= 52
      ? '4'
      : '5'
  if (age > 17) {
    ret.hint = `其WHO—DAS || 分值测试结果为${ret.data.whoDas}`
    ret.level = ret.data.whoDasLevelType || '0'
  } else {
    ret.hint = `其适应性行为测试结果为${dictLabel(
      spiritAdaptive,
      ret.data.adaptiveBehavior
    )}`
    ret.level = age <= 1 ? '5' : ret.data.adaptiveBehavior || '0'
  }
  return ret
}
