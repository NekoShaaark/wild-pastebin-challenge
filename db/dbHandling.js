import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
import { storedBinsTable } from '@/db/schema'

//generate random 10‑character cryptographic key for new bin link (can change length/charset)
const nanoId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
const db = drizzle(process.env.DATABASE_URL)


//pastebin handling
export async function getBinInDB(binLink){
    if(binLink != null){
        let pasteBin = await db
            .select()
            .from(storedBinsTable)
            .where(eq(storedBinsTable.binLink, binLink))
            .limit(1)
        if(pasteBin.length > 0){ return pasteBin[0] }
    }
    //link doesn't exist
    return null
}

export async function removeBinInDB(binLink){
    if(binLink != null){
        let pasteBinToRemove = getBinInDB(binLink)
        if(pasteBinToRemove){
            await db
                .delete(storedBinsTable)
                .where(eq(storedBinsTable.binLink, binLink))
            return true
        }
    }
    //nothing was removed
    return false
}

export async function createBinInDB({ userId, pasteBinContent, protectedBin, binPassword, expiresOn }){
    const maxRetries = 5
    let expiresOnDate = null
    if(expiresOn){ expiresOnDate = new Date(expiresOn) }
    
    for(let attempt=0; attempt < maxRetries; ++attempt){
        const binLink = nanoId()
        try{
            const newBin = await db
                .insert(storedBinsTable)
                .values({
                    userId,
                    pasteBinContent,
                    protectedBin,
                    binPassword,
                    binLink,
                    expiresOn: expiresOnDate
                })
                .returning()
                .execute()
            return newBin[0]
        }
        //collision error, will try again with a new unique nanoId
        catch(error){
            if(error.code === '23505'){ continue }
            throw error
        }
    }
    throw new Error(`Failed to generate a unique binLink after ${maxRetries} attempts.`)
}