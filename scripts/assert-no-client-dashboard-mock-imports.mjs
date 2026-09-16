import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd()
const targets = [
  'app/pages/dashboard/client',
  'app/layouts/dashboard-client.vue',
]

const violations = []

async function collectFiles(path) {
  try {
    const metadata = await stat(path)
    if (!metadata.isDirectory()) {
      return [path]
    }
    const entries = await readdir(path, { withFileTypes: true })
    const files = await Promise.all(entries.map(entry => {
      const child = join(path, entry.name)
      return entry.isDirectory() ? collectFiles(child) : child
    }))
    return files.flat()
  } catch {
    return []
  }
}

for (const target of targets) {
  for (const file of await collectFiles(join(root, target))) {
    if (!/\.(vue|ts|js|mjs)$/.test(file)) {
      continue
    }
    const source = await readFile(file, 'utf8')
    if (source.includes('mockClientData') || source.includes('~/data/mockClientData')) {
      violations.push(relative(root, file))
    }
  }
}

if (violations.length > 0) {
  console.error('mockClientData imports found in client dashboard scope:')
  for (const file of violations) {
    console.error(`- ${file}`)
  }
  process.exit(1)
}

console.log('No mockClientData imports found in client dashboard pages/layout.')
