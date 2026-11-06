import Image from 'next/image'
import { FaGlobeAsia } from 'react-icons/fa'
import PhotoSlider from '@/components/mission/PhotoSlider'

interface MissionItem {
  year: string;
  title: string;
  desc: string;
  img: string | null;
  groups?: string[][];
}

// 국외 사진 43장: 4장씩 11화면으로 묶은 뒤, 3~9번 화면은 4장씩 먼저 보여주고
// 나머지 사진(1·2·10·11번 화면의 사진)은 한 장씩 뒤에 보여준다.
const overseasPhotos = Array.from({ length: 43 }, (_, i) => `/mission/overseas-${String(i + 1).padStart(2, '0')}.jpg`)
const overseasQuads: string[][] = []
for (let i = 0; i < overseasPhotos.length; i += 4) overseasQuads.push(overseasPhotos.slice(i, i + 4))
const overseasGroups: string[][] = [
  ...overseasQuads.slice(2, 9),
  ...[...overseasQuads[0], ...overseasQuads[1], ...overseasQuads[9], ...overseasQuads[10]].map((p) => [p]),
]

// 국내 사진 13장: 4장씩 묶어서 콜라주로 보여줌 (마지막은 1장)
const domesticPhotos = Array.from({ length: 13 }, (_, i) => `/mission/domestic-${String(i + 1).padStart(2, '0')}.jpg`)
const domesticGroups: string[][] = []
for (let i = 0; i < domesticPhotos.length; i += 4) domesticGroups.push(domesticPhotos.slice(i, i + 4))

const domesticMissions: MissionItem[] = [
  { year: '', title: 'Rānui, Auckland (라누이 지역)', desc: '', img: null, groups: domesticGroups },
]

const overseasMissions: MissionItem[] = [
  {
    year: '2023',
    title: 'Fiji (피지 선교)',
    desc: '',
    img: null,
    groups: overseasGroups,
  },
]

// 사진 틀 모서리에 걸쳐 놓는 나뭇잎 가지 장식
function LeafSprig({ className, rot }: { className: string; rot: number }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={`absolute pointer-events-none ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
      aria-hidden
    >
      <path d="M8 52 Q 30 30 52 8" stroke="#4D826C" strokeWidth="2" fill="none" />
      <path d="M20 40 C 8 36, 8 24, 18 20 C 24 28, 24 34, 20 40 Z" fill="#A8D474" />
      <path d="M34 26 C 22 22, 22 10, 32 6 C 38 14, 38 20, 34 26 Z" fill="#A8D474" />
      <path d="M42 46 C 30 44, 30 32, 40 28 C 46 36, 46 42, 42 46 Z" fill="#4D826C" opacity="0.8" />
    </svg>
  )
}

function MissionList({ items }: { items: MissionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
        <p className="text-sm">등록된 선교 소식이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {items.map((m, i) => (
        <div key={i} className="bg-[#F5EFE0] rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#4D826C] text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{m.title}</h3>
              <span className="text-church-teal text-sm">{m.year}</span>
            </div>
          </div>
          <div className="p-5">
            {m.groups && m.groups.length > 0 ? (
              <div className="relative p-3 mb-4 rounded-xl border-4 border-[#A8D474] bg-white shadow-md">
                <LeafSprig className="-top-5 -left-5 w-14 h-14" rot={-20} />
                <LeafSprig className="-bottom-5 -right-5 w-14 h-14" rot={160} />
                <PhotoSlider groups={m.groups} alt={m.title} />
              </div>
            ) : m.img ? (
              <div className="relative aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <Image src={m.img} alt={m.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                <p className="text-sm">이미지 준비 중</p>
              </div>
            )}
            {m.desc && <p className="text-gray-700 text-sm leading-relaxed">{m.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-church-navy text-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaGlobeAsia className="text-black text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">선교와 섬김</h1>
          <p className="text-black">Mission & Service</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#F5EFE0] rounded-xl p-6 mb-10 shadow-sm border-4 border-[#4d826c]">
          <h2 className="font-bold text-church-navy text-3xl mb-4">선교 사역</h2>
          <p className="text-black text-base leading-relaxed">
            예수님의 지상명령에 순종하며 열정을 갖고 온 세계 모든 나라를 향하여 하나님의 구원을 전파하는 교회로,
            모든 성도가 영혼구원을 삶의 목표로 삼으며 대위임령에 순종하여 영혼구원에 동참하는 교회입니다.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="font-bold text-church-navy text-3xl mb-4">국내 선교</h2>
          <MissionList items={domesticMissions} />
        </div>

        <div>
          <h2 className="font-bold text-church-navy text-3xl mb-4">국외선교</h2>
          <MissionList items={overseasMissions} />
        </div>
      </div>
    </div>
  )
}
