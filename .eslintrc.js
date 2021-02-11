module.exports = {
  extends: ['standard', 'standard-with-typescript', 'plugin:prettier/recommended'],
  env: {
    webextensions: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 0,
      },
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        createDefaultProgram: true,
      },
    },
  ],
}
