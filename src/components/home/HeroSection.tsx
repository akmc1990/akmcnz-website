'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiChevronDown } from 'react-icons/fi'

const slides = [
  { title: '뉴질랜드 오클랜드\n감리교회', subtitle: 'Auckland Korean Methodist Church', slogan: '믿음이 보이는 교회', sloganEn: 'A Church Where Faith Is Visible', bg: 'from-church-navy to-church-teal' },
  { title: '예배를 모든 사역의\n최우선으로 삼는 교회', subtitle: 'A Church That Prioritizes Worship Above All Ministries', slogan: '', sloganEn: '', bg: 'from-blue-900 to-church-teal' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])
  const slide = slides[current]
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-1000`} />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-church-gold text-sm font-medium tracking-widest uppercase mb-4">2026년 교회 표어</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 whitespace-pre-line">{slide.title}</h1>
        <p className="text-xl md:text-2xl text-white/80 mb-6">{slide.subtitle}</p>
        {slide.slogan && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 inline-block">
            <p className="text-2xl font-bold text-church-gold">"{slide.slogan}"</p>
            <p className="text-white/80 mt-1">"{slide.sloganEn}"</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/worship/online" className="bg-church-teal hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">온라인 예배 참여</Link>
          <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-church-navy px-8 py-3 rounded-full font-semibold transition-all">교회 소개</Link>
        </div>
      </div>
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`} />
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce z-10">
        <FiChevronDown className="w-6 h-6" />
      </div>
    </section>
  )
    }
