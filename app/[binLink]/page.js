import PasswordInput from "@/components/custom/passwordInput"
import { getTimeRemainingString } from "@/lib/timeHelpers"
import { notFound } from "next/navigation"

export default async function BinPage({ params, searchParams }) {
  const { binLink } = await params
  const { binPassword } = await searchParams
  
  //sanitize user input (ie. remove special characters, to prevent sqli)
  //get bin from api route
  const sanitzedBinLink = binLink.replace(/[^a-zA-Z0-9]/g, '')
  const apiResult = await fetch(`http://localhost:3000/api/bins/${sanitzedBinLink}${binPassword ? `?binPassword=${binPassword}` : ""}`) //TODO: change base url in production
  const apiResultData = await apiResult.json()

  //expiration/existance checking
  if(apiResult.status === 404 || apiResult.status === 500){ notFound() }
  if(apiResult.status === 410){
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">
          This bin has expired or doesn't exist.
        </h1>
      </div>
    )
  }

  //status 302 => bin is protected, render password input and handle
  if(apiResult.status === 302){
    return (
      <PasswordInput binLink={sanitzedBinLink}/>
    )
  }

  //convert expiresOn date to timeRemaining string
  let expirationString
  const expiresOnDate = new Date(apiResultData.expiresOn)
  if(apiResultData.expiresOn){ expirationString = await getTimeRemainingString(expiresOnDate) }


  //pastebin content
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      {/* TODO: add custom name here */}
      <h1 className="mb-4 text-xl font-semibold">Paste Name here</h1>

      <pre className="bg-gray-200 max-w-lvw p-4 rounded-2xl whitespace-pre-wrap wrap-break-word">
        {apiResultData.pasteBinContent}
      </pre>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Created on: </strong>
          {(new Date(apiResultData.createdAt)).toLocaleString()}
        </p>
        <p>
          <strong>Expires in: </strong>
          {apiResultData.expiresOn ? `${expirationString} (${(expiresOnDate).toLocaleString()})` : "Never"}
        </p>
      </div>
    </div>
  )
}