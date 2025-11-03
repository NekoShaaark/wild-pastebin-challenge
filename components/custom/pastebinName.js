"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function PastebinName() {
    const router = useRouter()
    const directHome = async (e) => { router.push('/') }
    const copyToClipboard = async (e) => {
        navigator.clipboard.writeText(window.location.href)
        toast.info("Copied Link to Clipboard")
    }

    return(
        <div className="flex justify-between w-full h-full">
            <Button className="flex mb-4 text-l font-semibold bg-gray-200 hover:bg-gray-300 cursor-pointer gap-2" onClick={directHome}><ArrowLeft/>Back to Home</Button>
            <h1 className="mb-4 text-xl font-semibold">Untitled Paste</h1>
            <Button className="flex mb-4 text-l font-semibold bg-gray-200 hover:bg-gray-300 cursor-pointer gap-2" onClick={copyToClipboard}><Copy/>Copy Link</Button>
        </div>
    )
}