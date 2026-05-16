import Link from 'next/link'
import { FiMapPin, FiPhone, FiMail, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-church-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-church-teal rounded-full flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-white" fill="none" stroke="currentColor">
                  <path d="M20 4 L20 36 M8 14 L32 14" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">AKMC</p>
                <p className="text-church-teal text-sm">오클랜드감리교회</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
                        뉴질랜드 오클랜드감리교회<br />
              Auckland Korean Methodist Church
            </p>
            <p className="text-church-gold text-sm font-medium mt-2">
              담임목사: 김지겸 Pastor Jikyum Kim
            </p>
            <p className="text-church-gold text-sm font-medium mt-1">
              교육목사: 유성재 Pastor Sungjae Yoo
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-church-gold">연락처 Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <FiMapPin className="w-4 h-4 mt-0.5 text-church-teal flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  427 Lake Road, Takapuna,<br />
                  Auckland 0622, New Zealand
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-church-teal flex-shrink-0" />
                <p className="text-gray-300 text-sm">+64-9-441-9114</p>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-church-teal flex-shrink-0" />
                <a href="mailto:admin@akmcnz.org" className="text-gray-300 text-sm hover:text-church-teal transition-colors">
                  admin@akmcnz.org
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-church-gold">바로가기 Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '교회 비전', href: '/about/vision' },
                { label: '온라인 예배', href: '/worship/online' },
                { label: '사진/영상', href: '/gallery' },
                { label: '선교', href: '/mission' },
                { label: '오시는 길', href: '/directions' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 text-sm hover:text-church-teal transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <a
                href="https://www.youtube.com/@akmcnz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <FiYoutube className="w-4 h-4" />
                <span>YouTube 채널</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Auckland Korean Methodist Church. All rights reserved.
          </p>
          <p className="text-church-teal text-sm mt-1 font-medium">
            "믿음이 보이는 교회" | A Church Where Faith Is Visible
          </p>
        </div>
      </div>
    </footer>
  )
}
