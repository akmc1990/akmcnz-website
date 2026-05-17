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
        const { date } = await request.json();
        if (!date) {
                return NextResponse.json({ error: 'date is required' }, { status: 400 });
        }

      const folder = 'akmcnz-cardnews/' + date;

      // List all images with this prefix (no trailing slash to match all)
      const existing = await cloudinary.api.resources({
              type: 'upload',
              resource_type: 'image',
              prefix: folder,
              max_results: 500,
      });

      let deleted = 0;
        if (existing.resources.length > 0) {
                const ids = existing.resources.map((r: { public_id: string }) => r.public_id);
                await cloudinary.api.delete_resources(ids);
                deleted = ids.length;
        }

      // Also delete the folder itself to clean up
      try {
              await cloudinary.api.delete_folder(folder);
      } catch {
              // Folder might not exist or might not be empty — ignore
      }

      return NextResponse.json({ success: true, deleted });
  } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Delete failed: ' + message }, { status: 500 });
  }
}
