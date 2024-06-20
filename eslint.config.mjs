// @ts-check
import lovePreset from 'eslint-config-love'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const importPlugin = await import('eslint-plugin-import')

export default tseslint.config(
  lovePreset,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  prettier,
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.{ts,tsx,mts,cts}'],
  },
  {
    ignores: ['dist/', 'vite.config.ts.timestamp-*.mjs'],
  },
  {
    languageOptions: {
      globals: globals.webextensions,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        sourceType: 'module',
        createDefaultProgram: true,
      },
    },
    settings: {
      ...importPlugin.configs.typescript.settings,
    },
  },
  {
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
            { pattern: '@test/**', group: 'internal', position: 'after' },
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: [],
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
  },
)
