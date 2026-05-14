import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

const sections = [
  { title: '교회 비전 Vision', href: '/about/vision', desc: '하나님의 말씀에 의해 양육되고 훈련받은 예수의 제자들' },
  { title: '교회 연혁 History', href: '/about/history', desc: '1990년부터 시작된 오클랜드 감리교회의 발자취' },
  { title: '예배 안내 Worship Service', href: '/about/service', desc: '주일예배 및 각종 예배 안내' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-church-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-48 h-48 bg-church-gold rounded-full" />
            </div>
            <h1 className="relative text-4xl font-bold mb-3">교회소개</h1>
            <p className="relative text-church-teal text-xl">Introducing AKMC</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-church-teal hover:shadow-md transition-all group">
              <h2 className="font-bold text-church-navy mb-2 group-hover:text-church-teal transition-colors">{s.title}</h2>
              <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
              <div className="flex items-center text-church-teal text-sm font-medium">
                바로가기 <FiChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Greeting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-church-navy mb-6">인사말 GREETINGS</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>오클랜드감리교회 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.</p>
            <p>우리 교회는 1990년 4월 18일 뉴질랜드 최초 한인감리교회로 설립된 이후로 오늘에 이르렀습니다. 지금까지 오직 주님만이 우리의 주인 되심을 고백하고, 섬기는 이들 모두가 삶 속에서 예수님을 드러내며 건강한 교회가 되도록 늘 기도하는 교회입니다.</p>
            <p>작은 모습이지만 한 손에는 복음을 들고, 또 다른 한 손에는 주님의 사랑을 들고 하나님의 구원의 은혜를 여러분과 나누길 소망합니다.</p>
            <p>이민생활하는 여러분과 함께 사랑하며, 축복하며, 서로의 부족한 모습을 채우는 공동체가 되길 기대합니다. 이 자리에 여러분을 초대합니다.</p>
            <p>이 복된 자리에 함께 하셔서 잃어버린 행복과 주님이 주시는 자유를 풍성히 누리시기를 소망합니다.</p>
            <p className="font-semibold text-church-navy mt-6">담임목사 김지겸</p>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-600 leading-relaxed">We sincerely welcome you to the Auckland Korean Methodist Church website.</p>
            <p className="text-gray-600 leading-relaxed mt-3">Our church was established on 18 April 1990, as the first Korean Methodist Church in New Zealand, and has continued to this day. We confess that only the Lord is our master, and we are a church that constantly prays that all who serve will reveal Jesus in their lives and become a healthy church.</p>
            <p className="text-gray-600 leading-relaxed mt-3">Though we may be small, we hope to share God's saving grace with you, holding the gospel in one hand and the Lord's love in the other.</p>
            <p className="font-semibold text-church-navy mt-6">Pastor Jikyum Kim</p>
          </div>
        </div>
      </div>
    </div>
  )
}
