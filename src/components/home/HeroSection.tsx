'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeroSection() {
      const [current, setCurrent] = useState(0)

  const slides = [
      {
                bg: 'https://images.unsplash.com/photo-1438232992991-995b671e4668?w=1600&q=80',
                titleKo: '오신 것을 환영합니다',
                subtitle: 'Auckland Korean Methodist Church',
                tagEn: 'Welcome to',
      },
      {
                bg: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1600&q=80',
                titleKo: '당신의 자리가 있습니다',
                subtitle: "There's a Place for You",
                tagEn: 'With Worship',
      },
        ]

  useEffect(() => {
          const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000)
          return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[current]

  return (
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {slides.map((s, i) => (
                      <div
                                    key={i}
                                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                                    style={{ backgroundImage: `url(${s.bg})`, opacity: i === current ? 1 : 0 }}
                                  />
                    ))}
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <p className="text-2xl md:text-3xl mb-3 text-white/90" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                            {slide.tagEn}
                        </p>p>
                        <h1
                                      className="font-black uppercase text-white leading-none mb-4"
                                      style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '-0.02em' }}
                                    >
                            {slide.titleKo}
                        </h1>h1>
                        <p className="text-xl md:text-2xl text-white/80 mb-10 font-light tracking-wide">
                            {slide.subtitle}
                        </p>p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                  <Link href="/directions" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm border-2 border-white hover:bg-transparent hover:text-white transition-all duration-200">
                                              예배 시간 + 장소
                                  </Link>Link>
                                  <Link href="/worship/online" className="px-8 py-4 bg-transparent text-white font-black uppercase tracking-widest text-sm border-2 border-white hover:bg-white hover:text-black transition-all duration-200">
                                              온라인 예배
                                  </Link>Link>
                        </div>div>
                </div>div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/50 w-2'}`} />
                      ))}
                </div>div>
          </section>section>
        )
}</section>
