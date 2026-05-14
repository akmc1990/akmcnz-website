const services = [
  {
    type: '주일예배 Sunday Service',
    items: [
      { label: '1부 (교사예배)', time: '오전 11:20 (소예배실)', timeEn: '11:20 AM (Small Chapel)' },
      { label: '2부', time: '오후 01:00 (대예배실)', timeEn: '01:00 PM (Main Sanctuary)' },
    ]
  },
  {
    type: '교회학교 Church School',
    items: [
      { label: '교회학교', time: '오후 01:00 (소예배실)', timeEn: '01:00 PM (Small Chapel)' },
    ]
  },
]

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-church-navy text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-navy to-church-teal/40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-2">예배 안내</h1>
          <p className="text-church-teal">Worship Service</p>
          <div className="mt-4 bg-white/10 rounded-xl p-4 max-w-xl mx-auto">
            <p className="font-semibold">모든 사역의 시작과 끝, 예배를 최우선으로 삼는 공동체</p>
            <p className="text-white/70 text-sm mt-1 italic">Worship First: The foundation and crown of every ministry.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-church-teal/5">
            <h2 className="font-bold text-church-navy">예배 안내 | Worship Service</h2>
          </div>
          <table className="w-full">
            <tbody>
              {services.map((service) =>
                service.items.map((item, idx) => (
                  <tr key={`${service.type}-${idx}`} className="border-b border-gray-100">
                    {idx === 0 ? (
                      <td className="px-6 py-4 font-semibold text-church-navy align-top w-40" rowSpan={service.items.length}>
                        <p>{service.type.split(' ')[0]}</p>
                        <p className="text-gray-400 text-xs font-normal">{service.type.split(' ').slice(1).join(' ')}</p>
                      </td>
                    ) : null}
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-church-teal font-semibold text-lg">{item.time}</span>
                        {item.label !== service.type.split(' ')[0] && (
                          <span className="text-gray-400 text-sm ml-2">({item.label})</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{item.timeEn}</p>
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
