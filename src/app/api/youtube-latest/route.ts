import { NextResponse } from 'next/server';
import { getLatestVideo } from '@/lib/youtube';

export async function GET() {
  const result = await getLatestVideo();
  return NextResponse.json(result);
}
