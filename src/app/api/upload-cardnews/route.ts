import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      } catch {
              // ignore if folder doesn't exist
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
      } catch {
              // ignore
      }

      let pdfUrl: string | null = null;
        let pageCount = 0;
        const uploadedImages: { url: string; public_id: string }[] = [];

      if (pdfFile) {
              // PDF upload mode: Cloudinary auto-converts PDF pages to images
          const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
              const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

          // Upload PDF as image resource - Cloudinary will extract page count
          const pdfResult = await new Promise<{ secure_url: string; public_id: string; pages?: number }>((resolve, reject) => {
                    cloudinary.uploader.upload(pdfBase64, {
                                folder: folder,
                                resource_type: 'image',
                                format: 'jpg',
                                pages: true,
                                public_id: '000_source',
                    }, (error, result) => {
                                if (error) reject(error);
                                else resolve(result as { secure_url: string; public_id: string; pages?: number });
                    });
          });

          pageCount = pdfResult.pages || 1;

          // Also upload PDF as raw resource for download
          const rawResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                    cloudinary.uploader.upload(pdfBase64, {
                                folder: folder,
                                resource_type: 'raw',
                                public_id: 'bulletin.pdf',
                    }, (error, result) => {
                                if (error) reject(error);
                                else resolve(result as { secure_url: string; public_id: string });
                    });
          });

          pdfUrl = rawResult.secure_url;

          // Generate page image URLs using Cloudinary page transformation
          for (let i = 1; i <= pageCount; i++) {
                    const pageIdx = String(i).padStart(3, '0');
                    // Use Cloudinary URL with pg_ transformation to get each page as image
                const imageUrl = cloudinary.url(pdfResult.public_id, {
                            resource_type: 'image',
                            format: 'jpg',
                            transformation: [{ page: i, quality: 'auto:good', fetch_format: 'auto' }],
                });
                    uploadedImages.push({
                                url: imageUrl,
                                public_id: `${pdfResult.public_id}[${pageIdx}]`,
                    });
          }
      } else if (files.length > 0) {
              // Image upload mode (existing behavior)
          for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
                    const idx = String(i + 1).padStart(3, '0');
                    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                                cloudinary.uploader.upload(base64, {
                                              folder: folder,
                                              resource_type: 'image',
                                              public_id: idx,
                                }, (error, result) => {
                                              if (error) reject(error);
                                              else resolve(result as { secure_url: string; public_id: string });
                                });
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
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
