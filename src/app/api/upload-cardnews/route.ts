import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractCardsFromJsx(jsxText: string): unknown[] | null {
    // Try to extract `const cards = [...]` array from JSX file
  const match = jsxText.match(/const\s+cards\s*=\s*(\[[\s\S]*?\]);?\s*\n/);
    if (!match) {
          // Try broader match
      const match2 = jsxText.match(/const\s+cards\s*=\s*(\[[\s\S]*\])\s*(?:;|\n|$)/);
          if (!match2) return null;
          try {
                  // eslint-disable-next-line no-new-func
            const fn = new Function(`return ${match2[1]}`);
                  return fn();
          } catch {
                  return null;
          }
    }
    try {
          // eslint-disable-next-line no-new-func
      const fn = new Function(`return ${match[1]}`);
          return fn();
    } catch {
          return null;
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const date = formData.get('date') as string | null;
        const label = formData.get('label') as string | null;

      if (!file) {
              return NextResponse.json({ error: 'file is required' }, { status: 400 });
      }
        if (!date) {
                return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
        }

      const jsxText = await file.text();

      // Extract cards array from JSX
      const cards = extractCardsFromJsx(jsxText);
        if (!cards || !Array.isArray(cards) || cards.length === 0) {
                return NextResponse.json(
                  { error: '.jsx 파일에서 cards 배열을 찾을 수 없습니다. 파일 내에 "const cards = [...]" 형태로 정의되어 있는지 확인해주세요.' },
                  { status: 400 }
                        );
        }

      // Store as JSON
      const jsonPayload = JSON.stringify({ cards, label: label || date, date });
        const buffer = Buffer.from(jsonPayload, 'utf-8');
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
