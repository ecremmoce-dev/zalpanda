import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import FormData from 'form-data'

const NAVER_API_URL = "https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate";
const NCP_API_KEY_ID = 'nrwx3k20mp';
const NCP_API_KEY = 'VIX3SD1q6xZRv8fNGFk7N8BoqUEPZIPwPsSuN4Tw';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { source, target, image } = req.body;

      const formData = new FormData();
      formData.append('source', source);
      formData.append('target', target);
      formData.append('image', Buffer.from(image.split(',')[1], 'base64'), {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
      });

      const response = await fetch(NAVER_API_URL, {
        method: 'POST',
        headers: {
          "X-NCP-APIGW-API-KEY-ID": NCP_API_KEY_ID!,
          "X-NCP-APIGW-API-KEY": NCP_API_KEY!,
          ...formData.getHeaders()
        },
        body: formData
      });

      const data = await response.json();

      if (data.error) {
        if (data.error.message === "Image No Text error") {
          res.status(200).json({ originalImage: image });
        } else {
          res.status(400).json({ error: data.error.message });
        }
      } else {
        res.status(200).json({ translatedImage: data.data.renderedImage });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: '이미지 번역 중 오류가 발생했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
