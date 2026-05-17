import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // List all image resources under akmcnz-cardnews/
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'akmcnz-cardnews/',
      max_results: 500,
    });

    // List raw (PDF) resources
    let rawResources: { public_id: string; secure_url: string }[] = [];
    try {
      const rawResult = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix: 'akmcnz-cardnews/',
        max_results: 100,
      });
      rawResources = rawResult.resources || [];
    } catch {
      // ignore if no raw resources
    }

    // Build a map of date -> pdfUrl
    const pdfMap = new Map<string, string>();
    for (const r of rawResources) {
      const parts = r.public_id.split('/');
      if (parts.length >= 2) {
        const date = parts[1];
        pdfMap.set(date, r.secure_url);
      }
    }

    // Group images by date folder
    // Two modes:
    // 1. Direct image uploads: public_id = akmcnz-cardnews/YYYY-MM-DD/001
    // 2. PDF uploads: public_id = akmcnz-cardnews/YYYY-MM-DD/000_source (pages: N)
    const dateMap = new Map<string, {
      date: string;
      images: { url: string; public_id: string }[];
      sourcePublicId?: string;
      sourceResource?: { public_id: string; pages?: number };
    }>();

    for (const r of result.resources) {
      const parts = r.public_id.split('/');
      if (parts.length < 3) continue;
      const date = parts[1];
      const filename = parts[2];

      if (!dateMap.has(date)) {
        dateMap.set(date, { date, images: [] });
      }
      const entry = dateMap.get(date)!;

      if (filename && filename.startsWith('000_source')) {
        // This is a PDF-sourced image - store the source resource
        entry.sourcePublicId = r.public_id;
        entry.sourceResource = r;
      } else {
        // Regular uploaded image
        entry.images.push({ url: r.secure_url, public_id: r.public_id });
      }
    }

    // For PDF-sourced entries, get accurate page count via api.resource()
    // api.resources() doesn't always return pages field, but api.resource() does
    const sourceEntries = Array.from(dateMap.values()).filter(e => e.sourcePublicId);
    for (const entry of sourceEntries) {
      try {
        const resourceDetail = await cloudinary.api.resource(entry.sourcePublicId!, {
          resource_type: 'image',
        });
        if (entry.sourceResource) {
          entry.sourceResource.pages = resourceDetail.pages ?? 1;
        }
      } catch (e) {
        console.error('Failed to get resource detail for', entry.sourcePublicId, e);
      }
    }

    // Build final cardnews list
    const cardnews = Array.from(dateMap.values())
      .map(entry => {
        let images = entry.images;

        // If PDF source exists, generate page URLs from Cloudinary on-the-fly transformation
        if (entry.sourcePublicId && entry.sourceResource) {
          const pageCount = entry.sourceResource.pages ?? 1;
          const pageImages: { url: string; public_id: string }[] = [];
          for (let i = 1; i <= pageCount; i++) {
            const paddedPage = String(i).padStart(3, '0');
            // Cloudinary on-the-fly page transformation URL
            const pageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/pg_${i}/${entry.sourcePublicId}.jpg`;
            pageImages.push({
              url: pageUrl,
              public_id: entry.sourcePublicId + '_p' + paddedPage,
            });
          }
          images = pageImages;
        } else {
          // Sort regular images by public_id ascending
          images = images.sort((a, b) => a.public_id.localeCompare(b.public_id));
        }

        return {
          date: entry.date,
          images,
          pdfUrl: pdfMap.get(entry.date) || null,
        };
      })
      .filter(entry => entry.images.length > 0) // only show entries with images
      .sort((a, b) => b.date.localeCompare(a.date)); // newest date first

    return NextResponse.json({ cardnews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch card news' }, { status: 500 });
  }
}
