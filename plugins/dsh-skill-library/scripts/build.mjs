import { mkdir, copyFile } from 'node:fs/promises'

await mkdir(new URL('../lib/', import.meta.url), { recursive: true })
await copyFile(new URL('../src/index.js', import.meta.url), new URL('../lib/index.js', import.meta.url))
console.log('Built host entry: lib/index.js')
