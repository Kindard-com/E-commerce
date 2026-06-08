import { getPayload } from 'payload'
import 'dotenv/config'

async function main() {
  const { default: config } = await import('./src/payload.config')
  const payload = await getPayload({ config })
  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'REDACTED',
        name: 'Owner Admin',
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
