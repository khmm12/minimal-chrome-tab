import { resolve as resolvePath } from 'path'
import { Plugin } from 'vite'
import fs from 'fs/promises'

interface ManifestPluginOptions {
  sourcePath: string
  version?: string
}

export default function manifestPlugin(options: ManifestPluginOptions): Plugin {
  return {
    name: 'wirteExrensionManifest',
    async generateBundle() {
      const source = await generateManifest(options)

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source,
      })
    },
  }
}

async function generateManifest(options: ManifestPluginOptions): Promise<string> {
  const [originalSource, packageVersion] = await Promise.all([
    fs.readFile(options.sourcePath, 'utf-8'),
    getPackageVersion(),
  ])

  const version = options.version ?? packageVersion

  return JSON.stringify({
    ...JSON.parse(originalSource),
    version,
  })
}

async function getPackageVersion(): Promise<string> {
  const content = await fs.readFile(resolvePath(process.cwd(), './package.json'), 'utf-8')
  const { version } = JSON.parse(content)

  return version
}
