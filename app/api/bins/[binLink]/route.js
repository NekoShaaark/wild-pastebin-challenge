import { NextResponse } from 'next/server'
import { getBinInDB } from '@/db/dbHandling'

export async function GET({ params }) {
  const { binLink } = await params

  try {
    //get bin from database
    const binInDB = await getBinInDB(binLink)

    //status code 404 => bin doesn't exist
    if(!binInDB){
      return NextResponse.json(
        { error: 'Bin not found' },
        { status: 404 }
      )
    }

    //expiration checking
    //status code 410 => bin has expired (existed before, but not anymore)
    if(binInDB.expiresOn){
      const currentDate = new Date()
      const expirationDate = new Date(binInDB.expiresOn)
      if(currentDate > expirationDate){
        return NextResponse.json(
          { error: 'The pastebin you are trying to access has expired' },
          { status: 410 }
        )
      }
    }

    //TODO: if bin is protected, ask for password, and query with database
    // if(bin.protectedBin){
    //  
    // }

    //status code 200 => found bin in database
    return NextResponse.json(
      {
        content: binInDB.pasteBinContent,
        link: binInDB.binLink,
        createdAt: binInDB.createdAt,
        expiresOn: binInDB.expiresOn
      },
      { status: 200 }
    )
  } 
  catch(error) {
    console.error('Error fetching bin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}