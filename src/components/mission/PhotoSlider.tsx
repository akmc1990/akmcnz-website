'use client'

import { useEffect, useState, useCallback, CSSProperties } from 'react'
import Image from 'next/image'

interface PhotoSliderProps {
  // 화면 하나에 들어갈 사진 묶음들. 4장 = 흩어진 콜라주, 1장 = 한 장짜리 인화 카드
  groups: string[][];
  alt: string;
  interval?: number;
}

// 4장 콜라주에서 각 사진의 위치와 기울기
const QUAD_POSITIONS: { left: string; top: string; rot: number }[] = [
  { left: '4%', top: '8%', rot: -4 },
  { left: '52%', top: '5%', rot: 3 },
  { left: '6%', top: '54%', rot: 3 },
  { left: '51%', top: '52%', rot: -3 },
]

function Leaf({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 80" className="absolute w-6 h-12 pointer-events-none" style={style} aria-hidden>
      <path d="M20 2 C 40 22, 40 58, 20 78 C 0 58, 0 22, 20 2 Z" fill="#A8D474" opacity="0.55" />
      <path d="M20 8 L20 74" stroke="#4D826C" strokeWidth="1.5" opacity="0.6" />
    </svg>
  )
}

function Tape({ rot }: { rot: number }) {
  return (
    <div
      className="absolute -top-2 left-1/2 w-14 h-4 bg-white/70 shadow-sm pointer-events-none"
      style={{ transform: `translateX(-50%) rotate(${rot}deg)` }}
    />
  )
}

function PolaroidCard({
  src,
  alt,
  style,
  rot,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  style: CSSProperties;
  rot: number;
  priority: boolean;
  sizes: string;
}) {
  return (
    <div
      className="absolute bg-white p-2 pb-6 shadow-lg"
      style={{ ...style, transform: `rotate(${rot}deg)` }}
    >
      <Tape rot={rot * -2} />
      <div className="relative w-full h-full bg-gray-100 overflow-hidden">
        <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? 'eager' : 'lazy'} className="object-cover" />
      </div>
    </div>
  )
}

export default function PhotoSlider({ groups, alt, interval = 4000 }: PhotoSliderProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // 화면마다 사진 번호를 이어서 붙임 (alt 텍스트용)
  let counter = 0
  const slides = groups.map((group) =>
    group.map((src) => {
      counter += 1
      return { src, num: counter }
    })
  )
  const count = slides.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [paused, count, interval, next])

  if (count === 0) return null

  return (
    <div
      className="relative w-full aspect-[4/3] bg-[#fbf8f1] rounded-lg overflow-hidden mb-4 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <Leaf style={{ left: '2%', bottom: '4%', transform: 'rotate(-30deg)' }} />
      <Leaf style={{ right: '3%', top: '4%', transform: 'rotate(35deg)' }} />

      {slides.map((group, s) => {
        return (
          <div
            key={s}
            className={`absolute inset-0 transition-opacity duration-700 ${s === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={s !== index}
          >
            {group.map((p, j) => {
              if (group.length === 1) {
                return (
                  <PolaroidCard
                    key={p.src}
                    src={p.src}
                    alt={`${alt} ${p.num}`}
                    rot={-2}
                    priority={s === 0}
                    sizes="(max-width: 768px) 80vw, 560px"
                    style={{ left: '16%', top: '10%', width: '68%', height: '80%' }}
                  />
                )
              }
              const pos = QUAD_POSITIONS[j] ?? QUAD_POSITIONS[0]
              return (
                <PolaroidCard
                  key={p.src}
                  src={p.src}
                  alt={`${alt} ${p.num}`}
                  rot={pos.rot}
                  priority={s === 0}
                  sizes="(max-width: 768px) 45vw, 300px"
                  style={{ left: pos.left, top: pos.top, width: '44%', height: '44%' }}
                />
              )
            })}
          </div>
        )
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="이전 사진"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#A8D474] text-black hover:bg-[#8fc05a] flex items-center justify-center z-10"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음 사진"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#A8D474] text-black hover:bg-[#8fc05a] flex items-center justify-center z-10"
          >
            ›
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 화면 보기`}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-[#4D826C]' : 'bg-[#4D826C]/35'}`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs z-10">
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>
  )
}
