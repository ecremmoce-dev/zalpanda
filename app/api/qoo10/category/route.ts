import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Authorization key is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'QAPIVersion': '1.0',
          'GiosisCertificationKey': key
        },
        body: new URLSearchParams({
          'method': 'CommonInfoLookup.GetCatagoryListAll',
          'lang_cd': 'ja'
        }).toString()
      }
    )

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 