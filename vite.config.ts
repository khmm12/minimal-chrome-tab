import { resolve as resolvePath } from 'path'
import { defineConfig } from 'vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import linaria from '@linaria/rollup'
import solidPlugin from 'vite-plugin-solid'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import Stylis from 'stylis'
import manifestPlugin from './lib/vite/manifest-plugin'

const stylis = new Stylis({ prefix: false })

export default defineConfig((config) => ({
  build: {
    target: browserslistToEsbuild(),
  },
  resolve: {
    alias: {
      '@': resolvePath(__dirname, './src'),
    },
  },
  plugins: [
    linaria({ preprocessor: stylis, sourceMap: config.mode !== 'production' }),
    solidPlugin(),
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
      sourcePath: resolvePath(__dirname, './src/manifest.json'),
    }),
  ],
}))
