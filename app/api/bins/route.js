import { NextResponse } from 'next/server'
import { createBinInDB } from '@/db/dbHandling'

export async function POST(request) {
  let newBinData
  
  //parse and validate the incoming JSON body
  try{ newBinData = await request.json() }
  catch(error){
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  //create newBinData based on data passed in from request
  const {
    userId = "user123", //default value, other defaults are set in database schema
    pasteBinContent,
    protectedBin,
    binPassword,
    expiresOn
  } = newBinData

  if(!pasteBinContent){
    return NextResponse.json(
      { error: 'pasteBinContent are required' },
      { status: 400 }
    )
  }

  //create new bin in database
  try {
    const newBin = await createBinInDB({
      userId,
      pasteBinContent,
      protectedBin,
      binPassword,
      expiresOn
    })

    //status code 201 => successfully created bin in database
    return NextResponse.json(
      {
        id: newBin.id,
        userId: newBin.userId,
        binLink: newBin.binLink,
        pasteBinContent: newBin.pasteBinContent,
        binLink: newBin.binLink,
        createdAt: newBin.createdAt,
        expiresOn: newBin.expiresOn
      },
      { status: 201 }
    )
  } 
  catch(error){
    console.error('An error occurred while trying to create a new bin in the database:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}