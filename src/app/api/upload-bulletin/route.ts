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
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;

      if (!file) {
              return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

      const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';

      const result = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                            folder: 'akmcnz-bulletins',
                            resource_type: resourceType as 'raw' | 'image',
                            context: title ? { title } : {},
                },
                        (error, result) => {
                                    if (error) reject(error);
                                    else resolve(result);
                        }
                      ).end(buffer);
      });

      return NextResponse.json({ success: true, result });
  } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload bulletin' },
          { status: 500 }
              );
  }
}
