import { resolve as resolvePath } from 'path'
import fs from 'fs'
import { defineConfig, Plugin } from 'vite'
import linaria from '@linaria/rollup'
import solidPlugin from 'vite-plugin-solid'
import { minifyHtml } from 'vite-plugin-html'
import Stylis from 'stylis'

const stylis = new Stylis({ prefix: false })

export default defineConfig({
  resolve: {
    alias: { '@': resolvePath(__dirname, './src') },
  },
  plugins: [
    linaria({ preprocessor: stylis }),
    solidPlugin(),
    minifyHtml(),
    writeExtensionManifest(resolvePath(__dirname, './src/manifest.json')),
  ],
})

function writeExtensionManifest(manifest: string): Plugin {
  return {
    name: 'wirteExrensionManifest',
    async generateBundle() {
      const source = await fs.promises.readFile(resolvePath(__dirname, manifest), 'utf-8')

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source,
      })
    },
  }
}
