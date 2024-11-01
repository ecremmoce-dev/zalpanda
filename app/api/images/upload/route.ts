import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getKTCloudToken } from '@/lib/ktcloud/token'
import { uploadImageToKTCloud } from '@/lib/ktcloud/upload'

export async function POST(request: Request) {
  try {
    const { images, companyId, productName } = await request.json()

    console.log('Processing upload request:', {
      companyId,
      productName,
      imageCount: images.length
    })

    const company = await prisma.companyInfo.findUnique({
      where: { Id: companyId }
    })

    if (!company?.VendorProductCd) {
      throw new Error('Company not found or VendorProductCd missing')
    }

    const token = await getKTCloudToken()
    console.log('Token acquired successfully:', token)

    const uploadedUrls = []
    
    // 첫 번째 이미지 업로드 및 URL 획득
    const firstImage = images[0]
    const firstImageBuffer = Buffer.from(firstImage.split(',')[1], 'base64')
    const timestamp = Date.now()
    const firstFileName = `${company.VendorProductCd}_${timestamp}_1.png`
    
    const thumbnailUrl = await uploadImageToKTCloud({
      token,
      imageBuffer: firstImageBuffer,
      fileName: firstFileName,
      vendorPath: company.VendorProductCd
    })
    
    uploadedUrls.push(thumbnailUrl)
    console.log('Thumbnail uploaded successfully:', thumbnailUrl)

    // 상품 정보가 이미 존재하는지 확인
    const existingProduct = await prisma.squareProduct.findFirst({
      where: {
        ProductName: productName
      }
    });

    let product;
    if (existingProduct) {
      // 기존 상품 정보 업데이트
      product = await prisma.squareProduct.update({
        where: { Id: existingProduct.Id },
        data: {
          ThumbnailURL: thumbnailUrl,
          UpdatedAt: new Date()
        }
      });
    } else {
      // 새 상품 정보 생성
      product = await prisma.squareProduct.create({
        data: {
          ProductName: productName,
          ThumbnailURL: thumbnailUrl,
          CreatedAt: new Date(),
          UpdatedAt: new Date()
        }
      });
    }
    
    console.log('Product created/updated with thumbnail:', product)

    // 나머지 이미지 업로드
    for (let i = 1; i < images.length; i++) {
      const image = images[i]
      const imageBuffer = Buffer.from(image.split(',')[1], 'base64')
      
      const fileName = `${company.VendorProductCd}_${timestamp}_${i + 1}.png`

      console.log(`Uploading image ${i + 1}/${images.length}:`, fileName)

      const uploadedUrl = await uploadImageToKTCloud({
        token,
        imageBuffer,
        fileName,
        vendorPath: company.VendorProductCd
      })

      console.log(`Image ${i + 1} uploaded successfully:`, uploadedUrl)
      uploadedUrls.push(uploadedUrl)
    }

    console.log('All images uploaded successfully. URLs:', uploadedUrls)

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      productId: String(product.Id)
    })

  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return new Response(JSON.stringify({ 
      error: '이미지 업로드 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 