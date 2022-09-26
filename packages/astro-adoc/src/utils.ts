
import Processor from "asciidoctor"
import type { Asciidoctor } from "asciidoctor"
import * as fs from 'fs'
import { join } from 'path'

/**
 * Recursively get all .adoc files in a given directory
 */
export async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(dirents.map((dirent) => {
    const res = join(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  }))
  return Array.prototype.concat(...files)
}

export async function getAdocPaths(dir: string, paramName = 'slug'): Promise<{ params: { [key: string]: string } }[]> {
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
export function getAdoc(path: string, options: Asciidoctor.ProcessorOptions = { safe: "safe" }) {
  if (fs.existsSync(`${path}.adoc`)) {
    path = `${path}.adoc`
  } else if (fs.existsSync(`${path}/index.adoc`)) {
    path = `${path}/index.adoc`
  } else {
    throw new Error(`No AsciiDoc file found at ${path}`)
  }

  try {
    const processor = Processor()
    const adoc = processor.loadFile(path, options)
    return adoc
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to load AsciiDoc file at ${path}`)
  }
}