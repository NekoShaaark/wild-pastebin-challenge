import { getBinInDB } from "@/db/dbHandling"
import { notFound } from "next/navigation"

export default async function BinPage({ params }) {
  const { binLink } = await params

  //TODO: add user input sanitation (ie. remove special characters, to prevent sqli) 
  //get bin from database
  const binInDB = await getBinInDB(binLink)
  if(!binInDB){ notFound() }

  //TODO: handle expiration checking (either return to not found page, or add bin id to another db table)
  if(binInDB.expiresOn && new Date() > new Date(binInDB.expiresOn)) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">
          This bin has expired
        </h1>
      </div>
    )
  }

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
        {binInDB.pasteBinContent}
      </pre>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Created:</strong>{' '}
          {new Date(binInDB.createdAt).toLocaleString()}
        </p>
        {binInDB.expiresOn && (
          <p>
            <strong>Expires:</strong>{' '}
            {new Date(binInDB.expiresOn).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}