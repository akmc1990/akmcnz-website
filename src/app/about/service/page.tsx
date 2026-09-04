const services = [
  {
    type: '주일예배 Sunday Service',
    items: [
      { label: '1부 (교사예배)', time: '오전 11:20', timeEn: '11:20 AM' },
      { label: '2부', time: '오후 01:00', timeEn: '01:00 PM' },
    ]
  },
  {
    type: '교회학교 (학생부, 아동부, 유아부)',
    items: [
      { label: '교회학교', time: '오후 01:00', timeEn: '01:00 PM' },
    ]
  },
]

const youthGroup = {
  type: '청년부 모임',
  items: [
    { label: '커피브레이크', time: '화요일 오후 7:00', timeEn: '' },
    { label: '쉐어링', time: '주일 점심 이후', timeEn: '청년 모임' },
  ]
}

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-church-navy text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-navy to-church-teal/40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-black">예배 안내</h1>
          <p className="text-black">Worship Service</p>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-100 bg-church-teal/5">
            <h2 className="font-bold text-church-navy">청년부 모임</h2>
          </div>
          <table className="w-full">
            <tbody>
              {youthGroup.items.map((item, idx) => (
                <tr key={`youth-${idx}`} className="border-b border-gray-100">
                  {idx === 0 ? (
                    <td className="px-6 py-4 font-semibold text-church-navy align-top w-40" rowSpan={youthGroup.items.length}>
                      <p>{youthGroup.type.split(' ')[0]}</p>
                      <p className="text-gray-400 text-xs font-normal">{youthGroup.type.split(' ').slice(1).join(' ')}</p>
                    </td>
                  ) : null}
                  <td className="px-6 py-4 font-semibold text-church-navy align-top w-40">
                    {item.label}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-church-teal font-semibold text-lg">{item.time}</span>
                    <p className="text-gray-400 text-sm">{item.timeEn}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
