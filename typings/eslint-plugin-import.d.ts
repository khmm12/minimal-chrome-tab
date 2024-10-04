declare module 'eslint-plugin-import' {
  import type { TSESLint } from '@typescript-eslint/utils'
  const plugin: TSESLint.Linter.Plugin
  export = plugin
}
