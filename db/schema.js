import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const storedBinsTable = pgTable('stored_bins', {
        id: serial('id').primaryKey(), //internal id
        userId: text('user_id').notNull(), //id of user

        pasteBinContent: text('paste_bin_content').notNull(), //actual saved pastebin content
        protectedBin: boolean('protected_bin').default(false), //if bin is protected
        binPassword: text('bin_password').default(null), //password for accessing bin (null if no password)
        binLink: text('bin_link').notNull().unique(), //bin unique id for link
    
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        expiresOn: timestamp('expires_on', { withTimezone: true }).default(null) //date when bin will expire
    }
)