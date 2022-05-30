import { resolve as resolvePath } from 'path'
import fs from 'fs/promises'
import { defineConfig, Plugin } from 'vite'
import linaria from '@linaria/rollup'
import solidPlugin from 'vite-plugin-solid'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import Stylis from 'stylis'

const stylis = new Stylis({ prefix: false })

export default defineConfig({
  resolve: {
    alias: { '@': resolvePath(__dirname, './src') },
  },
  plugins: [
    linaria({ preprocessor: stylis, sourceMap: process.env.NODE_ENV !== 'production' }),
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
    writeExtensionManifest(resolvePath(__dirname, './src/manifest.json')),
  ],
})

function writeExtensionManifest(manifest: string): Plugin {
  return {
    name: 'wirteExrensionManifest',
    async generateBundle() {
      const source = await fs.readFile(resolvePath(__dirname, manifest), 'utf-8')

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source,
      })
    },
  }
}
