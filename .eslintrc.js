module.exports = {
  extends: [
    'standard',
    'standard-react',
    'standard-with-typescript',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/standard',
    'prettier/react',
  ],
  rules: {
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
  },
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
