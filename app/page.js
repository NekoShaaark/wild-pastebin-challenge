"use client"

import { useState } from "react"
import { FormTextarea } from "@/components/FormTextarea"
import { useRouter } from "next/navigation"
import { setReactDebugChannel } from "next/dist/server/dev/debug-channel"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [pasteBinContent, setPasteBinContent] = useState("")
  const [error, setError] = useState(null) //STUB: could make this a toast notification instead
  const router = useRouter()
  let userId
  let protectedBin
  let binPassword
  let expiresOn

  //clipboard handling
  //TODO: remove that annoying "paste" dialogue each time the user clicks button
  const handlePasteFromClipboard = async (e) => {
    e.preventDefault()
    if(!navigator.clipboard?.readText){
      setError("Your browser does not support copying from your clipboard.")
      return
    }

    try{
      const clipboardContent = await navigator.clipboard.readText()
      if(!clipboardContent){ 
        setError("Your clipboard is empty.") 
        return 
      }
      setPasteBinContent((previousContent) => previousContent + clipboardContent)
      setError(null)
    } 
    catch(error){
      console.error(error)
      setError("Couldn't read from the clipboard, please this website grant permission and try again.")
    }
  }

  //clear content handling
  const handleClearContent = async () => {
    if(!pasteBinContent){ return }

    try{ setPasteBinContent("") }
    catch(error){
      console.error("An error occured while trying to clear the content:", error)
      setError("An error occured while trying to clear the content.")
    }
    setError(null)
  }

  //post content to bins api (/api/bins)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(pasteBinContent.trim().length < 1){
      setError("Please enter at least 1 character.")
      return
    }
    setError(null)

    const pasteBinSubmission = {
      userId,
      pasteBinContent,
      protectedBin,
      binPassword,
      expiresOn
    }
    
    try {
      const apiResult = await fetch('/api/bins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pasteBinSubmission)
      })
      const apiResultData = await apiResult.json()

      //api responded with an error
      if(!apiResult.ok){
        setError(apiResultData.error)
        return
      }

      console.log("final data", apiResultData)
      router.push(`/${await apiResultData.binLink}`)
    }
    catch(error){
      console.error(error)
      setError('A network error occurred, please try again.')
    }
  }

  return (
    //TODO: move all tailwind css from template to globals.css
    <section className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="mb-4 text-xl font-semibold">
        New Paste
      </h2>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
        <FormTextarea
          placeholder="Paste your text here!"
          value={pasteBinContent}
          onChange={(e) => setPasteBinContent(e.target.value)}
          maxLength={5000}
          errorMessage={error}
        />

        <Button type="button" onClick={handlePasteFromClipboard}>Paste from clipboard</Button>
        <Button type="button" onClick={handleClearContent}>Clear</Button>

        <Button
          type="submit"
          className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          Create New Paste
        </Button>
      </form>
    </section>
  )
}