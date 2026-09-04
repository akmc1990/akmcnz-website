const visions = [
  {
    titleKo: '예배를 최우선으로 삼는 교회',
    titleEn: 'A Church That Prioritizes Worship Above All',
    description: '하나님 앞에서 주님의 되심을 고백하는 모든 부서의 시작과 끝, 예배를 최우선으로 삼는 공동체',
  },
  {
    titleKo: '다음 세대를 세우는 교회',
    titleEn: 'A Church That Builds Up The Next Generation',
    description: '이땅을 일곱 자세가 되어있는 미래의 크리스도의 지도자를 길러내는 교회',
  },
  {
    titleKo: '복음으로 영혼을 살리는 교회',
    titleEn: 'A Church That Saves Souls Through The Gospel',
    description: '예수님의 지상명령에 순종하여 세상의 모든 나라들을 하나님의 구원으로 이끄는 교회',
  },
  {
    titleKo: '제자로 훈련하는 교회',
    titleEn: 'A Church That Trains Disciples',
    description: '말씀으로 훈련하고 소제자들을 길러 세워 세상을 주님의 말씀으로 성기도록 훈련하는 교회',
  },
  {
    titleKo: '평신도가 사역하는 교회',
    titleEn: 'A Church Where The Laity Carries Out Ministry',
    description: '모든 성도들이 주님보다 더 큰 일을 감당하는 왕 같은 제사장으로서 하나님의 나라를 역동적으로 건설하는 교회',
  },
  {
    titleKo: '소그룹으로 움직이는 교회',
    titleEn: 'A Church That Moves Through Small Groups',
    description: '소그룹 안에서 서로 돌아보며 세워가는 공동체 사역의 교회',
  },
]

export default function VisionSection() {
  return (
    <section className="py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h2
            className="font-black uppercase text-blue-600 leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            교회 비전
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            하나님의 말씀에 의해 양육되고 훈련받은 예수의 제자로서 섯김과 나눔을 통해 세상을 변화시키는 교회
          </p>
          <p className="text-gray-400 text-base mt-1 italic">
            Worshippers who experience God&apos;s presence are nurtured and trained by His Word to transform the world as disciples through service and sharing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-gray-200">
          {visions.map((v, i) => (
            <div key={i} className="border-r border-b border-gray-200 p-8 hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-1 bg-blue-600 mb-4 group-hover:w-16 transition-all duration-300" />
              <h3 className="font-black text-black text-lg mb-2 uppercase leading-tight" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                {v.titleKo}
              </h3>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wide mb-3">{v.titleEn}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
