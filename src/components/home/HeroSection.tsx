'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiChevronDown } from 'react-icons/fi'

interface Slide {
  titleKo: string;
  titleKo2: string;
  titleKoSize?: string;
  subtitle: string;
  slogan: string;
  sloganEn: string;
  bg: string;
}

const slides: Slide[] = [
  { titleKo: '뉴질랜드 오클랜드', titleKo2: '감리교회', subtitle: 'Auckland Korean Methodist Church', slogan: '믿음이 보이는 교회', sloganEn: 'A Church Where Faith Is Visible', bg: 'from-orange-400 via-orange-300 to-orange-400' },
  { titleKo: '2026년도 표어', titleKo2: '믿음이 보이는 교회', titleKoSize: 'clamp(1.5rem, 5vw, 3rem)', subtitle: 'A Church Where Faith Is Visible', slogan: '이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라 어떤 사람은 말하기를 너는 믿음이 있고 나는 행함이 있으니 행함이 없는 네 믿음을 내게 보이라 나는 행함으로 내 믿음을 네게 보이리라 하니라', sloganEn: '행 2:17-25', bg: 'from-orange-400 via-orange-300 to-orange-400' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 14000)
    return () => clearInterval(timer)
  }, [])
  const slide: Slide = slides[current] ?? slides[0]
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-1000`} />
      <div className="relative z-10 text-center text-black px-4 max-w-5xl mx-auto">
        <p className="text-gray-500 text-xl mb-4" style={{fontFamily: 'cursive', fontStyle: 'italic'}}>Welcome to</p>
        <h1 className="heading-impact text-black mb-2" style={{fontSize: slide.titleKoSize ?? 'clamp(3rem, 10vw, 7rem)'}}>{slide.titleKo}</h1>
        <h1 className="heading-impact text-blue-600 mb-6" style={{fontSize: 'clamp(2.5rem, 8vw, 6rem)'}}>{slide.titleKo2}</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-6 font-light">{slide.subtitle}</p>
        {slide.slogan && (
          <div className="mb-8 border-l-4 border-blue-600 pl-4 text-left inline-block">
            <p className="text-xl font-bold text-blue-700">&ldquo;{slide.slogan}&rdquo;</p>
            <p className="text-gray-500 mt-1 text-sm">{slide.sloganEn}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/about/service" className="px-8 py-4 text-base font-black tracking-widest bg-black text-white border-2 border-black hover:bg-transparent hover:text-black transition-all duration-200">예배 안내 SERVICES</Link>
          <Link href="/worship/online" className="px-8 py-4 text-base font-black tracking-widest border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200">온라인 예배 ONLINE</Link>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-3 rounded-full transition-all duration-300 ${i === current ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3'}`} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <FiChevronDown className="w-8 h-8 text-gray-400" />
      </div>
    </section>
  )
}
