const historyData = [
  {
    year: '1990',
    entries: [
      { date: '04/18/1990', content: '뉴질랜드 최초 한인감리교회 창립\nEstablishment of the first Korean Methodist Church in New Zealand' },
    ]
  },
  {
    year: '1991',
    entries: [
      { date: '03/1991', content: '첫 번째 담임목사 부임\nFirst Senior Pastor appointed' },
    ]
  },
  {
    year: '2000',
    entries: [
      { date: '04/18/2000', content: '교회 창립 10주년 기념 예배\n10th Anniversary Worship Service' },
    ]
  },
  {
    year: '2010',
    entries: [
      { date: '04/18/2010', content: '교회 창립 20주년 기념 예배\n20th Anniversary Worship Service' },
    ]
  },
  {
    year: '2015',
    entries: [
      { date: '2015', content: '1차 피지단기선교\n1st Short-term Mission to Fiji' },
    ]
  },
  {
    year: '2017',
    entries: [
      { date: '12/03/2017', content: '이원용 전도사 (수련목) 이임\nDeparture of Pastor Lee Won-yong (Probationary)' },
      { date: '04/06/2017', content: '정혜영 전도사 (아동부, 학생부 파트타임 담당) 부임\nAppointment of Pastor Jung Hye-young (Children & Youth, Part-time)' },
      { date: '10/07/2017', content: '2차 피지단기선교(총 8명)\n2nd Short-term Mission to Fiji (Total 8 members)' },
    ]
  },
  {
    year: '2019',
    entries: [
      { date: '12/2019', content: '4차 피지단기선교\n4th Short-term Mission to Fiji' },
    ]
  },
  {
    year: '2020',
    entries: [
      { date: '04/18/2020', content: '교회 창립 30주년 기념 예배\n30th Anniversary Worship Service' },
    ]
  },
  {
    year: '2024',
    entries: [
      { date: '2024', content: '김지겸 목사 담임 부임\nAppointment of Pastor Jikyum Kim as Senior Pastor' },
    ]
  },
  {
    year: '2026',
    entries: [
      { date: '04/18/2026', content: '교회 창립 36주년 기념 예배\n36th Anniversary Worship Service' },
    ]
  },
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-2">교회 연혁</h1>
          <p className="text-gray-400">History</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-church-red text-white rounded-xl p-5 mb-8">
          <h2 className="text-lg font-bold">오클랜드감리교회 발자취</h2>
          <p className="text-white/80 text-sm">The Footsteps of Auckland Korean Methodist Church</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-24">연도 (Year)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-32">날짜 (Date)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">내용 (History)</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((period) =>
                period.entries.map((entry, idx) => (
                  <tr key={`${period.year}-${idx}`} className="border-b border-gray-100 hover:bg-gray-50">
                    {idx === 0 ? (
                      <td className="px-4 py-3 font-bold text-church-red align-top" rowSpan={period.entries.length}>
                        {period.year}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-sm text-gray-600 align-top whitespace-nowrap">{entry.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {entry.content.split('\n').map((line, i) => (
                        <p key={i} className={i === 1 ? 'text-gray-400 italic text-xs mt-0.5' : 'font-medium'}>{line}</p>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
