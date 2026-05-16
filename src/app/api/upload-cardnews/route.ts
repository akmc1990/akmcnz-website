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
    const files = formData.getAll('files') as File[];

    if (!date) {
      return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
    }
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'At least one image file is required' }, { status: 400 });
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
        await cloudinary.api.delete_resources(ids, { resource_type: 'image' });
      }
    } catch {
      // Ignore errors if folder doesn't exist yet
    }

    // Upload each image with sequential index
    const results = await Promise.all(
      files.map((file, idx) =>
        new Promise<Record<string, unknown>>((resolve, reject) => {
          file.arrayBuffer().then(buf => {
            const buffer = Buffer.from(buf);
            cloudinary.uploader.upload_stream(
              {
                public_id: folder + '/' + String(idx + 1).padStart(3, '0'),
                resource_type: 'image',
                overwrite: true,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as Record<string, unknown>);
              }
            ).end(buffer);
          });
        })
      )
    );

    return NextResponse.json({ success: true, count: results.length, results });
  } catch (error) {
    console.error('Upload cardnews error:', error);
    return NextResponse.json({ error: 'Failed to upload card news images' }, { status: 500 });
  }
}
