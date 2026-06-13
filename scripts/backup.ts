import { Dropbox } from 'dropbox'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import archiver from 'archiver'
import dotenv from 'dotenv'

dotenv.config()

// Load Medusa env vars too to get PostgreSQL URL
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') })

const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN

const MEDUSA_DB_URL = process.env.DATABASE_URL // from backend/.env (PostgreSQL)
// Turso DB URL is typically in root .env as DATABASE_URL, let's assume it's set as TURSO_DB_URL or just load root .env first
const PAYLOAD_DB_URL = process.env.DATABASE_URL // from root .env

const dbx = new Dropbox({
  clientId: DROPBOX_APP_KEY,
  clientSecret: DROPBOX_APP_SECRET,
  refreshToken: DROPBOX_REFRESH_TOKEN,
})

const TEMP_DIR = path.join(process.cwd(), '.tmp_backup')
const ZIP_FILE_PATH = path.join(process.cwd(), `backup-${new Date().toISOString().split('T')[0]}.zip`)

function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running command: ${command}`)
        console.error(stderr)
        return reject(error)
      }
      resolve()
    })
  })
}

async function createBackupZip() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR)
  }

  console.log('📦 Dumping PostgreSQL database (Medusa)...')
  try {
    if (MEDUSA_DB_URL && MEDUSA_DB_URL.includes('postgres')) {
      await runCommand(`pg_dump "${MEDUSA_DB_URL}" -f "${path.join(TEMP_DIR, 'medusa-db.sql')}"`)
    } else {
      console.warn('⚠️ Medusa DB URL not found or not postgres, skipping...')
    }
  } catch (err) {
    console.error('❌ Failed to dump PostgreSQL DB. Is pg_dump installed?')
  }

  console.log('📦 Dumping Turso/LibSQL database (Payload)...')
  try {
    // Attempting to use turso CLI if available
    await runCommand(`turso db dump kindard-e-commerce-kindard > "${path.join(TEMP_DIR, 'payload-db.sql')}"`)
  } catch (err) {
    console.warn('⚠️ Failed to dump Turso DB. Make sure turso CLI is installed and authenticated.')
  }

  console.log('🗜️  Zipping files and media...')
  return new Promise<string>((resolve, reject) => {
    const output = fs.createWriteStream(ZIP_FILE_PATH)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      console.log(`✅ Zip created: ${archive.pointer()} total bytes`)
      resolve(ZIP_FILE_PATH)
    })

    archive.on('error', (err) => reject(err))
    archive.pipe(output)

    // Add DB Dumps
    archive.directory(TEMP_DIR, 'databases')

    // Add Media Files
    const mediaPath = path.join(process.cwd(), 'public', 'media')
    if (fs.existsSync(mediaPath)) {
      archive.directory(mediaPath, 'media')
    }

    archive.finalize()
  })
}

async function uploadToDropbox(filePath: string) {
  console.log('☁️  Uploading to Dropbox...')
  const fileContent = fs.readFileSync(filePath)
  const fileName = path.basename(filePath)
  
  try {
    // For files > 150MB, upload sessions are needed. This uses standard upload for smaller sites.
    const response = await dbx.filesUpload({
      path: `/Backups/${fileName}`,
      contents: fileContent,
      mode: { '.tag': 'add' },
      autorename: true,
      mute: false,
      strict_conflict: false
    })
    console.log(`✅ Uploaded successfully to Dropbox: ${response.result.path_display}`)
  } catch (error) {
    console.error('❌ Dropbox upload failed:', error)
  }
}

async function cleanup() {
  console.log('🧹 Cleaning up temporary files...')
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true })
  }
  if (fs.existsSync(ZIP_FILE_PATH)) {
    fs.unlinkSync(ZIP_FILE_PATH)
  }
}

async function start() {
  if (!DROPBOX_REFRESH_TOKEN) {
    console.error('❌ DROPBOX_REFRESH_TOKEN is missing in .env. Please run `npm run backup:setup` first.')
    process.exit(1)
  }

  try {
    const zipPath = await createBackupZip()
    await uploadToDropbox(zipPath)
    await cleanup()
    console.log('🎉 Backup process completed successfully!')
  } catch (error) {
    console.error('💥 Backup failed:', error)
    await cleanup()
  }
}

start()
