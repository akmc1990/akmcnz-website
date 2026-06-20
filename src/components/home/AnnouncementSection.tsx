import Link from 'next/link'

const newsItems = [
  {
    title: '2024 교회 주보',
    desc: '매주 주일 예배 순서 및 교회 공지사항을 확인하세요.',
    href: '/worship/news',
    date: '매주 업데이트',
  },
  {
    title: '교회 소식 및 공지',
    desc: '오클랜드감리교회의 최신 소식과 다가오는 행사 안내입니다.',
    href: '/worship/news',
    date: '정기 업데이트',
  },
  {
    title: '양육 프로그램',
    desc: '새가족 양육, 제자훈련, 소그룹 모임 등 다양한 양육 프로그램에 참여하세요.',
    href: '/worship/nurture',
    date: '상시',
  },
]

export default function AnnouncementSection() {
  return (
    <>
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="font-black uppercase text-blue-600 leading-none mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                최신 설교
              </h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                하나님의 말씀을 통해 소망과 진리, 그리고 이번 주 당신을 위한 격려를 경험하세요.
              </p>
              <Link
                href="/gallery"
                className="inline-block px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-sm border-2 border-black hover:bg-transparent hover:text-black transition-all duration-200"
              >
                설교 영상 더 보기
              </Link>
            </div>
            <div className="aspect-video w-full bg-gray-200 shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed?listType=user_uploads&list=AKMC_NZ&index=0"
                title="AKMC 최신 설교"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <h2
              className="font-black uppercase text-blue-600 leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              교회 소식
            </h2>
            <Link href="/worship/news" className="text-black font-bold uppercase text-sm tracking-wide hover:text-blue-600 transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <Link key={i} href={item.href} className="group block bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300 p-8">
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">{item.date}</p>
                <h3 className="font-black text-black text-xl mb-3 uppercase group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-black font-bold text-sm uppercase group-hover:text-blue-600 transition-colors">
                  <span>자세히 보기</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
