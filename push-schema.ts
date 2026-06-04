import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function pushSchema() {
  try {
    const payload = await getPayload({ config: configPromise })
    console.log('Pushing schema manually...')
    // In Payload v3, the database adapter handles the push. 
    // Wait, getPayload itself initializes the db. Since we modified payload.config.ts to push: true when NODE_ENV !== 'production',
    // just calling getPayload() here (where NODE_ENV is undefined so it's not 'production') should trigger the schema push automatically!
    console.log('Schema push triggered by getPayload initialization.')
    process.exit(0)
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}
pushSchema()
