import { colors, fonts, media } from './index.js'

test('colors', () => {
  expect(colors).toMatchSnapshot()
})
test('fonts', () => {
  expect(fonts).toMatchSnapshot()
})
test('media', () => {
  expect(media).toMatchSnapshot()
})
