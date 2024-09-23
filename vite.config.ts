import { fileURLToPath } from 'node:url'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import solidDevTools from 'solid-devtools/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import solidPlugin from 'vite-plugin-solid'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { configDefaults } from 'vitest/config'
import manifestPlugin from './lib/vite/manifest-plugin.js'

export default defineConfig((config) => ({
  build: {
    target: browserslistToEsbuild(),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'styled-system': fileURLToPath(new URL('./styled-system', import.meta.url)),
      '@test': fileURLToPath(new URL('./test-support', import.meta.url)),
    },
  },
  plugins: [
    solidDevTools({ autoname: true }),
    solidPlugin({ hot: config.mode === 'development' }),
    createHtmlPlugin({ minify: true }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/_locales/*',
          dest: '_locales',
        },
      ],
    }),
    manifestPlugin({
      sourcePath: fileURLToPath(new URL('./src/manifest.json', import.meta.url)),
    }),
  ],
  test: {
    setupFiles: ['test-support/setup.ts'],
    watch: false,
    globals: true,
    environment: 'happy-dom',
    coverage: {
      exclude: ['test-support/**', ...(configDefaults.coverage.exclude ?? [])],
    },
  },
}))
