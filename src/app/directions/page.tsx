import { FaMapMarkerAlt, FaBus, FaComment } from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';


export const metadata = {
  title: '오시는 길 | AKMC 오클랜드 감리교회',
  description: '오클랜드 감리교회 위치 및 교통편 안내',
};


const busRoutes = ['820', '822', '834', '837', '839', '858', '875', '879'];


const busStops = [
  { address: '14 Burns Avenue, Takapuna', direction: '시내 방향 (City)', link: 'https://www.google.com/maps/search/14+Burns+Avenue,+Takapuna' },
  { address: '21 Burns Avenue, Takapuna', direction: '시내 반대방향 (Away from City)', link: 'https://www.google.com/maps/search/21+Burns+Avenue,+Takapuna' },
];


export default function DirectionsPage() {
  return (
    <div className="min-h-screen bg-church-light">
      {/* Hero */}
      <div className="bg-church-navy py-16 text-center">
        <FaMapMarkerAlt className="text-church-gold text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">오시는 길</h1>
        <p className="text-church-gold text-lg">How to Find Us</p>
      </div>


      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Address Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-church-red px-6 py-4">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <FaMapMarkerAlt />
              교회 위치/주소
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-gray-700 text-lg font-medium">
              427 Lake Road, Takapuna, Auckland 0622, New Zealand
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <FaComment className="text-yellow-500 text-xl" />
              <span className="text-sm">씨티/노스쇼어 픽업 문의: 카카오톡 ID <strong>shepherd23</strong></span>
            </div>
          </div>
        </div>


        {/* Google Map */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-church-navy px-6 py-4">
            <h2 className="text-white font-bold text-xl">지도</h2>
          </div>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.2!2d174.7750!3d-36.7900!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4833b1e7a1b5%3A0x1234567890!2s427+Lake+Road%2C+Takapuna%2C+Auckland+0622%2C+New+Zealand!5e0!3m2!1sen!2snz!4v1000000000000"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Auckland Korean Methodist Church Location"
            />
          </div>
          <div className="p-4">
            <a
              href="https://www.google.com/maps/place/427+Lake+Road,+Takapuna,+Auckland+0622,+New+Zealand"
