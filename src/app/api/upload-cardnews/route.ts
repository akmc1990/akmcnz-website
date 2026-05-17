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

// Helper: upload buffer to Cloudinary via upload_stream
function uploadBuffer(
  buffer: Buffer,
  options: Record<string, unknown>
): Promise<{ secure_url: string; public_id: string; pages?: number }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error('[upload-cardnews] upload_stream error:', JSON.stringify(error));
          reject(error);
        } else {
          resolve(result as { secure_url: string; public_id: string; pages?: number });
        }
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

    // Delete existing images in this date folder first
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
    } catch (e) {
      console.error('[upload-cardnews] delete existing images error:', e);
    }

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
    } catch (e) {
      console.error('[upload-cardnews] delete existing raw error:', e);
    }

    let pdfUrl: string | null = null;
    const uploadedImages: { url: string; public_id: string }[] = [];

    if (pdfFile) {
      console.log('[upload-cardnews] PDF upload started, size:', pdfFile.size);
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

      // Step 1: Upload PDF as raw for download link
      console.log('[upload-cardnews] Uploading PDF as raw resource...');
      const rawResult = await uploadBuffer(pdfBuffer, {
        folder,
        resource_type: 'raw',
        public_id: 'bulletin.pdf',
      });
      pdfUrl = rawResult.secure_url;
      console.log('[upload-cardnews] Raw PDF uploaded:', pdfUrl);

      // Step 2: Upload PDF as image with pages:true
      // Cloudinary will convert the first page and return total page count
      console.log('[upload-cardnews] Uploading PDF as image to get page count...');
      const pdfResult = await uploadBuffer(pdfBuffer, {
        folder,
        resource_type: 'image',
        format: 'jpg',
        pages: true,
        public_id: '000_source',
      });

      const pageCount = pdfResult.pages ?? 1;
      console.log('[upload-cardnews] Page count from Cloudinary:', pageCount, 'public_id:', pdfResult.public_id);

      // Step 3: Build page image URLs using Cloudinary on-the-fly transformation
      // This approach avoids uploading each page separately (saves time and avoids timeout)
      // Cloudinary will generate each page image on demand from the stored PDF
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const sourcePublicId = pdfResult.public_id; // e.g. akmcnz-cardnews/2026-05-17/000_source

      for (let i = 1; i <= pageCount; i++) {
        const paddedPage = String(i).padStart(3, '0');
        // Build URL: https://res.cloudinary.com/{cloud}/image/upload/pg_{i}/v{version}/{public_id}.jpg
        const pageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/pg_${i}/${sourcePublicId}.jpg`;
        uploadedImages.push({
          url: pageUrl,
          public_id: sourcePublicId + '_p' + paddedPage,
        });
      }

      console.log('[upload-cardnews] Built', uploadedImages.length, 'page URLs');
    } else if (files.length > 0) {
      // Image upload mode (existing behavior)
      const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
      for (let i = 0; i < sortedFiles.length; i++) {
        const file = sortedFiles[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const paddedIndex = String(i + 1).padStart(3, '0');
        const result = await uploadBuffer(buffer, {
          folder,
          resource_type: 'image',
          public_id: paddedIndex,
        });
        uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    } else {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    console.log('[upload-cardnews] Complete. Total images:', uploadedImages.length);

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      pdfUrl,
      count: uploadedImages.length,
    });
  } catch (error) {
    console.error('[upload-cardnews] Unhandled error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Upload failed: ' + message }, { status: 500 });
  }
}
