// @ts-check
import lovePreset from 'eslint-config-love'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('typescript-eslint').ConfigArray} */
const config = tseslint.config(
  lovePreset,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.{ts,tsx,mts,cts}'],
  },
  {
    ignores: ['dist', 'styled-system', 'vite.config.ts.timestamp-*.mjs'],
  },
  {
    languageOptions: {
      globals: globals.webextensions,
    },
    rules: {
      '@typescript-eslint/prefer-destructuring': 'off', // false positives, less readable sometimes
      '@typescript-eslint/no-magic-numbers': 'off', // too many false positives
      '@typescript-eslint/init-declarations': 'off', // too many false positives
      '@typescript-eslint/no-empty-function': 'off', // useless,
      '@typescript-eslint/no-unsafe-type-assertion': 'off', // doesn't allow type assertions where they are necessary
      '@typescript-eslint/class-methods-use-this': 'off', // useless,
      '@typescript-eslint/no-deprecated': 'off', // false positives, example: chrome namespace
      'promise/avoid-new': 'off', // tooooo opinionated from eslint-config-love
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
            { pattern: 'solid-js/**', group: 'external', position: 'before' },
            { pattern: 'styled-system', group: 'external', position: 'before' },
            { pattern: 'styled-system/**', group: 'external', position: 'before' },
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
  {
    files: ['**/*.test.{js,mjs,cjs}', '**/*.test.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'max-nested-callbacks': 'off',
    },
  },
)

export default config
