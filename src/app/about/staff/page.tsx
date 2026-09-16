import Image from 'next/image'

const staff = [
  {
    nameKo: '김지겸',
    nameEn: 'Pastor Jikyum Kim',
    role: '담임목사',
    roleEn: 'Senior Pastor',
    image: '/staff/senior-pastor.png',
  },
  {
    nameKo: '유성재',
    nameEn: 'Pastor Sungjae You',
    role: '교육목사',
    roleEn: 'Christian Education Pastor',
  },
]

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-church-navy text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-navy to-church-teal/40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-black">교역자 소개</h1>
          <p className="text-black">Pastoral Staff</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((s) => (
            <div key={s.role} className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden text-center">
              <div className="relative aspect-square bg-sky-100">
                {s.image && (
                  <Image src={s.image} alt={s.nameKo} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                )}
              </div>
              <div className="p-5">
                <p className="text-church-teal font-semibold text-sm mb-1">{s.role}</p>
                <h2 className="font-bold text-church-navy text-lg">{s.nameKo}</h2>
                <p className="text-gray-400 text-sm">{s.nameEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
