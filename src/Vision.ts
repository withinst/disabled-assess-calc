// 视力计算
import { CommonOption, RetType } from './CommonType'
import { isEmptyOrNull, numberRange, toFloat } from './utils'

export type VisionForm = {
  viewL: number | '' // 左眼视野
  viewR: number | '' // 右眼视野
  visionL: number | '' // 左眼矫正视力
  visionR: number | '' // 右眼矫正视力
  isGetVisionL: boolean | '' | 0 | 1 // 左眼是否有视力
  isGetVisionR: boolean | '' | 0 | 1 // 右眼是否有视力
  noVisionLType: string // 左眼无数值情况
  noVisionRType: string // 右眼无数值情况
  recognitionDistanceL: number | '' // 左眼最远辨认距离
  recognitionDistanceR: number | '' // 右眼最远辨认距离
}

export function visionCalc(
  formData: VisionForm,
  age: number,
  options?: CommonOption[]
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
    // 如果得到右眼视力则将右眼最远辨认距离和右眼无视力数值情况置空
    ret.data.recognitionDistanceR = ''
    ret.data.noVisionRType = ''
  } else {
    // 如果无法得到右眼视力,将右眼矫正视力数据值空
    ret.data.visionR = ''
    if (ret.data.noVisionRType === '1') {
      // 如果右眼无视力情况为’1‘(无光感状态),则右眼最远辨认距离则为0
      ret.data.recognitionDistanceR = 0
    } else if (ret.data.noVisionRType === '2') {
      // 如果右眼无视力情况为2（有光感），则计算右眼最远辨认距离，最远为5米，最近1米
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
      // 如果右眼视力情况为3或4（手动或指数）， 则右眼最远辨认距离，最远100米，最近1米
      ret.data.recognitionDistanceR = numberRange(
        ret.data.recognitionDistanceR,
        1,
        100,
        true
      )
    }
  }

  // 左眼视力同上处理数值
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
  return levelCalc(ret, age, options || [])
}

const visionCheck = (v: number | string): number | '' => {
  const value = toFloat(v)
  if (typeof value !== 'number') {
    return ''
  }
  const ret = Math.max(Math.min(parseFloat(value + ''), 9.99), 0)
  return parseFloat(ret.toFixed(2))
}

/***
 * 获取左眼或右眼残疾等级
 * @param getVision 是否得到视力
 * @param vision 矫正视力
 * @param view 视野数值
 * @param age 年龄
 * @return level: 计算出来的等级，situation: 1则为根据矫正视力计算，2则为根据视野计算
 */
