import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { scheduleCronPastebinDeletionTask } from "@/lib/cronTaskHandler"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata = {
  title: "Wild Paste",
  description: '"Paste your wildest Dreams!"'
}

export default function RootLayout({ children }) {
  scheduleCronPastebinDeletionTask() //should start on server init

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  )
}