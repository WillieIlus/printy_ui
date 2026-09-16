import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const targetPath = path.resolve('node_modules/rollup/dist/native.js')

if (!existsSync(targetPath)) {
  console.log(`[patch-rollup-native] Skipped; file not found: ${targetPath}`)
  process.exit(0)
}

const source = readFileSync(targetPath, 'utf8')
const marker = '// This is needed because report.getReport() crashes the process on Windows sometimes.'

if (!source.includes(marker)) {
  console.log('[patch-rollup-native] Skipped; expected Rollup block not found.')
  process.exit(0)
}

const replacement = `\t\t// Prefer the in-process report on Windows when child process spawning is blocked.\n\t\ttry {\n\t\t\treturn report.getReport().header;\n\t\t} catch {\n\t\t\t// Fall through to the child process probe used by upstream Rollup.\n\t\t}\n\n\t\t// This is needed because report.getReport() crashes the process on Windows sometimes.`

if (source.includes(replacement)) {
  console.log('[patch-rollup-native] Already patched.')
  process.exit(0)
}

writeFileSync(targetPath, source.replace(marker, replacement), 'utf8')
console.log('[patch-rollup-native] Patched Rollup native loader.')
