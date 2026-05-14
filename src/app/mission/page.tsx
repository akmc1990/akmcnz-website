export default function MissionPage() {
  const missions = [
    { year: '2023', title: '4차 피지단기선교', desc: '4차 피지선교 보고영상 쌍기타 고니티의 (시어머니) 무릎 걱가, 미음고 바코아이 (남편) 수친 장애 친부, 비긴 끄따...', img: null },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-church-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">선교</h1>
          <p className="text-church-teal">Mission</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-church-navy text-lg mb-2">선교 사역</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            예수님의 지상명령에 순종하며 열정을 갖고 온 세계 모든 나라를 향하여 하나님의 구원을 전파하는 교회로,
            모든 성도가 영혼구원을 삶의 목표로 삼으며 대위임령에 순종하여 영혼구원에 동참하는 교회입니다.
          </p>
        </div>

        <div className="space-y-6">
          {missions.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-church-navy text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{m.title}</h3>
                  <span className="text-church-teal text-sm">{m.year}</span>
                </div>
              </div>
              <div className="p-5">
                {m.img ? (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                    <p className="text-sm">이미지 준비 중</p>
                  </div>
                )}
                <p className="text-gray-700 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
