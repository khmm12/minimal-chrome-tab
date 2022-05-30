module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended', '@linaria/stylelint'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
}
