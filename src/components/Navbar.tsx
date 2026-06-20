'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const navItems = [
  { href: '/', label: 'Home' },
  {
        label: '교회소개',
        children: [
          { href: '/about/vision', label: '교회 비전' },
          { href: '/about/history', label: '교회 연혁' },
          { href: '/about/service', label: '예배 안내' },
              ],
  },
  {
        label: '예배와 양육',
        children: [
          { href: '/worship/online', label: '실시간/온라인 예배' },
          { href: '/worship/nurture', label: '양육' },
          { href: '/worship/news', label: '교회소식/주보' },
              ],
  },
  { href: '/gallery', label: '사진/영상' },
  { href: '/mission', label: '선교' },
  { href: '/directions', label: '오시는 길' },
  { href: '/contact', label: 'Contact' },
  ];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const pathname = usePathname();

  return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                                <Link href="/" className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white flex items-center justify-center">
                                                          <svg viewBox="0 0 40 40" className="w-7 h-7 text-black" fill="none" stroke="currentColor">
                                                                          <path d="M20 4 L20 36 M8 14 L32 14" strokeWidth="4" strokeLinecap="round"/>
                                                          </svg>svg>
                                            </div>div>
                                            <div className="leading-tight">
                                                          <div className="font-black text-sm tracking-tight uppercase">AKMC</div>div>
                                                          <div className="text-xs text-gray-400">오클랜드감리교회</div>div>
                                            </div>div>
                                </Link>Link>
                      
                                <div className="hidden lg:flex items-center space-x-1">
                                  {navItems.map((item) =>
                        item.children ? (
                                          <div key={item.label} className="relative"
                                                              onMouseEnter={() => setOpenDropdown(item.label)}
                                                              onMouseLeave={() => setOpenDropdown(null)}
                                                            >
                                                            <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold uppercase tracking-wide hover:text-blue-400 transition-colors">
                                                              {item.label} <FaChevronDown className="w-3 h-3" />
                                                            </button>button>
                                            {openDropdown === item.label && (
                                                                                  <div className="absolute top-full left-0 bg-black border border-gray-700 min-w-[180px] shadow-xl">
                                                                                    {item.children.map((child) => (
                                                                                                            <Link key={child.href} href={child.href}
                                                                                                                                        className="block px-4 py-3 text-sm font-bold uppercase hover:bg-blue-600 border-b border-gray-800 last:border-0">
                                                                                                              {child.label}
                                                                                                              </Link>Link>
                                                                                                          ))}
                                                                                    </div>div>
                                                            )}
                                          </div>div>
                                        ) : (
                                          <Link key={item.href} href={item.href!}
                                                              className={`px-3 py-2 text-sm font-bold uppercase tracking-wide hover:text-blue-400 transition-colors ${pathname === item.href ? 'text-blue-400' : ''}`}>
                                            {item.label}
                                          </Link>Link>
                                        )
                      )}
                                </div>div>
                      
                                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:text-blue-400">
                                  {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                                </button>button>
                      </div>div>
              </div>div>
        
          {isOpen && (
                  <div className="lg:hidden bg-black border-t border-gray-800">
                    {navItems.map((item) =>
                                item.children ? (
                                                <div key={item.label}>
                                                                <button
                                                                                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                                                                                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold uppercase border-b border-gray-800 hover:bg-gray-900"
                                                                                  >
                                                                  {item.label} <FaChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                                                                </button>button>
                                                  {openDropdown === item.label && (
                                                                    <div className="bg-gray-900">
                                                                      {item.children.map((child) => (
                                                                                            <Link key={child.href} href={child.href}
                                                                                                                      className="block px-8 py-3 text-sm font-bold uppercase border-b border-gray-800 hover:bg-blue-600"
                                                                                                                      onClick={() => setIsOpen(false)}>
                                                                                              {child.label}
                                                                                              </Link>Link>
                                                                                          ))}
                                                                    </div>div>
                                                                )}
                                                </div>div>
                                              ) : (
                                                <Link key={item.href} href={item.href!}
                                                                  className={`block px-6 py-4 text-sm font-bold uppercase border-b border-gray-800 hover:bg-gray-900 hover:text-blue-400 ${pathname === item.href ? 'text-blue-400' : ''}`}
                                                                  onClick={() => setIsOpen(false)}>
                                                  {item.label}
                                                </Link>Link>
                                              )
                              )}
                  </div>div>
              )}
        </nav>nav>
      );
}</nav>
