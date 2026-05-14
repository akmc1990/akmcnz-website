import VisionSection from '@/components/home/VisionSection'

export default function VisionPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="bg-church-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-church-teal/70 text-sm mb-3">
            <a href="/about" className="hover:text-church-teal">교회소개</a>
            <span>/</span>
            <span className="text-church-teal">교회 비전</span>
          </div>
          <h1 className="text-3xl font-bold">교회 비전</h1>
          <p className="text-church-teal mt-1">Church Vision</p>
          <div className="mt-4 bg-white/10 rounded-xl p-5">
            <p className="text-white/90 leading-relaxed">
              하나님의 말씀에 의해 양육되고 훈련받은 예수의 제자로서 섬김과 나눔을 통해 세상을 변화시키는 교회
            </p>
            <p className="text-church-teal/80 text-sm mt-2 italic">
              Worshippers who experience God's presence are nurtured and trained by His Word to transform the world as disciples through service and sharing.
            </p>
          </div>
        </div>
      </div>
      <VisionSection />
    </div>
  )
}
