export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getBlogGalleryPosts } from '@/lib/blogGallery';

export async function GET() {
  const posts = await getBlogGalleryPosts(30);
  return NextResponse.json({ posts });
}
