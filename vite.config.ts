import { resolve as resolvePath } from 'path'
import fs from 'fs'
import { defineConfig, Plugin } from 'vite'
import linaria from 'vite-plugin-linaria-styled'
import solidPlugin from 'vite-plugin-solid'
import stylis from 'stylis'

stylis.set({ prefix: false })

const copyManifest = (): Plugin => {
  return {
    name: 'copyManifest',
    async writeBundle() {
      return await fs.promises.copyFile(
        resolvePath(__dirname, 'src/manifest.json'),
        resolvePath(__dirname, 'dist/manifest.json')
      )
    },
  }
}

export default defineConfig({
  resolve: {
    alias: { '@': resolvePath(__dirname, './src') },
  },
  plugins: [linaria(), solidPlugin(), copyManifest()],
})
