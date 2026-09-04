


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
    <footer className="bg-[#3d5d96] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2
              className="font-black uppercase text-white leading-none"
              style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              함께 예배드려요
            </h2>
            <p className="text-white text-sm mt-1">오클랜드 감리교회에서 당신의 자리를 기다립니다.</p>
            <p className="text-white text-xs leading-relaxed mt-24">
              뉴질랜드 오클랜드감리교회<br />
              Auckland Korean Methodist Church
            </p>
            <hr className="border-t border-white/40 mt-3 mb-3 w-full" />
            <p className="text-white text-20 mt-2">담임목사: 김지겸 Pastor Jikyum Kim</p>
            <p className="text-white text-20 mt-1">교육목사: 유성재 Pastor Sungjae Yoo</p>
            <div className="flex gap-4 mt-3">
              <a href="https://youtube.com/@AKMCNZ" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white transition-colors">
                <FaYoutube size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white transition-colors">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="uppercase text-white text-10 tracking-widest mb-3">빠른 링크</h3>
            <ul className="space-y-1.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white text-sm hover:text-white hover:pl-1 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="uppercase text-white text-10 tracking-widest mb-3">연락처</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-white text-sm">427 Lake Road, Takapuna,<br />Auckland 0622, New Zealand</p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-500 flex-shrink-0" />
                <a href="tel:+64-9-441-9114" className="text-white text-sm hover:text-white transition-colors">+64-9-441-9114</a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 flex-shrink-0" />
                <a href="mailto:info@akmcnz.org" className="text-white text-sm hover:text-white transition-colors">info@akmcnz.org</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 py-3 px-4">
        <div className="max-w-7xl mx-auto text-center text-white text-xs">
          <p>&copy; {new Date().getFullYear()} Auckland Korean Methodist Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
