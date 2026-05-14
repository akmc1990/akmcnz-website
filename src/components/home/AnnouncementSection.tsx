'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaChurch, FaBullhorn } from 'react-icons/fa';

interface Bulletin {
  public_id: string;
  secure_url: string;
  format: string;
  created_at: string;
  context?: {
    custom?: {
      title?: string;
    };
  };
}

export default function AnnouncementSection() {
  const [latestBulletin, setLatestBulletin] = useState<Bulletin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestBulletin() {
      try {
        const res = await fetch('/api/bulletins?limit=1');
        if (res.ok) {
          const data = await res.json();
          if (data.bulletins && data.bulletins.length > 0) {
            setLatestBulletin(data.bulletins[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch bulletin:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestBulletin();
  }, []);

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
                <Link
                  href="/about/service"
                  className="text-church-teal hover:text-church-navy text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <FaCalendarAlt />
                  <span>전체 예배 일정 보기 →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Latest Bulletin */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-church-red px-6 py-4 flex items-center gap-3">
              <FaBullhorn className="text-white text-xl" />
              <div>
                <h2 className="text-white font-bold text-lg">최신 주보</h2>
                <p className="text-red-200 text-sm">Latest Bulletin</p>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="spinner" />
                </div>
              ) : latestBulletin ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaCalendarAlt className="text-church-red" />
                    {formatDate(latestBulletin.created_at)}
                  </p>
                  {latestBulletin.format === 'pdf' ? (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="text-5xl mb-3">📄</div>
                      <p className="text-church-navy font-semibold mb-3">
                        {latestBulletin.context?.custom?.title || '주보'}
                      </p>
                      <a
                        href={latestBulletin.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-church-red text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        PDF 보기
                      </a>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={latestBulletin.secure_url}
                        alt="최신 주보"
                        className="w-full object-contain max-h-64"
                      />
                    </div>
                  )}
                  <Link
                    href="/worship/news"
                    className="block text-center text-church-red hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    모든 주보 보기 →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
                  <FaBullhorn className="text-4xl opacity-30" />
                  <p className="text-sm">아직 업로드된 주보가 없습니다.</p>
                  <Link
                    href="/worship/news"
                    className="text-church-red hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    주보 페이지 바로가기 →
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
