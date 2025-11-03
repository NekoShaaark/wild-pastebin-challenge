import { getTimeRemainingString } from "@/lib/timeHelpers"
import { notFound } from "next/navigation"

export default async function BinPage({ params }) {
  const { binLink } = await params
  
  //sanitize user input (ie. remove special characters, to prevent sqli)
  //get bin from api route
  const sanitzedBinLink = binLink.replace(/[^a-zA-Z0-9]/g, '')
  const apiResult = await fetch(`http://localhost:3000/api/bins/${encodeURIComponent(sanitzedBinLink)}`) //TODO: change this in production
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

  //convert expiresOn date to timeRemaining string
  const expiresOnDate = new Date(apiResultData.expiresOn)
  let expirationString
  if(expiresOnDate){ expirationString = await getTimeRemainingString(expiresOnDate) }

  //TODO: if bin is protected, ask for password, and query with database
  // if(bin.protectedBin){
  //   
  // }

  //pastebin content
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* TODO: add custom name here */}
      <h1 className="text-2xl font-bold mb-4">Paste Bin Name Here</h1>

      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap wrap-break-word">
        {apiResultData.pasteBinContent}
      </pre>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Created on: </strong>
          {(new Date(apiResultData.createdAt)).toLocaleString()}
        </p>
        <p>
          <strong>Expires in: </strong>
          {expiresOnDate ? `${expirationString} (${(expiresOnDate).toLocaleString()})` : "Never"}
        </p>
      </div>
    </div>
  )
}