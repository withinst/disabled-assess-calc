// 智力残疾等级计算
import { CommonOption, RetType } from './CommonType'
import { dictLabel, toInt } from './utils'

export type IntelligenceForm = {
  adaptiveBehavior: string
  developIq: number | ''
  developIqLevelType: string
  iq: number | ''
  iqLevelType: string
}

export function intelligenceCalc(
  formData: IntelligenceForm,
  age: number,
  adaptiveBehavior: CommonOption[]
): RetType<IntelligenceForm> {
  const ret: RetType<IntelligenceForm> = {
    data: { ...formData },
    error: '',
    hint: '',
    level: '',
  }
  ret.data.developIq = toInt(ret.data.developIq)
  ret.data.iq = toInt(ret.data.iq)
  if (age >= 7) {
    if (ret.data.iq === null || ret.data.iq === '') {
      ret.data.iqLevelType = ''
    } else if (ret.data.iq < 20) {
      ret.data.iqLevelType = '5'
    } else if (ret.data.iq <= 34) {
      ret.data.iqLevelType = '6'
    } else if (ret.data.iq <= 49) {
      ret.data.iqLevelType = '7'
    } else if (ret.data.iq <= 69) {
      ret.data.iqLevelType = '8'
    } else {
      ret.data.iqLevelType = '9'
    }
  } else {
    if (ret.data.developIq === null || ret.data.developIq === '') {
      ret.data.developIqLevelType = ''
    } else if (ret.data.developIq <= 25) {
      ret.data.developIqLevelType = '1'
    } else if (ret.data.developIq <= 39) {
      ret.data.developIqLevelType = '2'
    } else if (ret.data.developIq <= 54) {
      ret.data.developIqLevelType = '3'
    } else if (ret.data.developIq <= 71) {
      ret.data.developIqLevelType = '4'
    } else if (ret.data.developIq <= 75) {
      ret.data.developIqLevelType = '5'
    } else {
      ret.data.developIqLevelType = '6'
    }
  }
  return levelCalc(ret, age, adaptiveBehavior)
}

// 计算智力残疾等级
export function levelCalc(
  ret: RetType<IntelligenceForm>,
  age: number,
  adaptiveBehavior: CommonOption[]
): RetType<IntelligenceForm> {
  const select = age >= 7 ? ret.data.iqLevelType : ret.data.developIqLevelType
  if (select === '' || select === null || select === undefined) {
    ret.level = '0'
    return ret
  }
  const selectAdapt = dictLabel(adaptiveBehavior, ret.data.adaptiveBehavior)
  if (age >= 7) {
    if (select === '9') {
      ret.hint = `其智商测试结果为${ret.data.iq}`
      ret.level = '5'
      return ret
    } else {
      ret.hint = `其适应性行为测试结果为${selectAdapt}`
      ret.level = ret.data.adaptiveBehavior || '0'
      return ret
    }
  } else if (select !== '6' && select !== '5') {
    ret.hint = `其发展商测试结果为${ret.data.developIq}`
    ret.level = select
    return ret
  } else if (select === '5') {
    ret.hint = `其适应性行为测试结果为${selectAdapt}`
    ret.level = ret.data.adaptiveBehavior
    return ret
  } else {
    ret.hint = `其发展商测试结果为${ret.data.developIq}`
    ret.level = '5'
    return ret
  }
}
