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
  image: string;
}

const slides: Slide[] = [
  { titleKo: '뉴질랜드 오클랜드', titleKo2: '감리교회', subtitle: '뉴질랜드 오클랜드 감리교회에 오신 여러분을 환영합니다', slogan: '', sloganEn: '', image: '/sanctuary.jpg' },
  { titleKo: '2026년도 표어', titleKo2: '믿음이 보이는 교회', titleKoSize: 'clamp(1.5rem, 5vw, 3rem)', subtitle: 'A Church Where Faith Is Visible', slogan: '이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라 어떤 사람은 말하기를 너는 믿음이 있고 나는 행함이 있으니 행함이 없는 네 믿음을 내게 보이라 나는 행함으로 내 믿음을 네게 보이리라 하니라', sloganEn: '행 2:17-25', image: '/fellowship-hall.jpg' },
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
      <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <p className="text-white/70 text-xl mb-4" style={{fontFamily: 'cursive', fontStyle: 'italic'}}>Welcome to</p>
        <h1 className="heading-impact text-white mb-2" style={{fontSize: slide.titleKoSize ?? 'clamp(3rem, 10vw, 7rem)'}}>{slide.titleKo}</h1>
        <h1 className="heading-impact text-white mb-6" style={{fontSize: 'clamp(2.5rem, 8vw, 6rem)'}}>{slide.titleKo2}</h1>
        <p className="text-xl md:text-2xl text-white/80 mb-6 font-light">{slide.subtitle}</p>
        {slide.slogan && (
          <div className="mb-8 border-l-4 border-white pl-4 text-left inline-block">
            <p className="text-xl font-bold text-white">&ldquo;{slide.slogan}&rdquo;</p>
            <p className="text-white/70 mt-1 text-sm">{slide.sloganEn}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/about/service" className="px-8 py-4 text-base font-black tracking-widest text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-200">예배 안내 SERVICES</Link>
          <Link href="/worship/online" className="px-8 py-4 text-base font-black tracking-widest border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200">온라인 예배 ONLINE</Link>
          <a href="https://www.instagram.com/akmc_inchrist" target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-base font-black tracking-widest border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200">인스타그램 INSTAGRAM</a>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-3 rounded-full transition-all duration-300 ${i === current ? 'bg-blue-400 w-8' : 'bg-white/40 w-3'}`} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <FiChevronDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  )
}
