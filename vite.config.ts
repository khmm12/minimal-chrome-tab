import { fileURLToPath } from 'node:url'
import linariaPkg from '@wyw-in-js/vite'
import autoprefixer from 'autoprefixer'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import Stylis from 'stylis'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import solidPlugin from 'vite-plugin-solid'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { configDefaults } from 'vitest/config'
import manifestPlugin from './lib/vite/manifest-plugin.js'

const linaria = 'default' in linariaPkg ? linariaPkg.default : linariaPkg

export default defineConfig((config) => ({
  build: {
    target: browserslistToEsbuild(),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@test': fileURLToPath(new URL('./test-support', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    solidPlugin({ hot: config.mode === 'development' }),
    linaria({
      preprocessor: new Stylis({ prefix: false }),
      include: ['**/*.{ts,tsx}'],
      evaluate: true,
      displayName: config.mode !== 'production',
      sourceMap: config.mode !== 'production',
    }),
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
