'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiChevronDown } from 'react-icons/fi'

interface Slide {
    titleKo: string;
    titleKo2: string;
    subtitle: string;
    slogan: string;
    sloganEn: string;
    bg: string;
}

const slides: Slide[] = [
  { titleKo: '뉴질랜드 오클랜드', titleKo2: '감리교회', subtitle: 'Auckland Korean Methodist Church', slogan: '믿음이 보이는 교회', sloganEn: 'A Church Where Faith Is Visible', bg: 'from-black via-gray-900 to-black' },
  { titleKo: '예배를 최우선으로', titleKo2: '삼는 교회', subtitle: 'A Church That Prioritizes Worship Above All', slogan: '', sloganEn: '', bg: 'from-black via-blue-950 to-black' },
  ]

export default function HeroSection() {
    const [current, setCurrent] = useState(0)
    useEffect(() => {
          const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000)
          return () => clearInterval(timer)
    }, [])
    const slide: Slide = slides[current] ?? slides[0]
    return (
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-1000`} />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <p className="text-white/70 text-xl mb-4" style={{fontFamily: 'cursive', fontStyle: 'italic'}}>Welcome to</p>p>
                        <h1 className="heading-impact text-white mb-2" style={{fontSize: 'clamp(3rem, 10vw, 7rem)'}}>{slide.titleKo}</h1>h1>
                        <h1 className="heading-impact text-blue-400 mb-6" style={{fontSize: 'clamp(2.5rem, 8vw, 6rem)'}}>{slide.titleKo2}</h1>h1>
                        <p className="text-xl md:text-2xl text-white/80 mb-6 font-light">{slide.subtitle}</p>p>
                  {slide.slogan && (
                      <div className="mb-8 border-l-4 border-blue-400 pl-4 text-left inline-block">
                                  <p className="text-xl font-bold text-blue-300">&ldquo;{slide.slogan}&rdquo;</p>p>
                                  <p className="text-white/70 mt-1 text-sm">{slide.sloganEn}</p>p>
                      </div>div>
                        )}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                                  <Link href="/about/service" className="btn-cic btn-cic-dark px-8 py-4 text-base font-black tracking-widest">예배 안내 SERVICES</Link>Link>
                                  <Link href="/worship/online" className="btn-cic px-8 py-4 text-base font-black tracking-widest" style={{borderColor: 'white', color: 'white'}}>온라인 예배 ONLINE</Link>Link>
                        </div>div>
                        <div className="flex justify-center gap-2 mb-8">
                          {slides.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} className={`h-3 rounded-full transition-all duration-300 ${i === current ? 'bg-blue-400 w-8' : 'bg-white/40 w-3'}`} />
                      ))}
                        </div>div>
                </div>div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <FiChevronDown className="w-8 h-8 text-white/60" />
                </div>div>
          </section>section>
        )
}</section>
