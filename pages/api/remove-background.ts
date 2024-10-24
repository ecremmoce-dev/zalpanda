import type { NextApiRequest, NextApiResponse } from 'next'

const VMAKE_API_KEY = '66850ffde4b00b4593836252'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body

      const apiResponse = await fetch('https://open.vmake.ai/api/v1/image/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VMAKE_API_KEY}`
        },
        body: JSON.stringify({ image })
      })

      if (apiResponse.ok) {
        const result = await apiResponse.json()
        res.status(200).json(result)
      } else {
        res.status(apiResponse.status).json({ error: '배경 제거 실패' })
      }
    } catch (error) {
      res.status(500).json({ error: '서버 오류' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
