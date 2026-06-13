import { Dropbox, DropboxAuth } from 'dropbox'
import readline from 'readline'
import dotenv from 'dotenv'

dotenv.config()

const auth = new DropboxAuth({
  clientId: process.env.DROPBOX_APP_KEY,
  clientSecret: process.env.DROPBOX_APP_SECRET,
})

async function run() {
  if (!process.env.DROPBOX_APP_KEY || !process.env.DROPBOX_APP_SECRET) {
    console.error('Missing DROPBOX_APP_KEY or DROPBOX_APP_SECRET in .env')
    process.exit(1)
  }

  try {
    // Generate an authorization URL with token_access_type='offline' to get a refresh token
    const authUrl = await auth.getAuthenticationUrl('urn:ietf:wg:oauth:2.0:oob', undefined, 'code', 'offline', undefined, 'none', false)
    
    console.log('--- Dropbox Authorization ---')
    console.log('1. Go to this URL in your browser to authorize the app:')
    console.log('\n' + authUrl + '\n')
    console.log('2. Click "Allow" (you might have to log in first).')
    console.log('3. Copy the provided authorization code.')
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('\nEnter the authorization code here: ', async (code) => {
      try {
        const response = await auth.getAccessTokenFromCode('urn:ietf:wg:oauth:2.0:oob', code)
        console.log('\n✅ Success! Here is your refresh token:')
        console.log('--------------------------------------------------')
        console.log(response.result.refresh_token)
        console.log('--------------------------------------------------')
        console.log('Please copy this refresh token and add it to your .env file as:')
        console.log(`DROPBOX_REFRESH_TOKEN="${response.result.refresh_token}"`)
      } catch (err) {
        console.error('❌ Error getting access token:', err)
      }
      rl.close()
    })
  } catch (error) {
    console.error('Failed to generate auth URL', error)
  }
}

run()
