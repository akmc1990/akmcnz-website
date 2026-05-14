import Link from 'next/link';
import { FaChurch, FaUsers, FaCross, FaBookOpen, FaHandsHelping, FaHome } from 'react-icons/fa';

const visions = [
  {
    icon: FaChurch,
    titleKo: '예배를 최우선으로 삼는 교회',
    titleEn: 'A Church That Prioritizes Worship Above All Ministries',
    description: '하나님 앞에서 주님의 되심을 고백하는 모든 부서의 시작과 끝, 예배를 최우선으로 삼는 공동체',
  },
  {
    icon: FaUsers,
    titleKo: '다음 세대를 세우는 교회',
    titleEn: 'A Church That Builds Up The Next Generation',
    description: '이땅을 일굴 자세가 되어있는 미래의 크리스도의 지도자를 길러내는 교회',
  },
  {
    icon: FaCross,
    titleKo: '복음으로 영혼을 살리는 교회',
    titleEn: 'A Church That Saves Souls Through The Gospel',
    description: '예수님의 지상명령에 순종하여 세상의 모든 나라들을 하나님의 구원으로 이끄는 교회',
  },
  {
    icon: FaBookOpen,
    titleKo: '제자로 훈련하는 교회',
    titleEn: 'A Church That Trains Disciples',
    description: '말씀으로 훈련하고 소제자상을 길러 세워 세상을 주님의 말씀으로 섬기도록 훈련하는 교회',
  },
  {
    icon: FaHandsHelping,
    titleKo: '평신도가 사역하는 교회',
    titleEn: 'A Church Where The Laity Carries Out Ministry',
    description: '모든 성도들이 주님보다 더 큰 일을 감당하는 왕 같은 제사장으로서 하나님의 나라를 역동적으로 건설하는 교회',
  },
  {
    icon: FaHome,
    titleKo: '소그룹으로 움직이는 교회',
    titleEn: 'A Church That Moves Through Small Groups',
    description: '성도들이 열매 맺는 기도로서 서로 사랑하고, 나누고, 섬기는 하나의 영적 가족이 되는 교회',
  },
];

export default function VisionSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-church-navy mb-2">교회 비전</h2>
          <p className="text-church-gold font-semibold text-lg">Church Vision</p>
          <div className="w-16 h-1 bg-church-gold mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visions.map((vision, idx) => {
            const Icon = vision.icon;
            return (
              <div
                key={idx}
                className="group bg-church-light rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-church-gold/30"
              >
                <div className="w-12 h-12 bg-church-navy rounded-xl flex items-center justify-center mb-4 group-hover:bg-church-gold transition-colors">
                  <Icon className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-church-navy text-base mb-1">{vision.titleKo}</h3>
                <p className="text-church-gold text-xs font-semibold uppercase tracking-wide mb-3">{vision.titleEn}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{vision.description}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/about/vision"
            className="inline-block bg-church-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-900 transition-colors"
          >
            교회 비전 더 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
