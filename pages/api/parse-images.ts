import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

const getOptions = async () => {
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    }
  } else {
    // 로컬 환경에서 Chrome 경로 설정
    return {
      args: [],
      executablePath: process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'linux'
          ? '/usr/bin/google-chrome'
          : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  let browser: puppeteer.Browser | null = null

  try {
    const options = await getOptions()
    browser = await puppeteer.launch(options)

    if (!browser) {
      throw new Error('브라우저를 시작할 수 없습니다.')
    }

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
    browser = null

    res.status(200).json({
      parsedImages,
    })
  } catch (error) {
    console.error('Error parsing images:', error)
    res.status(500).json({ 
      error: 'Failed to parse images', 
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
