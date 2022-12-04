module.exports = {
  extends: ['standard', 'standard-with-typescript', 'plugin:prettier/recommended'],
  env: {
    webextensions: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        createDefaultProgram: true,
      },
    },
  ],
}
