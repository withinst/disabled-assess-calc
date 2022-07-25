import { bodyCalc } from "../src"

test('一级残疾', () => {
  expect(bodyCalc({ representationType: '1'}, []).level).toBe('1')
})

test('康复期测试', () => {
  expect(bodyCalc({
    representationType: '1', muscleTension: '1',
    recoverPeriod: '1', muscleStrength: '1'}, [], []).hint).toBe('其残疾表征测试结果为,肌力测试结果为1,肌张力测试结果为1,其康复期为')
})
