/**
 * Create or reset an admin user (bcrypt-hashed password, never stored in code).
 *
 * Usage:
 *   bun run admin:create -- --email you@example.com --password 'A-strong-password'
 * Omit --password to be prompted safely (hidden input).
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'
import { loadRepoEnv } from './lib/repo-env'

loadRepoEnv()
const db = new PrismaClient()

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const i = args.indexOf(flag)
    return i >= 0 ? args[i + 1] : undefined
  }
  return { email: get('--email'), password: get('--password') }
}

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question)
    let value = ''
    const stdin = process.stdin
    if (stdin.isTTY) stdin.setRawMode(true)
    const onData = (ch: Buffer) => {
      const c = ch.toString('utf8')
      if (c === '\r' || c === '\n') {
        if (stdin.isTTY) stdin.setRawMode(false)
        stdin.removeListener('data', onData)
        process.stdout.write('\n')
        resolve(value)
      } else if (c === '\u0003') {
        process.exit(1)
      } else if (c === '\u007f' || c === '\b') {
        value = value.slice(0, -1)
      } else {
        value += c
      }
    }
    stdin.on('data', onData)
  })
}

async function main() {
  let { email, password } = parseArgs()
  if (!email || !email.includes('@')) {
    console.error('Usage: bun run admin:create -- --email you@example.com [--password "..."]')
    process.exit(1)
  }
  email = email.toLowerCase().trim()

  if (!password) {
    password = await promptHidden('Password (min 10 chars, input hidden): ')
  }
  if (password.length < 10) {
    console.error('Password must be at least 10 characters.')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const existing = await db.adminUser.findUnique({ where: { email } })
  if (existing) {
    await db.adminUser.update({ where: { email }, data: { passwordHash } })
    console.log(`Admin password reset for ${email}`)
  } else {
    await db.adminUser.create({ data: { email, passwordHash } })
    console.log(`Admin created: ${email}`)
  }
  console.log('You can now log in at /admin/login')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
