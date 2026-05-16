import { NextResponse } from 'next/server';

// Fetches the latest video ID from the AKMC YouTube channel via RSS feed
export async function GET() {
    try {
          const rssUrl = 'https://www.youtube.com/feeds/videos.xml?user=akmcnz';
          const handleUrl = 'https://www.youtube.com/feeds/videos.xml?forHandle=akmcnz';

          // Try handle-based RSS first, fall back to user-based
          let res = await fetch(handleUrl, { next: { revalidate: 3600 } });
          if (!res.ok) {
                  res = await fetch(rssUrl, { next: { revalidate: 3600 } });
                }

          if (!res.ok) {
                  return NextResponse.json({ videoId: null }, { status: 200 });
                }

          const xml = await res.text();

          // Extract the first video ID from the RSS feed
          const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          const videoId = match ? match[1] : null;

          return NextResponse.json({ videoId });
        } catch {
          return NextResponse.json({ videoId: null }, { status: 200 });
        }
  }
