import Link from 'next/link'
import { getLatestVideo } from '@/lib/youtube'
import YouTubeEmbed from '@/components/YouTubeEmbed'

const FALLBACK_SERMON_VIDEO_ID = 'Z87UiFjE-us'

export default async function AnnouncementSection() {
  const { videoId } = await getLatestVideo()
  const sermonVideoId = videoId ?? FALLBACK_SERMON_VIDEO_ID
  return (
    <>
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="font-black uppercase text-[#3d5d96] leading-none mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                최신 설교
              </h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                하나님의 말씀을 통해 소망과 진리, 그리고 이번 주 당신을 위한 격려를 경험하세요.
              </p>
              <Link
                href="/worship/online"
                className="inline-block bg-black text-white font-black uppercase tracking-widest px-8 py-4 text-sm hover:bg-blue-700 transition-colors"
              >
                설교 영상 더 보기
              </Link>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <YouTubeEmbed videoId={sermonVideoId} title="오클랜드감리교회 최신 설교" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="font-black uppercase text-[#3d5d96] leading-none mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            교회 소식
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            매주 주일 예배 순서와 교회의 다가오는 소식을 확인하세요.
          </p>
          <Link
            href="/worship/news"
            className="inline-block bg-black text-white font-black uppercase tracking-widest px-8 py-4 text-sm hover:bg-blue-700 transition-colors"
          >
            교회 소식 보러가기
          </Link>
        </div>
      </section>
    </>
  )
}
