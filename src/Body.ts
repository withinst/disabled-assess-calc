// 身体残疾等级计算
import { CommonOption, RetType } from './CommonType'
import { dictLabel } from './utils'

export type BodyMuscle = '1' | '2' | '3' | '4' | '5' | ''
export type BodyForm = {
  representationType: string
  recoverPeriod?: string
  muscleStrength?: BodyMuscle
  muscleTension?: BodyMuscle
}

export function bodyCalc(
  formData: BodyForm,
  representationType: CommonOption[],
  recoverList?: CommonOption[]
): RetType<BodyForm> {
  const ret: RetType<BodyForm> = {
    data: { ...formData },
    error: '',
    hint: '',
    level: '',
  }
  const value = parseInt(ret.data.representationType, 10)
  const selectLabel = dictLabel(representationType, ret.data.representationType)
  let recoverHint = ''
  if (formData.recoverPeriod && recoverList) {
    const recoverLabel = dictLabel(recoverList, formData.recoverPeriod)
    recoverHint = `康复期为${recoverLabel}`
  }
  const muscleStrength = formData.muscleStrength
    ? `肌力为${formData.muscleStrength}`
    : ''
  const muscleTension = formData.muscleTension
    ? `肌张力为${formData.muscleTension}`
    : ''
  const str = [recoverHint, muscleTension, muscleStrength]
    .filter((s) => s !== '')
    .join(',')
  ret.hint = `其残疾表征测试结果为${selectLabel}${str ? `,${str}` : str}`
  if (0 < value && value <= 9) {
    ret.level = '1'
  } else if (9 < value && value <= 16) {
    ret.level = '2'
  } else if (16 < value && value <= 22) {
    ret.level = '3'
  } else if (22 < value && value <= 33) {
    ret.level = '4'
  } else if (value === 99) {
    ret.level = '5'
  } else {
    ret.level = '0'
  }
  return ret
}
