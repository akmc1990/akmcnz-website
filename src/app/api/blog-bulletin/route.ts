export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getBlogBulletins } from '@/lib/blogBulletin';

export async function GET() {
  const bulletins = await getBlogBulletins(30);
  return NextResponse.json({ bulletins });
}
