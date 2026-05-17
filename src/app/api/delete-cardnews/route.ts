import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const folder = 'akmcnz-cardnews/' + date;

    // Find all images in this date folder
    const existing = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: folder + '/',
      max_results: 100,
    });

    let deletedImages = 0;
    if (existing.resources.length > 0) {
      const ids = existing.resources.map((r: { public_id: string }) => r.public_id);
      await cloudinary.api.delete_resources(ids, { resource_type: 'image' });
      deletedImages = ids.length;
    }

    // Also delete raw (PDF) resources
    let deletedPdfs = 0;
    try {
      const existingRaw = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix: folder + '/',
        max_results: 10,
      });
      if (existingRaw.resources.length > 0) {
        const rawIds = existingRaw.resources.map((r: { public_id: string }) => r.public_id);
        await cloudinary.api.delete_resources(rawIds, { resource_type: 'raw' });
        deletedPdfs = rawIds.length;
      }
    } catch {
      // ignore if no raw resources
    }

    return NextResponse.json({ success: true, deleted: deletedImages, deletedPdfs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
