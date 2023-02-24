module.exports = {
  extends: ['standard', 'standard-with-typescript', 'plugin:prettier/recommended'],
  env: {
    webextensions: true,
  },
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          { pattern: 'solid-js', group: 'external', position: 'before' },
          { pattern: '@linaria/core', group: 'external', position: 'before' },
          { pattern: '@/**', group: 'internal', position: 'after' },
        ],
        'newlines-between': 'never',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
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
