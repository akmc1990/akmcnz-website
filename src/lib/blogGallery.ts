const BLOG_URL = 'https://akmc1990.blogspot.com';

export interface BlogGalleryImage {
  thumb: string;
  full: string;
}

export interface BlogGalleryPost {
  title: string;
  date: string;
  postUrl: string;
  images: BlogGalleryImage[];
  videoIds: string[];
}

interface BloggerFeedEntry {
  title?: { $t?: string };
  published?: { $t?: string };
  content?: { $t?: string };
  link?: { rel?: string; href?: string }[];
}

// Fetches posts from the church's "사진/영상" Blogger blog and extracts the
// photos (hosted on blogger.googleusercontent.com) and YouTube videos embedded in each post.
export async function getBlogGalleryPosts(maxResults = 30): Promise<BlogGalleryPost[]> {
  try {
    const url = `${BLOG_URL}/feeds/posts/default?alt=json&max-results=${maxResults}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    const entries: BloggerFeedEntry[] = data.feed?.entry ?? [];

    return entries
      .map(parseEntry)
      .filter(post => post.images.length > 0 || post.videoIds.length > 0);
  } catch {
    return [];
  }
}

function parseEntry(entry: BloggerFeedEntry): BlogGalleryPost {
  const title = entry.title?.$t ?? '';
  const date = entry.published?.$t ?? '';
  const content = entry.content?.$t ?? '';
  const postUrl = entry.link?.find(l => l.rel === 'alternate')?.href ?? BLOG_URL;

  return {
    title,
    date,
    postUrl,
    images: extractImages(content),
    videoIds: extractVideoIds(content),
  };
}

function extractImages(content: string): BlogGalleryImage[] {
  const images: BlogGalleryImage[] = [];
  const seenThumbs = new Set<string>();

  // Blogger normally wraps each image in a link to the full-resolution version.
  const anchorImgRegex = /<a[^>]+href="(https:\/\/blogger\.googleusercontent\.com[^"]+)"[^>]*>\s*<img[^>]+src="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = anchorImgRegex.exec(content))) {
    images.push({ full: m[1], thumb: m[2] });
    seenThumbs.add(m[2]);
  }

  // Fallback for any <img> not wrapped in a full-res link.
  const imgRegex = /<img[^>]+src="([^"]+)"/g;
  while ((m = imgRegex.exec(content))) {
    if (!seenThumbs.has(m[1])) {
      images.push({ full: m[1], thumb: m[1] });
    }
  }

  return images;
}

function extractVideoIds(content: string): string[] {
  const ids = new Set<string>();

  const iframeRegex = /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/g;
  let m: RegExpExecArray | null;
  while ((m = iframeRegex.exec(content))) ids.add(m[1]);

  // Older posts embed a custom widget with a `vid="..."` attribute instead of an iframe.
  const vidAttrRegex = /\bvid="([a-zA-Z0-9_-]{6,})"/g;
  while ((m = vidAttrRegex.exec(content))) ids.add(m[1]);

  return Array.from(ids);
}
