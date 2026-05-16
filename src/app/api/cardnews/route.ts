import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // List all date folders under akmcnz-cardnews/
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'akmcnz-cardnews/',
      max_results: 500,
    });

    // Group images by date folder (akmcnz-cardnews/YYYY-MM-DD/001, ...)
    const dateMap = new Map<string, { date: string; images: { url: string; public_id: string }[] }>();

    for (const r of result.resources) {
      // public_id format: akmcnz-cardnews/2026-05-17/001
      const parts = r.public_id.split('/');
      if (parts.length < 3) continue;
      const date = parts[1];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, images: [] });
      }
      dateMap.get(date)!.images.push({ url: r.secure_url, public_id: r.public_id });
    }

    // Sort images within each date by public_id (filename order)
    const cardnews = Array.from(dateMap.values())
      .map(entry => ({
        ...entry,
        images: entry.images.sort((a, b) => a.public_id.localeCompare(b.public_id)),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({ cardnews });
  } catch (error) {
    console.error('List cardnews error:', error);
    return NextResponse.json({ error: 'Failed to list card news' }, { status: 500 });
  }
}
