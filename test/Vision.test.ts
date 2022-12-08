import { visionCalc} from "../src"
import {VisionForm} from "../src/Vision"

const initFormData: VisionForm = {
  isGetVisionL: '',
  isGetVisionR: '',
  noVisionLType: "",
  noVisionRType: "",
  recognitionDistanceL: '',
  recognitionDistanceR: '',
  viewL: '',
  viewR: '',
  visionL: '',
  visionR: ''
}

test('两只眼都无法得到视力值时为一级', () => {
  expect(visionCalc({ ...initFormData, isGetVisionR: 0, isGetVisionL: 0}, 7).level).toBe('1')
})

test('两只眼都为false时为一级', () => {
  expect(visionCalc({ ...initFormData, isGetVisionL: false, isGetVisionR: false}, 7).level).toBe('1')
})

test('其中一只眼可以得到视力,但是视力和视野都为空时则为未鉴定', () => {
  expect(visionCalc({ ...initFormData, isGetVisionR: true, isGetVisionL: false}, 7).level)
    .toBe('0')
  expect(visionCalc({ ...initFormData, isGetVisionR: false, isGetVisionL: true}, 7).level)
    .toBe('0')
  expect(visionCalc({ ...initFormData, isGetVisionR: true, isGetVisionL: true}, 7).level)
    .toBe('0')
  expect(visionCalc({ ...initFormData, isGetVisionL: true}, 7).level)
    .toBe('0')
  expect(visionCalc({ ...initFormData, isGetVisionR: true}, 7).level)
    .toBe('0')
})

describe('七岁以上情况', () => {
  const testVisionCalc = (formData: Partial<VisionForm> = {}) => {
    return visionCalc({ ...initFormData, ...formData}, 8)
  }
  test('能否得到视力数值都选否的情况', () => {
    const retData = testVisionCalc({ isGetVisionL: false, isGetVisionR: false})
    expect(retData.level).toBe('1')
  })

  test('能否得到视力数值一个选择否，一个选择是并只填写矫正视力值', () => {
    const retData = testVisionCalc({ isGetVisionL: false, isGetVisionR: true, visionR: 0.02, visionL: 0.02})
    expect(retData.data.visionL).toBe('')
    expect(retData.data.visionR).toBe(0.02)
    expect(retData.level).toBe('2')
  })

  test('能否得到视力数值一个选择否，一个选择是并只填写视野值', () => {
    const retData = testVisionCalc({ isGetVisionL: false, isGetVisionR: true, viewL: 8, viewR: 8})
    expect(retData.data.viewL).toBe(8)
    expect(retData.data.viewR).toBe(8)
    expect(retData.level).toBe('2')
  })

  test('能否得到视力数值一个选择否，一个选择是并填写矫正视力值和视野值', () => {
    const retData = testVisionCalc({
      isGetVisionL: false,
      isGetVisionR: true,
      visionR: 0.08,
      visionL: 0.08,
      viewL: 12,
      viewR: 12
    })
    expect(retData.data.visionL).toBe('')
    expect(retData.data.visionR).toBe(0.08)
    expect(retData.data.viewL).toBe(12)
    expect(retData.data.viewR).toBe(12)
    expect(retData.level).toBe('3')
  })

  test('能否得到视力数值都选是，一个填写矫正视力值，一个填写视野值', () => {
    const retData = testVisionCalc({
      isGetVisionL: true,
      isGetVisionR: true,
      visionR: 0.08,
      viewL: 4
    })
    expect(retData.level).toBe('3')
  })

  test('能否得到视力数值都选是，两个都填写矫正视力值', () => {
    const retData = testVisionCalc({
      isGetVisionL: true,
      isGetVisionR: true,
      visionR: 0.03,
      visionL: 0.01
    })
    expect(retData.level).toBe('2')
  })

  test('能否得到视力数值都选是，两个都填写视野值', () => {
    const retData = testVisionCalc({
      isGetVisionL: true,
      isGetVisionR: true,
      viewL: 4,
      viewR: 8
    })
    expect(retData.level).toBe('2')
  })

  test('数字精度0.29', () => {
    const retData = testVisionCalc({
      isGetVisionL: true,
      visionL: 0.29
    })
    expect(retData.data.visionL).toBe(0.29)
  })

  test('视野和视力都不符合但是视野有值，视力无值', () => {
    const retData = testVisionCalc({
      isGetVisionL: true,
      visionL: '',
      viewL: 10
    })
    expect(retData.hint).toEqual('其较好眼左眼视野测试结果为10')
  })
})



