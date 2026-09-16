export const dynamic = 'force-dynamic';
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
      max_results: 500,
    });

    // One PDF per date folder (akmcnz-cardnews/YYYY-MM-DD/bulletin.pdf)
    const cardnews = result.resources
      .map((r: { public_id: string; secure_url: string }) => {
        const parts = r.public_id.split('/');
        if (parts.length < 3) return null;
        return { date: parts[1], url: r.secure_url, public_id: r.public_id };
      })
      .filter((e: { date: string; url: string; public_id: string } | null): e is { date: string; url: string; public_id: string } => e !== null)
      .sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date));

    return NextResponse.json({ cardnews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch card news' }, { status: 500 });
  }
}
