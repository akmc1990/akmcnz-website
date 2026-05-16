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
          const { public_id } = await request.json();
          if (!public_id) {
                    return NextResponse.json({ error: 'No public_id provided' }, { status: 400 });
          }

        await cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
          return NextResponse.json({ success: true });
  } catch (error) {
          console.error('Error deleting photo:', error);
          return NextResponse.json(
              { error: 'Failed to delete photo' },
              { status: 500 }
                  );
  }
}
