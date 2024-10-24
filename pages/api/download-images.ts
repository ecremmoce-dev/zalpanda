import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import JSZip from 'jszip'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { images, fileName } = req.body

  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'Images are required' })
  }

  try {
    const zip = new JSZip()

    for (let i = 0; i < images.length; i++) {
      const response = await axios.get(images[i], { responseType: 'arraybuffer' })
      const extension = path.extname(new URL(images[i]).pathname)
      const paddedIndex = String(i + 1).padStart(3, '0')
      zip.file(`${fileName}_${paddedIndex}${extension}`, response.data)
    }

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.zip`)
    res.send(zipContent)
  } catch (error) {
    console.error('Error downloading images:', error)
    res.status(500).json({ error: 'Failed to download images' })
  }
}
