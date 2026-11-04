'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import type { BlogBulletin } from '@/lib/blogBulletin';

interface CardNewsEntry { date: string; url: string; public_id: string; }

interface UnifiedBulletin {
  date: string;
  source: 'cloudinary' | 'blog';
}

export default function AllBulletinsPage() {
  const [list, setList] = useState<UnifiedBulletin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cardnewsRes, blogRes] = await Promise.all([
          fetch('/api/cardnews'),
          fetch('/api/blog-bulletin'),
        ]);
        const cardnewsEntries: CardNewsEntry[] = cardnewsRes.ok ? (await cardnewsRes.json()).cardnews || [] : [];
        const blogEntries: BlogBulletin[] = blogRes.ok ? (await blogRes.json()).bulletins || [] : [];

        const byDate = new Map<string, UnifiedBulletin>();
        for (const b of blogEntries) byDate.set(b.date, { date: b.date, source: 'blog' });
        for (const c of cardnewsEntries) byDate.set(c.date, { date: c.date, source: 'cloudinary' });

        setList(Array.from(byDate.values()).sort((a, b) => b.date.localeCompare(a.date)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-[7.5rem] pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/worship/news" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-church-navy mb-6">
          <FiArrowLeft /> 주보로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-church-navy mb-6">전체 주보 목록</h1>

        {loading ? (
          <p className="text-center text-gray-400 py-20">로딩 중...</p>
        ) : list.length === 0 ? (
          <p className="text-center text-gray-400 py-20">등록된 주보가 없습니다.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow p-4 space-y-2">
            {list.map(entry => (
              <Link
                key={entry.date}
                href={`/worship/news?date=${entry.date}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>
                  {entry.date}
                  {entry.source === 'blog' && (
                    <span className="ml-1.5 text-[10px] text-gray-400 align-middle font-normal">주보</span>
                  )}
                </span>
                <span className="text-[#3d5d96]">보기 →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
