'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaChurch } from 'react-icons/fa';

interface CardImage { url: string; public_id: string; }
interface CardNewsEntry { date: string; images: CardImage[]; }

export default function AnnouncementSection() {
  const [latestEntry, setLatestEntry] = useState<CardNewsEntry | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/api/cardnews');
        if (res.ok) {
          const data = await res.json();
          if (data.cardnews && data.cardnews.length > 0) {
            setLatestEntry(data.cardnews[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch cardnews:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const images = latestEntry?.images || [];
  const handlePrev = () => setCurrentIdx(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIdx(i => Math.min(images.length - 1, i + 1));

  const services = [
    {
      name: '주일예배',
      nameEn: 'Sunday Service',
      times: [
        { time: '오전 11:20', desc: '1부 교사예배 (소예배실)' },
        { time: '오후 1:00', desc: '2부 본예배 (대예배실)' },
      ],
    },
    {
      name: '교회학교',
      nameEn: 'Church School',
      times: [
        { time: '오후 1:00', desc: '소예배실' },
      ],
    },
  ];

  return (
    <section className="py-16 bg-church-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Worship Schedule */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-church-navy px-6 py-4 flex items-center gap-3">
              <FaChurch className="text-church-gold text-xl" />
              <div>
                <h2 className="text-white font-bold text-lg">예배 안내</h2>
                <p className="text-church-gold text-sm">Worship Service</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {services.map((service, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:border-church-gold transition-colors">
                  <div className="mb-2">
                    <span className="font-bold text-church-navy text-base">{service.name}</span>
                    <span className="text-gray-400 text-sm ml-2">{service.nameEn}</span>
                  </div>
                  {service.times.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                      <FaClock className="text-church-teal flex-shrink-0" />
                      <span className="text-church-red font-semibold">{t.time}</span>
                      <span className="text-gray-500">{t.desc}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/about/service" className="text-church-teal hover:text-church-navy text-sm font-medium flex items-center gap-1 transition-colors">
                  <FaCalendarAlt />
                  <span>전체 예배 일정 보기 →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Latest Card News */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-church-gold px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">최신 주보</h2>
                <p className="text-amber-100 text-sm">{latestEntry ? latestEntry.date : 'Latest Bulletin'}</p>
              </div>
              <Link href="/worship/news" className="text-white text-sm underline underline-offset-2 hover:text-amber-100">
                전체보기 →
              </Link>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64 text-gray-400">불러오는 중...</div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
                  <p>등록된 주보가 없습니다.</p>
                  <Link href="/worship/news" className="text-church-gold hover:underline text-sm">주보 보기 →</Link>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {/* Image */}
                  <div className="relative w-full">
                    <Image
                      src={images[currentIdx].url}
                      alt={'주보 ' + (currentIdx + 1)}
                      width={500}
                      height={650}
                      className="w-full rounded-xl object-contain"
                      style={{ maxHeight: 380 }}
                      unoptimized
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
                      style={{ borderColor: '#B8711A', color: '#B8711A' }}
                    >&#8249;</button>
                    <span className="text-gray-500 text-sm">{currentIdx + 1} / {images.length}</span>
                    <button
                      onClick={handleNext}
                      disabled={currentIdx === images.length - 1}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
                      style={{ borderColor: '#B8711A', color: '#B8711A' }}
                    >&#8250;</button>
                  </div>

                  <Link href="/worship/news" className="text-church-gold hover:underline text-sm font-medium">
                    전체 주보 보기 →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
