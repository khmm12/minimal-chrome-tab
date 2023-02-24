import { colors, fonts, media } from '.'

test('colors', () => {
  expect(colors).toMatchSnapshot()
})
test('fonts', () => {
  expect(fonts).toMatchSnapshot()
})
test('media', () => {
  expect(media).toMatchSnapshot()
})
