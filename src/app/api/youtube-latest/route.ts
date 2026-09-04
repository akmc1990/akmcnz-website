import { NextResponse } from 'next/server';

const YOUTUBE_HANDLE = 'akmcnz';
const FALLBACK_CHANNEL_ID = 'UCuXOmcLxWGadVq2v5OQ0bVQ';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Fetches the most recent live or completed live video ID from the AKMC YouTube channel
export async function GET() {
      try {
              // Step 1: Get Channel ID from RSS feed (using handle)
        const channelId = await getChannelId();

        if (API_KEY && channelId) {
                  // Step 2a: Try YouTube Data API - active live stream first
                const liveResult = await fetchFromYouTubeAPI(channelId, 'live', 60);
                  if (liveResult) {
                              return NextResponse.json({ videoId: liveResult, isLive: true });
                  }

                // Step 2b: Try YouTube Data API - most recent completed live stream
                const completedResult = await fetchFromYouTubeAPI(channelId, 'completed', 3600);
                  if (completedResult) {
                              return NextResponse.json({ videoId: completedResult, isLive: false });
                  }
        }

        // Step 3: Fallback - get latest video from RSS feed
        const rssResult = await fetchLatestFromRSS(channelId);
              return NextResponse.json({ videoId: rssResult, isLive: false });
      } catch {
              return NextResponse.json({ videoId: null }, { status: 200 });
      }
}

async function getChannelId(): Promise<string | null> {
      try {
              // Handles (@akmcnz) aren't resolvable via the legacy ?user= RSS endpoint,
        // so scrape the channel page for its underlying UC... channel ID instead.
        const res = await fetch(`https://www.youtube.com/@${YOUTUBE_HANDLE}`, { next: { revalidate: 86400 } });
              if (!res.ok) return FALLBACK_CHANNEL_ID;

        const html = await res.text();
              const match = html.match(/"channelId":"(UC[^"]+)"/) || html.match(/channel\/(UC[A-Za-z0-9_-]+)/);
              return match ? match[1] : FALLBACK_CHANNEL_ID;
      } catch {
              return FALLBACK_CHANNEL_ID;
      }
}

async function fetchFromYouTubeAPI(
      channelId: string,
      eventType: 'live' | 'completed',
      revalidate: number
    ): Promise<string | null> {
      try {
              const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=${eventType}&type=video&order=date&maxResults=1&key=${API_KEY}`;
              const res = await fetch(url, { next: { revalidate } });
              if (!res.ok) return null;

        const data = await res.json();
              if (data.items && data.items.length > 0) {
                        return data.items[0].id.videoId;
              }
              return null;
      } catch {
              return null;
      }
}

async function fetchLatestFromRSS(channelId: string | null): Promise<string | null> {
      try {
              const urls = [
                        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId ?? FALLBACK_CHANNEL_ID}`,
                      ];

        for (const url of urls) {
                  const res = await fetch(url, { next: { revalidate: 3600 } });
                  if (res.ok) {
                              const xml = await res.text();
                              const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
                              if (match) return match[1];
                  }
        }
              return null;
      } catch {
              return null;
      }
}
