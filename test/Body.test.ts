import { bodyCalc } from "../src"

test('一级残疾', () => {
  expect(bodyCalc({ representationType: '1'}, []).level).toBe('1')
})
