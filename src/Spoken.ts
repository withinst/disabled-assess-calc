// 语言能力计算
import { CommonOption, RetType } from './CommonType'
import { dictLabel, numberRange } from './utils'

export type SpokenForm = {
  obstaclesType: string
  spokenPower: string
  voiceArticulation: string
  voiceArticulationValue: number | ''
}

export function spokenCalc(
  formData: SpokenForm,
  age: number,
  spokenPowerList: { label: string; value: string }[]
): RetType<SpokenForm> {
  const ret = {
    data: { ...formData },
    error: '',
    hint: '',
    level: '',
  }
  ret.data.voiceArticulationValue = numberRange(
    ret.data.voiceArticulationValue,
    0,
    100,
    true
  )
  ret.data.voiceArticulation =
    typeof ret.data.voiceArticulationValue !== 'number'
      ? ''
      : ret.data.voiceArticulationValue <= 10
      ? '1'
      : ret.data.voiceArticulationValue <= 25
      ? '2'
      : ret.data.voiceArticulationValue <= 45
      ? '3'
      : ret.data.voiceArticulationValue <= 65
      ? '4'
      : '5'
  return calcLevel(ret, age, spokenPowerList)
}

// 计算语言残疾等级
const calcLevel = (
  ret: RetType<SpokenForm>,
  age: number,
  spokenPowerList: CommonOption[]
): RetType<SpokenForm> => {
  const ability = dictLabel(spokenPowerList, ret.data.spokenPower)

  ret.hint = `其语言清晰度测试结果为${ret.data.voiceArticulationValue}%, 言语能力为${ability}`
  if (age < 3) {
    ret.level = '5'
    return ret
  }
  if (ret.data.voiceArticulation === '' || ret.data.spokenPower === '') {
    ret.level = ''
  } else if (
    ['5', '6', '7'].includes(ret.data.spokenPower) ||
    ret.data.voiceArticulation === '5'
  ) {
    ret.level = '5'
    return ret
  } else if (ret.data.voiceArticulation === '1') {
    ret.level =
      ret.data.spokenPower === '1'
        ? '1'
        : ['2', '3', '4'].includes(ret.data.spokenPower)
        ? '2'
        : ''
    return ret
  } else if (ret.data.voiceArticulation === '2') {
    ret.level = ret.data.spokenPower === '4' ? '3' : ret.data.spokenPower
    return ret
  } else if (ret.data.voiceArticulation === '3') {
    ret.level = ret.data.spokenPower === '1' ? '2' : ret.data.spokenPower
    return ret
  } else if (ret.data.voiceArticulation === '4') {
    ret.level =
      ret.data.spokenPower === '1'
        ? '2'
        : ret.data.spokenPower === '2'
        ? '3'
        : ret.data.spokenPower
    return ret
  }
  ret.level = ret.data.voiceArticulation
  return ret
}
