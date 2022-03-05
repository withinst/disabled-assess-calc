// 听力计算
import { toInt } from './utils'
import { RetType } from './CommonType'

export type HearingForm = {
  backgroundNoise: number | ''
  hearingLoss: string
  languageCompetence: string
  testLEar05: number | ''
  testLEar10: number | ''
  testLEar20: number | ''
  testLEar40: number | ''
  testREar05: number | ''
  testREar10: number | ''
  testREar20: number | ''
  testREar40: number | ''
}

export function hearingCalc(
  formData: HearingForm,
  age: number
): RetType<HearingForm> {
  const ret: RetType<HearingForm> = {
    data: { ...formData },
    error: '',
    hint: '',
    level: '0',
  }
  ret.data = { ...ret.data, ...checkNum(ret.data) }
  if (ret.data.backgroundNoise > 50) {
    ret.error = '本地噪音不能大于50'
  } else if (ret.data.backgroundNoise > 40) {
    ret.data.testLEar05 = ''
    ret.data.testREar05 = ''
  }
  if (
    ret.data.backgroundNoise &&
    ret.data.backgroundNoise >= 41 &&
    ret.data.backgroundNoise <= 44
  ) {
    ret.error = '本地噪音不允许输入41 - 44'
    ret.data.backgroundNoise = ''
  }
  let average: number | '' = ''
  if (
    !ret.data.backgroundNoise ||
    ret.data.backgroundNoise > 50 ||
    typeof ret.data.testLEar10 !== 'number' ||
    typeof ret.data.testLEar20 !== 'number' ||
    typeof ret.data.testLEar40 !== 'number' ||
    typeof ret.data.testREar10 !== 'number' ||
    typeof ret.data.testREar20 !== 'number' ||
    typeof ret.data.testREar40 !== 'number'
  ) {
    ret.data.hearingLoss = ''
  } else if (ret.data.backgroundNoise <= 40) {
    if (
      typeof ret.data.testLEar05 === 'number' &&
      typeof ret.data.testREar05 === 'number'
    ) {
      const leftAverage =
        (ret.data.testLEar05 +
          ret.data.testLEar10 +
          ret.data.testLEar20 +
          ret.data.testLEar40) /
        4
      const rightAverage =
        (ret.data.testREar05 +
          ret.data.testREar10 +
          ret.data.testREar20 +
          ret.data.testREar40) /
        4
      average = Math.min(leftAverage, rightAverage)
      ret.data.hearingLoss = calcHearingLoss(Math.round(average))
    }
  } else if (ret.data.backgroundNoise <= 50) {
    const leftAverage =
      (ret.data.testLEar10 + ret.data.testLEar20 + ret.data.testLEar40) / 3
    const rightAverage =
      (ret.data.testREar10 + ret.data.testREar20 + ret.data.testREar40) / 3
    average = Math.min(leftAverage, rightAverage)
    ret.data.hearingLoss = calcHearingLoss(Math.round(average))
  }

  if (!ret.data.hearingLoss) {
    ret.hint = ''
    ret.level = '0'
    return ret
  }
  ret.hint = `其平均听力损失测试结果为${
    typeof average === 'number' ? Math.round(average) + 'dbHL' : ''
  }`
  if (age > 3) {
    ret.level = ret.data.hearingLoss
    return ret
  } else if (age > 1) {
    ret.level = ret.data.hearingLoss === '4' ? '5' : ret.data.hearingLoss
    return ret
  } else {
    ret.level =
      ret.data.hearingLoss === '4' || ret.data.hearingLoss === '3'
        ? '5'
        : ret.data.hearingLoss
    return ret
  }
}

const calcHearingLoss = (average: number) => {
  return average <= 40
    ? '5'
    : average <= 60
    ? '4'
    : average <= 80
    ? '3'
    : average <= 90
    ? '2'
    : '1'
}

const checkNum = (formData: HearingForm) => {
  const ret: HearingForm = { ...formData }
  ret.testREar05 = toInt(formData.testREar05)
  ret.testREar10 = toInt(formData.testREar10)
  ret.testREar20 = toInt(formData.testREar20)
  ret.testREar40 = toInt(formData.testREar40)
  ret.testLEar05 = toInt(formData.testLEar05)
  ret.testLEar10 = toInt(formData.testLEar10)
  ret.testLEar20 = toInt(formData.testLEar20)
  ret.testLEar40 = toInt(formData.testLEar40)
  ret.backgroundNoise = toInt(formData.backgroundNoise)
  return ret
}
