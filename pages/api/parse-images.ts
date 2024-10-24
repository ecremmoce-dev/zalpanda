import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

    // div.editor_wrap 엘리먼트 안의 이미지 URL 추출
    const parsedImages = await page.evaluate(() => {
      const editorWrap = document.querySelector('div.editor_wrap')
      if (!editorWrap) return []

      const images = editorWrap.querySelectorAll('img')
      return Array.from(images)
        .map(img => img.getAttribute('data-src') || img.src)
        .filter(src => src && !src.startsWith('data:')) // data URL 제외
        .slice(0, 30) // 최대 30개로 제한
    })

    await browser.close()

    res.status(200).json({
      parsedImages,
    })
  } catch (error) {
    console.error('Error parsing images:', error)
    res.status(500).json({ 
      error: 'Failed to parse images', 
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
