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
    const body = await request.json();
    const { cards, label, date } = body;

    if (!cards || !Array.isArray(cards)) {
      return NextResponse.json({ error: 'cards array is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const payload = JSON.stringify({ cards, label: label || date, date });
    const buffer = Buffer.from(payload, 'utf-8');
    const publicId = `akmcnz-cardnews/${date}`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'raw',
          overwrite: true,
          format: 'json',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Upload cardnews error:', error);
    return NextResponse.json({ error: 'Failed to upload card news' }, { status: 500 });
  }
}
