import { NextResponse } from 'next/server'
import { getBinInDB } from '@/db/dbHandling'

export async function GET(req, { params }) {
  const { binLink } = await params
  const searchParams = await req.nextUrl.searchParams
  const binPassword = searchParams.get('binPassword')

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
    if(binInDB.expiresOn && new Date() > new Date(binInDB.expiresOn)){
      return NextResponse.json(
        { error: "The pastebin you are trying to access has expired or doesn't exist" },
        { status: 410 }
      )
    }

    //if bin is protected, check searchParam (?=binPassword) for password, and query with bin in database
    if(binInDB.protectedBin){
      if(binInDB.binPassword === binPassword){ 
        //status code 200 => found bin in database
        return NextResponse.json(
          {
            pasteBinContent: binInDB.pasteBinContent,
            protectedBin: binInDB.protectedBin,
            binPassword: binInDB.binPassword,
            binLink: binInDB.binLink,
            createdAt: binInDB.createdAt,
            expiresOn: binInDB.expiresOn
          },
          { status: 200 }
        )
      }
      //status code 302 => found but changed temporarily
      return NextResponse.json(
        {
          protectedBin: binInDB.protectedBin
        },
        { status: 302 }
      )
    }

    //status code 200 => found bin in database
    return NextResponse.json(
      {
        pasteBinContent: binInDB.pasteBinContent,
        protectedBin: binInDB.protectedBin,
        binPassword: binInDB.binPassword,
        binLink: binInDB.binLink,
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