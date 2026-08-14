import { getPayload } from 'payload'
import 'dotenv/config'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before running this script.')
    process.exit(1)
  }

  const { default: config } = await import('./src/payload.config')
  const payload = await getPayload({ config })
  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name: process.env.ADMIN_NAME || 'Owner Admin',
        roles: ['admin'],
      },
    })
    console.log('Admin user successfully created:', user.email)
  } catch (error) {
    console.error('Failed to create admin user:', error)
  }
  process.exit(0)
}

main()
