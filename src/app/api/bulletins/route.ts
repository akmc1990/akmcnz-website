import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: NextRequest) {
  try {
    const [imageResult, pdfResult] = await Promise.all([
      cloudinary.search
        .expression('folder:akmc/bulletins AND resource_type:image')
        .sort_by('created_at', 'desc')
        .max_results(50)
        .with_field('context')
        .execute(),
      cloudinary.search
        .expression('folder:akmc/bulletins AND resource_type:raw')
        .sort_by('created_at', 'desc')
        .max_results(50)
        .with_field('context')
        .execute(),
    ])

    const allBulletins = [
      ...imageResult.resources,
      ...pdfResult.resources,
    ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ bulletins: allBulletins })
  } catch (error: any) {
    console.error('Cloudinary error:', error)
    return NextResponse.json({ error: 'Failed to fetch bulletins' }, { status: 500 })
  }
}
