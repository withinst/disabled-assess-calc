import { bodyCalc } from "../src"

test('一级残疾', () => {
  expect(bodyCalc({ representationType: '1'}, []).level).toBe('1')
})

test('康复期测试', () => {
  expect(bodyCalc({
    representationType: '1', muscleTension: '1',
    recoverPeriod: '1', muscleStrength: '1'}, [], []).hint)
    .toBe('其残疾表征测试结果为,康复期为,肌张力为1,肌力为1')
})

test('康复期空值测试', () => {
  expect(bodyCalc({
    representationType: '1', muscleTension: '',
    recoverPeriod: '', muscleStrength: ''}, [], []).hint)
    .toBe('其残疾表征测试结果为')
})
