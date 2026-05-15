'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

type NavChild = { href: string; label: string };
type NavItem =
  | { href: string; label: string; children?: undefined }
  | { href?: undefined; label: string; children: NavChild[] };

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    label: '교회소개 Introduction',
    children: [
      { href: '/about/vision', label: '교회 비전 Vision' },
      { href: '/about/history', label: '교회 연혁 History' },
      { href: '/about/service', label: '예배 안내 Services' },
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
  { href: '/gallery', label: '사진 / 영상' },
  { href: '/mission', label: '선교' },
  { href: '/directions', label: '오시는 길' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-church-navy rounded-full flex items-center justify-center text-white font-bold text-sm">
              AKMC
            </div>
            <div className="hidden sm:block">
              <div className="text-church-navy font-bold text-sm leading-tight">오클랜드 감리교회</div>
              <div className="text-gray-500 text-xs leading-tight">Auckland Korean Methodist Church</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="relative group">
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-church-navy transition-colors rounded-lg hover:bg-gray-50"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <FaChevronDown className="text-xs group-hover:rotate-180 transition-transform" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-church-light hover:text-church-navy transition-colors first:rounded-t-xl last:rounded-b-xl ${pathname === child.href ? 'text-church-navy font-semibold bg-church-light' : ''}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    pathname === item.href
                      ? 'text-church-navy bg-church-light font-semibold'
                      : 'text-gray-700 hover:text-church-navy hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-church-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label}>
                    <button
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-church-navy"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <FaChevronDown className={`text-xs transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-2 text-sm rounded-lg ${pathname === child.href ? 'text-church-navy font-semibold bg-church-light' : 'text-gray-600 hover:text-church-navy'}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2.5 text-sm rounded-lg ${pathname === item.href ? 'text-church-navy font-semibold bg-church-light' : 'text-gray-700 hover:text-church-navy'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
