import { NextResponse } from 'next/server';
import { getRecentVideos } from '@/lib/youtube';

export async function GET() {
  const videos = await getRecentVideos(5);
  return NextResponse.json({ videos });
}
