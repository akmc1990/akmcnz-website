import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
          const [imageResult, rawResult] = await Promise.all([
                  cloudinary.api.resources({
                            type: 'upload',
                            prefix: 'akmc/bulletins',
                            resource_type: 'image',
                            max_results: 100,
                            context: true,
                  }),
                  cloudinary.api.resources({
                            type: 'upload',
                            prefix: 'akmc/bulletins',
                            resource_type: 'raw',
                            max_results: 100,
                            context: true,
                  }),
                ]);

      const all = [
              ...(imageResult.resources || []),
              ...(rawResult.resources || []).map((r: any) => ({ ...r, format: 'pdf' })),
            ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return NextResponse.json({ bulletins: all });
    } catch (error) {
          console.error('Error fetching bulletins:', error);
          return NextResponse.json(
            { error: 'Failed to fetch bulletins' },
            { status: 500 }
                );
    }
}
