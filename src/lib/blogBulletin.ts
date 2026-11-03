const BULLETIN_BLOG_URL = 'https://akmcnz-notice.blogspot.com';

export interface BlogBulletin {
  title: string;
  date: string;
  postUrl: string;
  pdfUrl: string;
  pdfLabel: string;
}

interface BloggerFeedEntry {
  title?: { $t?: string };
  published?: { $t?: string };
  content?: { $t?: string };
  link?: { rel?: string; href?: string }[];
}

// Fetches posts from the church's "교회소식/주보" Blogger blog and pulls out
// the bulletin PDF link (hosted on OneDrive) that each post contains.
export async function getBlogBulletins(maxResults = 20): Promise<BlogBulletin[]> {
  try {
    const url = `${BULLETIN_BLOG_URL}/feeds/posts/default?alt=json&max-results=${maxResults}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];

    const data = await res.json();
    const entries: BloggerFeedEntry[] = data.feed?.entry ?? [];

    return entries
      .map(parseEntry)
      .filter((b): b is BlogBulletin => b !== null)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

function parseEntry(entry: BloggerFeedEntry): BlogBulletin | null {
  const content = entry.content?.$t ?? '';
  const match = content.match(/<a href="([^"]+)"[^>]*>([^<]*)<\/a>/);
  if (!match) return null;

  const title = entry.title?.$t?.trim() ?? '';
  // Blogger's published timestamp is already in the blog's local timezone, so the
  // calendar-date portion before "T" is the bulletin date intended by its title.
  const date = (entry.published?.$t ?? '').split('T')[0];
  const postUrl = entry.link?.find(l => l.rel === 'alternate')?.href ?? BULLETIN_BLOG_URL;

  return {
    title,
    date,
    postUrl,
    pdfUrl: match[1],
    pdfLabel: match[2].trim(),
  };
}
