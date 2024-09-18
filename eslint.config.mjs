// @ts-check
import lovePreset from 'eslint-config-love'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// @ts-expect-error: the package doesn't have type definitions, nice to have, but not critical.
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
    },
    settings: {
      ...importPlugin.configs?.typescript.settings,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off', // too many false positives
      '@typescript-eslint/init-declarations': 'off', // too many false positives
      '@typescript-eslint/no-empty-function': 'off', // useless,
      '@typescript-eslint/class-methods-use-this': 'off', // useless,
      '@typescript-eslint/no-deprecated': 'off', // false positives, example: chrome namespace

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
