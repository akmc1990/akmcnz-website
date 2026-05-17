import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(
  buffer: Buffer,
  options: Record<string, unknown>
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result as { secure_url: string; public_id: string });
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
    const files = formData.getAll('files') as File[];

    if (!date) {
      return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
    }
    if (files.length === 0) {
      return NextResponse.json({ error: 'No image files provided' }, { status: 400 });
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
    } catch { /* ignore */ }

    // Upload each image file in order
    const uploadedImages: { url: string; public_id: string }[] = [];
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

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Upload failed: ' + message }, { status: 500 });
  }
}
