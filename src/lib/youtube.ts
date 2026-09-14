const FALLBACK_CHANNEL_ID = 'UCuXOmcLxWGadVq2v5OQ0bVQ';
const API_KEY = process.env.YOUTUBE_API_KEY;

export interface LatestVideoResult {
  videoId: string | null;
  isLive: boolean;
}

// Fetches the most recent live or completed live video ID from the AKMC YouTube channel,
// falling back to the latest upload of any kind.
export async function getLatestVideo(): Promise<LatestVideoResult> {
  try {
    const channelId = FALLBACK_CHANNEL_ID;

    if (API_KEY) {
      // Check for an active live stream and the latest completed live stream in parallel
      // instead of one after another, to cut round-trip latency in half.
      const [liveResult, completedResult] = await Promise.all([
        fetchFromYouTubeAPI(channelId, 'live', 60),
        fetchFromYouTubeAPI(channelId, 'completed', 3600),
      ]);
      if (liveResult) return { videoId: liveResult, isLive: true };
      if (completedResult) return { videoId: completedResult, isLive: false };
    }

    const rssResult = await fetchLatestFromRSS(channelId);
    return { videoId: rssResult, isLive: false };
  } catch {
    return { videoId: null, isLive: false };
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
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId ?? FALLBACK_CHANNEL_ID}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.ok) {
      const xml = await res.text();
      const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

export interface RecentVideo {
  videoId: string;
  title: string;
}

// Fetches up to `count` recent uploads from the channel's RSS feed (no API key needed).
export async function getRecentVideos(count: number): Promise<RecentVideo[]> {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${FALLBACK_CHANNEL_ID}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    return entries.slice(0, count).map(entry => {
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '';
      const title = entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1]
        ?? entry.match(/<title>([^<]+)<\/title>/)?.[1]
        ?? '';
      return { videoId, title };
    }).filter(v => v.videoId);
  } catch {
    return [];
  }
}
