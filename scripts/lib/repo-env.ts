/**
 * Explicit .env loader for standalone bun scripts (seed, admin:create).
 * Bun may pick up an unrelated parent .env; this guarantees the repository's
 * own .env wins for these scripts. Walks up from process.cwd() to find it.
 */
import { readFileSync, existsSync } from 'fs'
import path from 'path'

export function loadRepoEnv(): void {
  let dir = process.cwd()
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, '.env')
    if (existsSync(candidate)) {
      const text = readFileSync(candidate, 'utf-8')
      for (const line of text.split('\n')) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\n]*?)"?\s*$/)
        if (m && m[1] !== '') {
          process.env[m[1]] = m[2]
        }
      }
      return
    }
    const parent = path.dirname(dir)
    if (parent === dir) return
    dir = parent
  }
}
