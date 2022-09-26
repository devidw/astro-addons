import * as fs from 'fs'
import { join } from 'path'
import Processor from 'asciidoctor'
import type { Asciidoctor } from 'asciidoctor'
import type { GetStaticPathsResult } from 'astro'

/**
 * Recursively get all .adoc files in a given directory
 */
async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(dirents.map((dirent) => {
    const res = join(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  }))
  return Array.prototype.concat(...files)
}

/**
 * Get all .adoc files in a given directory and return a list of paths
 * that can be used in getStaticPaths
 */
export async function getAdocPaths(dir: string, paramName = 'slug'): Promise<GetStaticPathsResult> {
  // maybe add trailing slash if not present
  if (!dir.endsWith('/'))
    dir = `${dir}/`

  const files = await getFiles(dir)
  const adocFiles = files.filter(file => file.endsWith('.adoc'))
  return adocFiles.map((file) => {
    let path = file.replace('.adoc', '')

    if (path.endsWith('/index'))
      path = path.replace('/index', '')

    path = path.replace(dir, '')

    return { params: { [paramName]: path } }
  })
}

/**
 *
 * @see https://asciidoctor.github.io/asciidoctor.js/2.2.5/#document
 */
export function getAdoc(path: string, options?: Asciidoctor.ProcessorOptions) {
  const possiblePaths = [
    path,
    `${path}.adoc`,
    `${path}/index.adoc`,
  ]
  let validPath

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      validPath = possiblePath
      break
    }
  }

  if (!validPath)
    throw new Error(`Failed to find AsciiDoc file at ${path}`)

  // handle default options
  options = { safe: 'safe', ...options }

  try {
    const processor = Processor()
    const adoc = processor.loadFile(validPath, options)
    return adoc
  }
  catch (e) {
    console.error(e)
    throw new Error(`Failed to load AsciiDoc file at ${validPath}`)
  }
}
