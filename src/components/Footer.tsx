import Link from 'next/link'
import { FiMapPin, FiPhone, FiMail, FiYoutube } from 'react-icons/fi'

export default function Footer() {
    return (
          <footer className="bg-black text-white">
                <div className="border-b border-gray-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                              <div>
                                                            <div className="flex items-center space-x-3 mb-6">
                                                                            <div className="w-12 h-12 bg-white flex items-center justify-center">
                                                                                              <svg viewBox="0 0 40 40" className="w-8 h-8 text-black" fill="none" stroke="currentColor">
                                                                                                                  <path d="M20 4 L20 36 M8 14 L32 14" strokeWidth="3.5" strokeLinecap="round"/>
                                                                                                </svg>svg>
                                                                            </div>div>
                                                                            <div>
                                                                                              <p className="font-black text-xl uppercase tracking-tight">AKMC</p>p>
                                                                                              <p className="text-blue-400 text-sm font-bold">오클랜드감리교회</p>p>
                                                                            </div>div>
                                                            </div>div>
                                                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                                                            뉴질랜드 오클랜드감리교회<br />
                                                                            Auckland Korean Methodist Church
                                                            </p>p>
                                                            <p className="text-blue-400 text-sm font-bold">담임목사: 김지겸 Pastor Jikyum Kim</p>p>
                                                            <p className="text-blue-400 text-sm font-bold mt-1">교육목사: 유성재 Pastor Sungjae Yoo</p>p>
                                              </div>div>
                                              <div>
                                                            <h3 className="heading-impact text-white text-2xl mb-6">연락처 <span className="text-blue-400">CONTACT</span>span></h3>h3>
                                                            <div className="space-y-4">
                                                                            <div className="flex items-start space-x-3">
                                                                                              <FiMapPin className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
                                                                                              <p className="text-gray-400 text-sm">427 Lake Road, Takapuna,<br />Auckland 0622, New Zealand</p>p>
                                                                            </div>div>
                                                                            <div className="flex items-center space-x-3">
                                                                                              <FiPhone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                                                              <p className="text-gray-400 text-sm">+64-9-441-9114</p>p>
                                                                            </div>div>
                                                                            <div className="flex items-center space-x-3">
                                                                                              <FiMail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                                                              <a href="mailto:admin@akmcnz.org" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">admin@akmcnz.org</a>a>
                                                                            </div>div>
                                                            </div>div>
                                              </div>div>
                                              <div>
                                                            <h3 className="heading-impact text-white text-2xl mb-6">바로가기 <span className="text-blue-400">LINKS</span>span></h3>h3>
                                                            <div className="grid grid-cols-2 gap-2">
                                                              {[
            { label: '교회 비전', href: '/about/vision' },
            { label: '온라인 예배', href: '/worship/online' },
            { label: '사진/영상', href: '/gallery' },
            { label: '선교', href: '/mission' },
            { label: '오시는 길', href: '/directions' },
            { label: 'Contact', href: '/contact' },
                            ].map((link) => (
                                                <Link key={link.href} href={link.href}
                                                                      className="text-gray-400 text-sm font-bold uppercase hover:text-blue-400 transition-colors border-l-2 border-gray-800 hover:border-blue-400 pl-2 py-1">
                                                  {link.label}
                                                </Link>Link>
                                              ))}
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        </div>div>
                </div>div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                  <p className="text-gray-600 text-xs uppercase tracking-widest">
                                              &copy; {new Date().getFullYear()} Auckland Korean Methodist Church. All Rights Reserved.
                                  </p>p>
                                  <a href="https://www.youtube.com/@akmcnz" target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 hover:text-blue-400 transition-colors">
                                              <FiYoutube className="w-5 h-5" />
                                              <span className="text-xs font-bold uppercase">YouTube</span>span>
                                  </a>a>
                        </div>div>
                </div>div>
          </footer>footer>
        )
}</footer>
