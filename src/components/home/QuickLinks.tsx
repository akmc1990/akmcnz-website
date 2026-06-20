import Link from 'next/link';
import { IconType } from 'react-icons';
import { FaChurch, FaBullhorn, FaImages, FaCross, FaMapMarkerAlt, FaEnvelope, FaYoutube } from 'react-icons/fa';

interface QuickLink {
    href: string;
    icon: IconType;
    label: string;
    labelEn: string;
}

const links: QuickLink[] = [
  { href: '/about/service', icon: FaChurch, label: '예배 안내', labelEn: 'Services' },
  { href: '/worship/news', icon: FaBullhorn, label: '주보', labelEn: 'Bulletin' },
  { href: '/gallery', icon: FaImages, label: '사진/영상', labelEn: 'Gallery' },
  { href: '/worship/online', icon: FaYoutube, label: '온라인 예배', labelEn: 'Online' },
  { href: '/mission', icon: FaCross, label: '선교', labelEn: 'Mission' },
  { href: '/directions', icon: FaMapMarkerAlt, label: '오시는 길', labelEn: 'Directions' },
  { href: '/contact', icon: FaEnvelope, label: 'Contact', labelEn: 'Contact Us' },
  ];

export default function QuickLinks() {
    return (
          <section className="py-16 bg-black">
                <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-10">
                                  <h2 className="heading-impact text-white text-4xl md:text-5xl">
                                              바로가기 <span className="text-blue-400">QUICK LINKS</span>span>
                                  </h2>h2>
                        </div>div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                          {links.map((link) => {
                        const Icon: IconType = link.icon;
                        return (
                                        <Link key={link.href} href={link.href}
                                                          className="group flex flex-col items-center justify-center p-6 border-2 border-gray-800 hover:border-blue-500 hover:bg-blue-600 transition-all">
                                                        <Icon className="w-8 h-8 text-blue-400 group-hover:text-white mb-3" />
                                                        <span className="font-black text-white text-xs uppercase tracking-wide text-center">{link.label}</span>span>
                                                        <span className="text-gray-500 group-hover:text-white text-xs mt-1">{link.labelEn}</span>span>
                                        </Link>Link>
                                      );
          })}
                        </div>div>
                </div>div>
          </section>section>
        );
}</section>
