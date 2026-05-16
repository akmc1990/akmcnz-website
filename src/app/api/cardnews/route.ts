import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'raw',
      prefix: 'akmcnz-cardnews/',
      max_results: 100,
    });

    const cardnews = result.resources
      .filter((r) => r.public_id !== 'akmcnz-cardnews/')
      .map((r) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        date: r.public_id.replace('akmcnz-cardnews/', '').replace('.json', ''),
        created_at: r.created_at,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({ cardnews });
  } catch (error) {
    console.error('List cardnews error:', error);
    return NextResponse.json({ error: 'Failed to list card news' }, { status: 500 });
  }
}
