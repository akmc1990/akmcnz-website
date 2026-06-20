'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'

interface NavChild {
  href: string
  label: string
}

interface NavItem {
  href?: string
  label: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { label: '교회소개', children: [
    { href: '/about/vision', label: '교회 비전' },
    { href: '/about/history', label: '교회 연혁' },
    { href: '/about/service', label: '예배 안내' },
  ]},
  { label: '예배와 양육', children: [
    { href: '/worship/online', label: '실시간/온라인 예배' },
    { href: '/worship/nurture', label: '양육' },
    { href: '/worship/news', label: '교회소식/주보' },
  ]},
  { href: '/gallery', label: '사진/영상' },
  { href: '/mission', label: '선교' },
  { href: '/directions', label: '오시는 길' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [pathname])

  const navBg = isHome && !scrolled ? 'bg-transparent' : 'bg-black'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="border-2 border-white p-1">
              <div className="text-white font-black text-xs leading-tight text-center" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <div>AKMC</div>
                <div>교회</div>
              </div>
            </div>
          </Link>
          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className="flex items-center gap-1 text-white font-bold uppercase text-sm tracking-wide hover:text-blue-400 transition-colors"
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    >
                      {item.label} <FaChevronDown className="text-xs" />
                    </button>
                    <ul className="absolute top-full left-0 mt-1 bg-black min-w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block px-4 py-2 text-white text-sm hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href!} className="text-white font-bold uppercase text-sm tracking-wide hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col pt-20 px-6 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-gray-800">
              {item.children ? (
                <>
                  <button
                    className="w-full flex items-center justify-between py-4 text-white font-black uppercase text-lg"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    {item.label} <FaChevronDown className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === item.label && (
                    <ul className="pb-2 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block py-2 text-gray-300 hover:text-white">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={item.href!} className="block py-4 text-white font-black uppercase text-lg">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
