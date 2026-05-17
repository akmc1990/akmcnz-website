import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // List all image resources under akmcnz-cardnews/
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'akmcnz-cardnews/',
      max_results: 500,
    });

    // List raw (PDF) resources
    let rawResources: { public_id: string; secure_url: string }[] = [];
    try {
      const rawResult = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix: 'akmcnz-cardnews/',
        max_results: 100,
      });
      rawResources = rawResult.resources || [];
    } catch {
      // ignore if no raw resources
    }

    // Build a map of date -> pdfUrl
    const pdfMap = new Map<string, string>();
    for (const r of rawResources) {
      const parts = r.public_id.split('/');
      if (parts.length >= 2) {
        const date = parts[1];
        pdfMap.set(date, r.secure_url);
      }
    }

    // Group images by date folder
    // Two modes:
    // 1. Direct image uploads: public_id = akmcnz-cardnews/YYYY-MM-DD/001
    // 2. PDF page uploads: public_id = akmcnz-cardnews/YYYY-MM-DD/page_001
    // 3. Old PDF source (skip): public_id = akmcnz-cardnews/YYYY-MM-DD/000_source
    const dateMap = new Map<string, {
      date: string;
      images: { url: string; public_id: string }[];
    }>();

    for (const r of result.resources) {
      const parts = r.public_id.split('/');
      if (parts.length < 3) continue;
      const date = parts[1];
      const filename = parts[2];

      if (!dateMap.has(date)) {
        dateMap.set(date, { date, images: [] });
      }
      const entry = dateMap.get(date)!;

      // Skip 000_source (old PDF upload artifact - first page only)
      if (filename && filename.startsWith('000_source')) {
        continue;
      }

      entry.images.push({ url: r.secure_url, public_id: r.public_id });
    }

    // Build final cardnews list
    const cardnews = Array.from(dateMap.values())
      .map(entry => {
        // Sort images by public_id DESCENDING (newest/highest number first)
        // This puts page_007 before page_001, matching typical bulletin order
        // (last uploaded = first page of bulletin displayed first)
        const images = entry.images.sort((a, b) => b.public_id.localeCompare(a.public_id));

        return {
          date: entry.date,
          images,
          pdfUrl: pdfMap.get(entry.date) || null,
        };
      })
      .filter(entry => entry.images.length > 0)
      .sort((a, b) => b.date.localeCompare(a.date)); // newest date first

    return NextResponse.json({ cardnews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch card news' }, { status: 500 });
  }
}
