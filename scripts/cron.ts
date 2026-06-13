import cron from 'node-cron'
import { exec } from 'child_process'

console.log('⏳ Starting Dropbox backup cron job schedule...')
console.log('📅 Scheduled to run automatically every Sunday at 2:00 AM')

// '0 2 * * 0' = Every Sunday at 2:00 AM
cron.schedule('0 2 * * 0', () => {
  console.log('⏰ Running scheduled weekly Dropbox backup...')
  
  exec('npm run backup', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Scheduled backup failed:', error)
      console.error(stderr)
    } else {
      console.log('✅ Scheduled backup completed successfully:')
      console.log(stdout)
    }
  })
})
