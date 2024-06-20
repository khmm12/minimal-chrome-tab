import fs from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'
import { type Plugin } from 'vite'

interface ManifestPluginOptions {
  sourcePath: string
  version?: string
}

export default function manifestPlugin(options: ManifestPluginOptions): Plugin {
  return {
    name: 'writeExtensionManifest',
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
    ...(JSON.parse(originalSource) as Record<string, any>),
    version,
  })
}

async function getPackageVersion(): Promise<string> {
  const content = await fs.readFile(resolvePath(process.cwd(), './package.json'), 'utf-8')
  const { version } = JSON.parse(content) as Record<string, any>

  return version
}
