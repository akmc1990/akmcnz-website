import Link from 'next/link';
import { FaChurch, FaYoutube, FaImages, FaMapMarkerAlt, FaBullhorn, FaCross, FaEnvelope } from 'react-icons/fa';

const links = [
  {
    href: '/worship/online',
    icon: FaYoutube,
    label: '온라인 예배',
    labelEn: 'Online Worship',
    color: 'bg-red-600 hover:bg-red-700',
  },
  {
    href: '/worship/news',
    icon: FaBullhorn,
    label: '주보',
    labelEn: 'Bulletin',
    color: 'bg-church-navy hover:bg-blue-900',
  },
  {
    href: '/gallery',
    icon: FaImages,
    label: '사진/영상',
    labelEn: 'Gallery',
    color: 'bg-church-teal hover:bg-teal-700',
  },
  {
    href: '/about/service',
    icon: FaChurch,
    label: '예배 안내',
    labelEn: 'Services',
    color: 'bg-church-gold hover:bg-yellow-600',
  },
  {
    href: '/mission',
    icon: FaCross,
    label: '선교',
    labelEn: 'Mission',
    color: 'bg-purple-700 hover:bg-purple-800',
  },
  {
    href: '/directions',
    icon: FaMapMarkerAlt,
    label: '오시는 길',
    labelEn: 'Directions',
    color: 'bg-church-red hover:bg-red-700',
  },
  {
    href: '/contact',
    icon: FaEnvelope,
    label: 'Contact',
    labelEn: 'Contact Us',
    color: 'bg-gray-700 hover:bg-gray-800',
  },
];

export default function QuickLinks() {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.color} text-white rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md min-h-[80px]`}
              >
                <Icon className="text-2xl" />
                <span className="text-xs font-bold text-center leading-tight">{link.label}</span>
                <span className="text-xs opacity-75 text-center leading-tight hidden sm:block">{link.labelEn}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
