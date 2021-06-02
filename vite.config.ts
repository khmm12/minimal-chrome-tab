import { resolve as resolvePath } from 'path'
import fs from 'fs'
import { defineConfig, Plugin } from 'vite'
import linaria from 'vite-plugin-linaria-styled'
import solidPlugin from 'vite-plugin-solid'
import Stylis from 'stylis'

const stylis = new Stylis({ prefix: false })

export default defineConfig({
  resolve: {
    alias: { '@': resolvePath(__dirname, './src') },
  },
  plugins: [linaria({ preprocessor: stylis }), solidPlugin(), copyManifest()],
})

function copyManifest(): Plugin {
  return {
    name: 'copyManifest',
    async writeBundle() {
      return fs.promises.copyFile(
        resolvePath(__dirname, 'src/manifest.json'),
        resolvePath(__dirname, 'dist/manifest.json')
      )
    },
  }
}
