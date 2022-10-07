import * as fs from 'fs'
import { join } from 'path'
import Processor from 'asciidoctor'
import type { Asciidoctor } from 'asciidoctor'
import type { GetStaticPathsResult } from 'astro'

/**
 * Recursively get all .adoc files in a given directory
 */
export async function getAdocFiles(dir: string): Promise<string[]> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(dirents.map((dirent) => {
    const res = join(dir, dirent.name)
    return dirent.isDirectory() ? getAdocFiles(res) : res
  }))
  const allFiles = Array.prototype.concat(...files)
  const adocOnly = allFiles.filter(file => file.endsWith('.adoc'))
  return adocOnly
}

/**
 * Get all .adoc files in a given directory and return a list of paths
 * that can be used in getStaticPaths
 */
export async function getAdocPaths(dir: string, paramName = 'slug'): Promise<GetStaticPathsResult> {
  // maybe add trailing slash if not present
  if (!dir.endsWith('/'))
    dir = `${dir}/`

  const adocFiles = await getAdocFiles(dir)
  return adocFiles.map((file) => {
    let path = file.replace('.adoc', '')

    if (path.endsWith('/index'))
      path = path.replace('/index', '')

    path = path.replace(dir, '')

    return {
      params: { [paramName]: path },
      props: {
        adoc: getAdoc(file),
      }
    }
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

  // exists and is file
  const validPath = possiblePaths.find(p => fs.existsSync(p) && fs.statSync(p).isFile())

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
