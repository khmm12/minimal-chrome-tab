import { fileURLToPath } from 'node:url'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { defineConfig } from 'vite'
import 'vitest/config'
import { createHtmlPlugin } from 'vite-plugin-html'
import solidPlugin from 'vite-plugin-solid'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import manifestPlugin from './lib/vite/manifest-plugin.js'

export default defineConfig(() => ({
  build: {
    target: browserslistToEsbuild(),
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: 'styled-system', replacement: fileURLToPath(new URL('./styled-system', import.meta.url)) },
      { find: '@test', replacement: fileURLToPath(new URL('./test-support', import.meta.url)) },
    ],
  },
  plugins: [
    solidPlugin(),
    createHtmlPlugin({ minify: true }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/_locales',
          dest: '_locales',
          rename: { stripBase: 2 },
        },
      ],
    }),
    manifestPlugin({
      sourcePath: fileURLToPath(new URL('./src/manifest.json', import.meta.url)),
    }),
  ],
  test: {
    server: {
      deps: {
        // fix for vitest v4
        // otherwise they're handled directly via nodejs and can not be imported
        inline: ['@solidjs/testing-library'],
      },
    },
    setupFiles: ['test-support/setup.ts'],
    watch: false,
    globals: true,
    environment: 'happy-dom',
    coverage: {
      include: ['src'],
    },
  },
}))
