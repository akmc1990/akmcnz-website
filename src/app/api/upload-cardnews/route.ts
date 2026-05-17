import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Next.js App Router: set max function duration (seconds)
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload buffer to Cloudinary via upload_stream (no base64 overhead)
function uploadBuffer(
  buffer: Buffer,
  options: Record<string, unknown>
): Promise<{ secure_url: string; public_id: string; pages?: number }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result as { secure_url: string; public_id: string; pages?: number });
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const date = formData.get('date') as string | null;
    const pdfFile = formData.get('pdf') as File | null;
    const files = formData.getAll('files') as File[];

    if (!date) {
      return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const folder = 'akmcnz-cardnews/' + date;

    // Delete existing images in this date folder first (overwrite)
    try {
      const existing = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix: folder + '/',
        max_results: 100,
      });
      if (existing.resources.length > 0) {
        const ids = existing.resources.map((r: { public_id: string }) => r.public_id);
        await cloudinary.api.delete_resources(ids);
      }
    } catch { /* ignore */ }

    // Delete existing raw (PDF) in this date folder
    try {
      const existingRaw = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix: folder + '/',
        max_results: 10,
      });
      if (existingRaw.resources.length > 0) {
        const ids = existingRaw.resources.map((r: { public_id: string }) => r.public_id);
        await cloudinary.api.delete_resources(ids, { resource_type: 'raw' });
      }
    } catch { /* ignore */ }

    let pdfUrl: string | null = null;
    let pageCount = 0;
    const uploadedImages: { url: string; public_id: string }[] = [];

    if (pdfFile) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

      // 1. Upload PDF as image resource - Cloudinary extracts pages and returns page count
      const pdfResult = await uploadBuffer(pdfBuffer, {
        folder,
        resource_type: 'image',
        format: 'jpg',
        pages: true,
        public_id: '000_source',
      });

      pageCount = pdfResult.pages || 1;

      // 2. Upload original PDF as raw for download link
      const rawResult = await uploadBuffer(pdfBuffer, {
        folder,
        resource_type: 'raw',
        public_id: 'bulletin.pdf',
      });
      pdfUrl = rawResult.secure_url;

      // 3. Build image URLs for each page using Cloudinary page transformation
      for (let i = 1; i <= pageCount; i++) {
        const pageUrl = cloudinary.url(pdfResult.public_id, {
          resource_type: 'image',
          format: 'jpg',
          transformation: [{ page: i, quality: 'auto:good', fetch_format: 'auto' }],
          secure: true,
        });
        uploadedImages.push({
          url: pageUrl,
          public_id: pdfResult.public_id + '_pg' + i,
        });
      }
    } else if (files.length > 0) {
      // Image upload mode (existing behavior)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const idx = String(i + 1).padStart(3, '0');
        const result = await uploadBuffer(buffer, {
          folder,
          resource_type: 'image',
          public_id: idx,
        });
        uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    } else {
      return NextResponse.json({ error: 'PDF file or image files are required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      date,
      images: uploadedImages,
      pdfUrl,
      pageCount,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
