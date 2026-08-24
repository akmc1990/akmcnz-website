import { FaMapMarkerAlt, FaBus } from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';

export const metadata = {
  title: '오시는 길 | AKMC 오클랜드감리교회',
  description: '오클랜드감리교회 위치 및 교통편 안내',
};

const busRoutes = ['814', '856', '941', '843', '814', '82', '94', '871', '83', '801'];

const busStops = [
  { address: '14 Burns Avenue, Takapuna', direction: '시내 방향 (City)', link: 'https://www.google.com/maps/search/14+Burns+Avenue,+Takapuna' },
  { address: '21 Burns Avenue, Takapuna', direction: '시내 반대방향 (Away from City)', link: 'https://www.google.com/maps/search/21+Burns+Avenue,+Takapuna' },
];

export default function DirectionsPage() {
  return (
    <div className="min-h-screen bg-church-light pt-20">
      <div className="bg-church-navy py-16 text-center">
        <h1 className="text-4xl font-bold text-black mb-2">오시는 길 (Location)</h1>
        <p className="text-[#3d5d96] pt-4">
          시티/노스쇼어 픽업 문의<br />
          kakaotalk ID: <span className="text-lg font-bold">shepherd23</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.2!2d174.7750!3d-36.7900!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4833b1e7a1b5%3A0x1234567890!2s427+Lake+Road%2C+Takapuna%2C+Auckland+0622%2C+New+Zealand!5e0!3m2!1sen!2snz!4v1000000000000"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Auckland Korean Methodist Church Location"
            />
            <a
              href="https://www.google.com/maps/place/427+Lake+Road,+Takapuna,+Auckland+0622,+New+Zealand"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              aria-label="구글 지도에서 427 Lake Road, Takapuna, Auckland 0622, New Zealand 열기"
            />
          </div>
          <div className="pt-4">
            <a
              href="https://www.google.com/maps/place/427+Lake+Road,+Takapuna,+Auckland+0622,+New+Zealand"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-church-red text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <FaMapMarkerAlt />
              구글 지도에서 열기
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-church-teal px-6 py-4">
            <h2 className="text-black font-bold text-xl flex items-center gap-2">
              <MdDirectionsBus />
              가까운 버스정류장
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-church-navy mb-2">운행버스</h3>
              <div className="flex flex-wrap gap-2">
                {busRoutes.map((route, idx) => (
                  <span key={idx} className={`bg-church-navy text-black ${idx === 0 ? 'pl-0 pr-2' : 'px-2'} py-1 rounded-full text-sm font-medium`}>
                    {route}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-church-navy mb-3">정류장 위치</h3>
              <div className="space-y-3">
                {busStops.map((stop, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaBus className="text-church-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{stop.address}</p>
                      <p className="text-sm text-gray-500">{stop.direction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
