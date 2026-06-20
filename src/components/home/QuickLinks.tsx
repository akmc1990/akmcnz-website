import Link from 'next/link'
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa'

const locations = [
  {
    name: '오클랜드감리교회',
    nameEn: 'Auckland Korean Methodist Church',
    address: '오클랜드, 뉴질랜드',
    times: '주일 오전 11:00',
    img: 'https://images.unsplash.com/photo-1438232992991-995b671e4668?w=600&q=80',
    href: '/directions',
  },
  {
    name: '온라인 예배',
    nameEn: 'Online Service',
    address: 'YouTube & Streaming',
    times: '주일 오전 11:00',
    img: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
    href: '/worship/online',
  },
  {
    name: '소그룹 모임',
    nameEn: 'Small Group Meetings',
    address: '다양한 장소',
    times: '주중 일정 문의',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    href: '/worship/nurture',
  },
]

export default function QuickLinks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2
              className="font-black uppercase text-blue-600 leading-none mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              예배 안내
            </h2>
            <p className="text-gray-600 text-base">
              주일마다 당신의 자리가 있습니다. 오클랜드감리교회에서 함께 예배드려요.
            </p>
          </div>
          <Link href="/directions" className="hidden sm:block text-black font-bold uppercase text-sm tracking-wide hover:text-blue-600 transition-colors">
            오시는 길 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, i) => (
            <Link key={i} href={loc.href} className="group block bg-gray-50 hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-600">
              <div className="h-52 overflow-hidden">
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3
                  className="font-black text-black uppercase text-xl mb-1 group-hover:text-blue-600 transition-colors"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  {loc.name}
                </h3>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">{loc.nameEn}</p>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
                  <span>{loc.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <FaClock className="text-blue-600 flex-shrink-0" />
                  <span className="font-bold uppercase text-xs tracking-wide">{loc.times}</span>
                </div>
                <div className="flex items-center gap-2 text-black font-bold text-sm uppercase group-hover:text-blue-600 transition-colors">
                  <span>자세히 보기</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
