import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, Files } from 'formidable'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const form = new IncomingForm()
    const [, files] = await new Promise<[unknown, Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const imageFile = files.image
    if (!imageFile || !Array.isArray(imageFile) || imageFile.length === 0) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' })
    }

    const imageBuffer = await fs.readFile(imageFile[0].filepath)
    const base64Image = imageBuffer.toString('base64')

    const vmakeResponse = await axios.post(
      'https://open.vmake.ai/api/v1/image/remove-background',
      { image: base64Image },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.VMAKE_API_KEY,
        },
      }
    )

    if (vmakeResponse.data.code !== 0) {
      throw new Error(vmakeResponse.data.message || '배경 제거 중 오류가 발생했습니다.')
    }

    const resultImageBuffer = Buffer.from(vmakeResponse.data.data.image, 'base64')
    const resultFileName = `result_${Date.now()}.png`
    const resultFilePath = path.join(process.cwd(), 'public', 'results', resultFileName)

    await fs.writeFile(resultFilePath, resultImageBuffer)

    const resultImageUrl = `/results/${resultFileName}`
    res.status(200).json({ resultImageUrl })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}
