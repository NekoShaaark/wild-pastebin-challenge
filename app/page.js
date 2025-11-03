"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDownIcon, Square, SquareCheck, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { isBefore } from "date-fns"
import { Toggle } from "@/components/ui/toggle"
import { getTimeRemainingString } from "@/lib/timeHelpers"
import { Input } from "@/components/ui/input"
import { generatePassword } from "@/lib/passwordHandler"
import { toast } from "sonner"

export default function HomePage() {
  const [pasteBinContent, setPasteBinContent] = useState("")
  const [disableClear, setDisableClear] = useState(true)
  const [error, setError] = useState(null) //STUB: could make this a toast notification instead
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null) //this is referenced when reverting "never expires" to actual selectedDate
  const [selectedDateHolder, setSelectedDateHolder] = useState(null) //this holds the state of the selectedDate (null, or actual selectedDate)
  const [expirationDateText, setExpirationDateText] = useState("Never expires.") //just for displaying string of when the expiration date is
  const [isExpirationDateEnabled, setIsExpirationDateEnabled] = useState(false)
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [passwordContent, setPasswordContent] = useState("")
  const router = useRouter()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  const handlePasteBinContentChange = async (content) => {
    setPasteBinContent(content)

    if(!content){ setDisableClear(true); return }
    setDisableClear(false)
  }

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
      setDisableClear(false)
      toast.info("Pasted from Clipboard")
    } 
    catch(error){
      console.error(error)
      setError("Couldn't read from the clipboard, please grant this website permission and try again.")
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
    setDisableClear(true)
    toast.error("Cleared pasted Content")
  }

  //handle selected date
  const handleSelectedDateChange = async (newDate) => {
    if(!newDate){ 
      setExpirationDateText("Never expires.")
      setSelectedDate(null)
      return 
    }
    
    setSelectedDate(newDate)
    setSelectedDateHolder(newDate)
    let timeRemainingString = await getTimeRemainingString(newDate)
    setExpirationDateText(`Expires in ${timeRemainingString}.`)
  }

  //handle paste expiration toggle
  async function handlePasteExpirationEnabled(isEnabled){
    if(isEnabled){ handleSelectedDateChange(selectedDate) }
    else{
      setExpirationDateText("Never expires.")
      setSelectedDateHolder(null)
    }
    setIsExpirationDateEnabled(isEnabled)
  }

  //handle password toggle
  async function handlePasswordEnabled(isEnabled) {
    const newPassword = generatePassword()
    setPasswordContent(newPassword)
    setIsPasswordEnabled(isEnabled)
  }

  //post content to bins api (/api/bins)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(pasteBinContent.trim().length < 1){
      setError("Please enter at least 1 character.")
      return
    }
    if(isPasswordEnabled && passwordContent.length < 8){
      setError("Please enter at least 8 characters for the password.")
      return
    }
    setError(null)

    const pasteBinSubmission = {
      userId: "user123",
      pasteBinContent,
      protectedBin: isPasswordEnabled,
      binPassword: passwordContent,
      expiresOn: selectedDateHolder
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="mb-4 text-xl font-semibold">New Paste</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
        {/* text typing area */}
        <div className="space-y-1">
          <Textarea
            placeholder="Paste your text here!"
            value={pasteBinContent}
            onChange={(e) => handlePasteBinContentChange(e.target.value)}
            className="w-full min-h-[120px] focus:bg-gray-200"
          />

          {/* error dialogue */}
          {/* TODO: change to toast notification */}
          {error && (
            <strong className="mt-1 text-sm text-red-600">{error}</strong>
          )}
        </div>

        {/* paste from clipboard & clear buttons */}
        <div className="flex justify-between">
          <Button type="button" className="cursor-pointer" onClick={handlePasteFromClipboard}>Paste from Clipboard</Button>
          <Button type="button" className="cursor-pointer" disabled={disableClear} variant="destructive" onClick={handleClearContent}>Clear <Trash/></Button>
        </div>

        {/* expiration date selector */}
        <div className="flex flex-row justify-between gap-3">
          
          <Toggle className="px-1 cursor-pointer" onClick={() => handlePasteExpirationEnabled(!isExpirationDateEnabled)}>
            {isExpirationDateEnabled ? <SquareCheck/> : <Square/>}
            Paste Expiration
          </Toggle>

          {/* only show calendar if toggled on */}
          {isExpirationDateEnabled && 
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-36 justify-between font-normal cursor-pointer">
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  disabled={(day) => isBefore(day, currentDate)}
                  defaultMonth={selectedDate}
                  fromYear={currentYear}
                  toYear={currentYear + 1}
                  onSelect={(date) => {
                    handleSelectedDateChange(date)
                    setCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          }
          <Label className="px-1 ml-auto">{expirationDateText}</Label>
        </div>

        {/* password selector */}
        <div className="flex flex-row justify-between gap-3">
          <Toggle className="px-1 cursor-pointer" onClick={() => handlePasswordEnabled(!isPasswordEnabled)}>
            {isPasswordEnabled ? <SquareCheck/> : <Square/>}
            Password
          </Toggle>
          {isPasswordEnabled &&
            <Input 
              className="w-auto focus:bg-gray-200"
              value={passwordContent}
              placeholder="Password"
              maxLength={12}
              onChange={(e) => setPasswordContent(e.target.value)}
            />
          }
        </div>

        {/* final submittion/creation button */}
        <Button
          type="submit"
          className="w-full cursor-pointer rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          Create New Paste
        </Button>
      </form>
    </div>
  )
}