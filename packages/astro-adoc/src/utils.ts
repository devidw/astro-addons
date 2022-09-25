/**
 * Recursively get all .adoc files in a given directory
 */
import { promises as fs } from 'fs'
import { join } from 'path'

export async function getFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(dirents.map((dirent) => {
        const res = join(dir, dirent.name)
        return dirent.isDirectory() ? getFiles(res) : res
    }))
    return Array.prototype.concat(...files)
}

export async function getAdocPaths(dir: string, paramName: string = "slug"): Promise<{ params: { [key: string]: string } }[]> {
    // maybe add trailing slash if not present
    if (!dir.endsWith('/')) {
        dir = dir + '/'
    }
    const files = await getFiles(dir)
    const adocFiles = files.filter((file) => file.endsWith('.adoc'))
    return adocFiles.map((file) => {
        let path = file.replace('.adoc', '')

        if (path.endsWith('/index')) {
            path = path.replace('/index', '')
        }

        path = path.replace(dir, '')

        return { params: { [paramName]: path } }
    })
}