const getEyeLevel = (
  getVision: 0 | 1 | '' | boolean,
  vision: number | '',
  view: number | '',
  age: number
): { level: number; situation: 0 | 1 | 2; value: number } => {
  // 矫正视力小于 0.02一级残疾, 小于 0.05 二级残疾, 小于 0.1 三级残疾， 小于0.3四级残疾，
  // 大于等于0.3 不符合残疾标准
  const getVisionLevel = (v: number) =>
    v < 0.02 ? 1 : v < 0.05 ? 2 : v < 0.1 ? 3 : v < 0.3 ? 4 : 5
  // 视野小于5为一级残疾，视野小于10为二级残疾，大于等于10为不符合
  const getViewLevel = (v: number) => (v < 5 ? 1 : v < 10 ? 2 : 5)
  if (getVision === '') {
    // 未填
    return {
      level: 0,
      situation: 0,
      value: 0,
    }
  }
  // 没有得到视力一级残疾
  if (!getVision) {
    return {
      level: 1,
      situation: 0,
      value: 0,
    }
  }
  // 七岁及以下以视力为准
  if (age < 8) {
    // 如果视力不是数字则返回0
    if (typeof vision !== 'number') {
      return {
        level: 0,
        situation: 0,
        value: 0,
      }
    }
    return {
      level: getVisionLevel(vision),
      situation: 1,
      value: vision,
    }
  } else {
    // 七岁以上
    // 两个都没有返回未鉴定
    if (typeof view !== 'number' && typeof vision !== 'number') {
      return {
        level: 0,
        situation: 0,
        value: 0,
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

    // 视力和视野取残疾等级较重一级
    return {
      level: Math.min(visionLevel, viewLevel),
      value:
        visionLevel === 5 && viewLevel === 5
          ? typeof vision === 'number'
            ? vision
            : view || 0
          : visionLevel <= viewLevel
          ? vision || 0
          : view || 0,
      situation:
        visionLevel === 5 && viewLevel === 5
          ? typeof vision === 'number'
            ? 1
            : 2
          : visionLevel <= viewLevel
          ? 1
          : 2,
    }
  }
}

const levelCalc = (
  ret: RetType<VisionForm>,
  age: number,
  options: CommonOption[]
): RetType<VisionForm> => {
  ret.hint = ''
  const isNoVision =
    (ret.data.isGetVisionR === 0 || ret.data.isGetVisionR === false) &&
    (ret.data.isGetVisionL === 0 || ret.data.isGetVisionL === false)
  if (isNoVision) {
    const leftText = noVisionHint(
      'left',
      ret.data.noVisionLType,
      ret.data.recognitionDistanceL,
      options
    )
    const rightText = noVisionHint(
      'right',
      ret.data.noVisionRType,
      ret.data.recognitionDistanceR,
      options
    )
    ret.hint = `其左右眼都无法得到视力值(${leftText};${rightText})`
    ret.level = '1'
    return ret
  }
  // 如果其中一个可以得到视力，但是矫正视力和视野都为空则为未鉴定
  if (
    isEmptyOrNull(ret.data.viewL) &&
    isEmptyOrNull(ret.data.viewR) &&
    isEmptyOrNull(ret.data.visionL) &&
    isEmptyOrNull(ret.data.visionR)
  ) {
    ret.level = '0'
    return ret
  }
  // 左眼等级
  const leftLevel = getEyeLevel(
    ret.data.isGetVisionL,
    toFloat(ret.data.visionL),
    toFloat(ret.data.viewL),
    age
  )
  // 右眼等级
  const rightLevel = getEyeLevel(
    ret.data.isGetVisionR,
    toFloat(ret.data.visionR),
    toFloat(ret.data.viewR),
    age
  )
  // 左眼更好还是右眼更好
  const isLeft =
    leftLevel.level === rightLevel.level
      ? leftLevel.value >= rightLevel.value
      : leftLevel.level > rightLevel.level
  const betterSide = isLeft ? leftLevel : rightLevel
  const anotherSide = isLeft ? rightLevel : leftLevel
  const situation = betterSide.situation || anotherSide.situation
  const side = situation === betterSide.situation && isLeft ? 'left' : 'right'
  const whichSide = side === 'left' ? '左眼' : '右眼'
  const anotherSideIsGetVision =
    side === 'left' ? ret.data.isGetVisionR : ret.data.isGetVisionL
  // 另一边是否有视力
  const anotherSideNotHasVision =
    anotherSideIsGetVision === 0 || anotherSideIsGetVision === false
  // 另一边无视里状况
  const noVisionType =
    side === 'left' ? ret.data.noVisionRType : ret.data.noVisionLType
  // 另一边辨认距离
  const distance =
    side === 'left'
      ? ret.data.recognitionDistanceR
      : ret.data.recognitionDistanceL
  if (situation === 1) {
    const vision = side === 'left' ? ret.data.visionL : ret.data.visionR
    ret.hint = `其较好眼${whichSide}矫正视力测试结果为${vision}`
  } else {
    const view = side === 'left' ? ret.data.viewL : ret.data.viewR
    ret.hint = `其较好眼${whichSide}视野测试结果为${view}`
  }
  if (anotherSideNotHasVision) {
    ret.hint += `(${noVisionHint(
      side === 'left' ? 'right' : 'left',
      noVisionType,
      distance,
      options
    )})`
  }
  ret.level = `${betterSide.level}`
  return ret
}

export const noVisionHint = (
  side: 'left' | 'right',
  noVisionType: string,
  distance: number | '',
  options: CommonOption[]
): string => {
  const noVisionTypeText = options.find((o) => o.value === noVisionType)?.label
  const otherSideText = side === 'left' ? '左眼' : '右眼'
  const unit = noVisionType === '1' || noVisionType === '2' ? '米' : '厘米'
  return `${otherSideText}无视力数值情况为${noVisionTypeText},${otherSideText}最远辨认距离为${distance}${unit}`
}
