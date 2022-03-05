// 视力计算
import { RetType } from './CommonType'
import { isEmptyOrNull, numberRange, toFloat } from './utils'

export type VisionForm = {
  viewL: number | ''
  viewR: number | ''
  visionL: number | ''
  visionR: number | ''
  isGetVisionL: boolean | '' | 0 | 1
  isGetVisionR: boolean | '' | 0 | 1
  noVisionLType: string
  noVisionRType: string
  recognitionDistanceL: number | ''
  recognitionDistanceR: number | ''
}

export function visionCalc(
  formData: VisionForm,
  age: number
): RetType<VisionForm> {
  const ret: RetType<VisionForm> = {
    data: { ...formData },
    error: '',
    hint: '',
    level: '0',
  }
  ret.data.viewL = numberRange(ret.data.viewL, 0, 360, true)
  ret.data.viewR = numberRange(ret.data.viewR, 0, 360, true)
  ret.data.visionL = visionCheck(ret.data.visionL)
  ret.data.visionR = visionCheck(ret.data.visionR)
  if (ret.data.isGetVisionR) {
    ret.data.recognitionDistanceR = ''
    ret.data.noVisionRType = ''
  } else {
    ret.data.visionR = ''
    if (ret.data.noVisionRType === '1') {
      ret.data.recognitionDistanceR = 0
    } else if (ret.data.noVisionRType === '2') {
      ret.data.recognitionDistanceR = numberRange(
        ret.data.recognitionDistanceR,
        1,
        5,
        true
      )
    } else if (
      ret.data.noVisionRType === '3' ||
      ret.data.noVisionRType === '4'
    ) {
      ret.data.recognitionDistanceR = numberRange(
        ret.data.recognitionDistanceR,
        1,
        100,
        true
      )
    }
  }

  if (ret.data.isGetVisionL) {
    ret.data.recognitionDistanceL = ''
    ret.data.noVisionLType = ''
  } else {
    ret.data.visionL = ''
    if (ret.data.noVisionLType === '1') {
      ret.data.recognitionDistanceL = 0
    } else if (ret.data.noVisionLType === '2') {
      ret.data.recognitionDistanceL = numberRange(
        ret.data.recognitionDistanceL,
        1,
        5,
        true
      )
    } else if (
      ret.data.noVisionLType === '3' ||
      ret.data.noVisionLType === '4'
    ) {
      ret.data.recognitionDistanceL = numberRange(
        ret.data.recognitionDistanceL,
        1,
        100,
        true
      )
    }
  }
  return levelCalc(ret, age)
}

const visionCheck = (v: number | string): number | '' => {
  const value = toFloat(v)
  if (typeof value !== 'number') {
    return ''
  }
  const ret = Math.max(Math.min(parseFloat(value + ''), 9.99), 0)
  return parseFloat((parseInt(ret * 100 + '', 10) / 100).toFixed(2))
}

const getEyeLevel = (
  getVision: 0 | 1 | '' | boolean,
  vision: number | '',
  view: number | '',
  age: number
): { level: number; situation: 0 | 1 | 2 } => {
  const getVisionLevel = (v: number) =>
    v < 0.02 ? 1 : v < 0.05 ? 2 : v < 0.1 ? 3 : v < 0.3 ? 4 : 5
  const getViewLevel = (v: number) => (v < 5 ? 1 : v < 10 ? 2 : 5)
  if (getVision === '') {
    return {
      level: 0,
      situation: 0,
    }
  }
  if (!getVision) {
    return {
      level: 1,
      situation: 0,
    }
  }
  // 七岁及以下以视力为准
  if (age < 8) {
    if (typeof vision !== 'number') {
      return {
        level: 0,
        situation: 0,
      }
    }
    return {
      level: getVisionLevel(vision),
      situation: 1,
    }
  } else {
    // 七岁以上
    // 两个都没有返回未鉴定
    if (typeof view !== 'number' && typeof vision !== 'number') {
      return {
        level: 0,
        situation: 0,
      }
    }
    let visionLevel = 5
    let viewLevel = 5
    if (typeof view === 'number') {
      viewLevel = getViewLevel(view)
    }
    if (typeof vision === 'number') {
      visionLevel = getVisionLevel(vision)
    }

    return {
      level: Math.min(visionLevel, viewLevel),
      situation: visionLevel <= viewLevel ? 1 : 2,
    }
  }
}

const levelCalc = (
  ret: RetType<VisionForm>,
  age: number
): RetType<VisionForm> => {
  ret.hint = ''
  const isNoVision = ret.data.isGetVisionR === 0 && ret.data.isGetVisionL === 0
  if (isNoVision) {
    ret.hint = '其左右眼都无法得到视力值'
    return ret
  }
  if (
    isEmptyOrNull(ret.data.viewL) &&
    isEmptyOrNull(ret.data.viewR) &&
    isEmptyOrNull(ret.data.visionL) &&
    isEmptyOrNull(ret.data.visionR)
  ) {
    ret.level = '0'
    return ret
  }
  const leftLevel = getEyeLevel(
    ret.data.isGetVisionL,
    toFloat(ret.data.visionL),
    toFloat(ret.data.viewL),
    age
  )
  const rightLevel = getEyeLevel(
    ret.data.isGetVisionR,
    toFloat(ret.data.visionR),
    toFloat(ret.data.viewR),
    age
  )
  const isLeft = leftLevel.level >= rightLevel.level
  const betterSide = isLeft ? leftLevel : rightLevel
  const anotherSide = isLeft ? rightLevel : leftLevel
  const situation = betterSide.situation || anotherSide.situation
  const side = situation === betterSide.situation && isLeft ? 'left' : 'right'
  ret.hint =
    situation === 1
      ? `其较好眼矫正视力测试结果为${
          side === 'left' ? ret.data.visionL : ret.data.visionR
        }`
      : `其较好眼视野测试结果为${
          side === 'left' ? ret.data.viewL : ret.data.viewR
        }`
  ret.level = `${betterSide.level}`
  return ret
}
