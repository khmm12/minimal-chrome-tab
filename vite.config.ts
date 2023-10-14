import { fileURLToPath } from 'node:url'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import Stylis from 'stylis'
import { configDefaults } from 'vitest/config'
import linaria from '@linaria/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import solidPlugin from 'vite-plugin-solid'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import manifestPlugin from './lib/vite/manifest-plugin'

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
    environment: 'jsdom',
    transformMode: {
      ssr: [],
    },
    deps: {
      // We need browser variants
      inline: [/solid-js/, /@solidjs\/testing-library/, /@felte\/solid/, /solid-transition-group/, /@solid-primitives/],
    },
    coverage: {
      exclude: ['.pnp.cjs', '.pnp.loader.mjs', 'test-support/**', ...(configDefaults.coverage.exclude ?? [])],
    },
  },
}))
