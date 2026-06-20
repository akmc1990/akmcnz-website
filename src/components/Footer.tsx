import Link from 'next/link'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaYoutube, FaFacebook, FaInstagram } from 'react-icons/fa'

const footerLinks = [
  { label: '교회소개', href: '/about/vision' },
  { label: '예배 안내', href: '/about/service' },
  { label: '온라인 예배', href: '/worship/online' },
  { label: '양육', href: '/worship/nurture' },
  { label: '교회소식', href: '/worship/news' },
  { label: '사진/영상', href: '/gallery' },
  { label: '선교', href: '/mission' },
  { label: '오시는 길', href: '/directions' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="bg-blue-600 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2
              className="font-black uppercase text-white leading-none"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              함께 예배드려요
            </h2>
            <p className="text-blue-100 mt-1">오클랜드감리교회에서 당신의 자리가 기다립니다.</p>
          </div>
          <Link
            href="/directions"
            className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm border-2 border-white hover:bg-transparent hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            예배 시간 + 장소
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="inline-block border-2 border-white p-2 mb-6">
              <div className="text-white font-black text-sm leading-tight" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <div>AKMC</div>
                <div>교회</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              뉴질랜드 오클랜드감리교회<br />
              Auckland Korean Methodist Church
            </p>
            <p className="text-gray-500 text-xs">담임목사: 김지겨 Pastor Jikyum Kim</p>
            <p className="text-gray-500 text-xs mt-1">교육목사: 유성재 Pastor Sungjae Yoo</p>
            <div className="flex gap-4 mt-6">
              <a href="https://youtube.com/@AKMCNZ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-black uppercase text-white text-sm tracking-widest mb-6">빠른 링크</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white hover:pl-1 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-black uppercase text-white text-sm tracking-widest mb-6">연락처</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400 text-sm">427 Lake Road, Takapuna,<br />Auckland 0622, New Zealand</p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-500 flex-shrink-0" />
                <a href="tel:+64-9-441-9114" className="text-gray-400 text-sm hover:text-white transition-colors">+64-9-441-9114</a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 flex-shrink-0" />
                <a href="mailto:info@akmcnz.org" className="text-gray-400 text-sm hover:text-white transition-colors">info@akmcnz.org</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} Auckland Korean Methodist Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
