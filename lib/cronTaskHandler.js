import cron from 'node-cron'
import { runPastebinDeletionTask } from '@/lib/pastebinDeletion'

//run cron task daily at 2am
export const scheduleCronPastebinDeletionTask = () => {
  console.log("[CRON] Cron task scheduled for 2am")
  cron.schedule("0 2 * * *", async () => {
    console.log("[CRON] Running Pastebin deletion task...")
    await runPastebinDeletionTask()
    console.log("[CRON] Pastebin deletion task complete.")
  })
}