import { drizzle } from 'drizzle-orm/node-postgres'
import { lt } from 'drizzle-orm'
import { storedBinsTable } from '@/db/schema'
import { removeBinInDB } from '@/db/dbHandling'

const db = drizzle(process.env.DATABASE_URL)

async function getExpiredBins() {
    const currentDate = new Date()
    const result = await db
        .select()
        .from(storedBinsTable)
        .where(lt(storedBinsTable.expiresOn, currentDate))
    return result
}

export async function runPastebinDeletionTask(){
    const expiredBins = await getExpiredBins()
    let deletePromises = expiredBins.map(async (bin) => {
        return await removeBinInDB(bin.binLink)
    })
    await Promise.all(deletePromises)
    console.log(`Deleted ${expiredBins.length} expired entries.`)
}