import Link from 'next/link';
import { IconType } from 'react-icons';
import { FaChurch, FaUsers, FaCross, FaBookOpen, FaHandsHelping, FaHome } from 'react-icons/fa';

interface Vision {
    icon: IconType;
    titleKo: string;
    titleEn: string;
    description: string;
}

const visions: Vision[] = [
  { icon: FaChurch, titleKo: '예배를 최우선으로 삼는 교회', titleEn: 'A Church That Prioritizes Worship Above All', description: '하나님 앞에서 주님의 되심을 고백하는 모든 부서의 시작과 끝, 예배를 최우선으로 삼는 공동체' },
  { icon: FaUsers, titleKo: '다음 세대를 세우는 교회', titleEn: 'A Church That Builds Up The Next Generation', description: '이땅을 일굴 자세가 되어있는 미래의 크리스도의 지도자를 길러내는 교회' },
  { icon: FaCross, titleKo: '복음으로 영혼을 살리는 교회', titleEn: 'A Church That Saves Souls Through The Gospel', description: '예수님의 지상명령에 순종하여 세상의 모든 나라들을 하나님의 구원으로 이끄는 교회' },
  { icon: FaBookOpen, titleKo: '제자로 훈련하는 교회', titleEn: 'A Church That Trains Disciples', description: '말씀으로 훈련하고 소제자상을 길러 세워 세상을 주님의 말씀으로 섬기도록 훈련하는 교회' },
  { icon: FaHandsHelping, titleKo: '평신도가 사역하는 교회', titleEn: 'A Church Where The Laity Carries Out Ministry', description: '모든 성도들이 주님보다 더 큰 일을 감당하는 왕 같은 제사장으로서 하나님의 나라를 역동적으로 건설하는 교회' },
  { icon: FaHome, titleKo: '소그룹으로 움직이는 교회', titleEn: 'A Church That Moves Through Small Groups', description: '소그룹 안에서 서로 돌아보며 세워가는 공동체 사역의 교회' },
  ];

export default function VisionSection() {
    return (
          <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-16">
                                  <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Our Purpose</p>p>
                                  <h2 className="section-heading text-4xl md:text-5xl mb-4">교회 비전</h2>h2>
                                  <p className="text-gray-500 text-lg font-light">Church Vision</p>p>
                                  <div className="w-20 h-1 bg-blue-600 mx-auto mt-4" />
                        </div>div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {visions.map((vision, index) => {
                        const Icon: IconType = vision.icon;
                        return (
                                        <div key={index} className="group border-2 border-gray-100 hover:border-blue-600 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                                        <div className="flex items-center gap-3 mb-4">
                                                                          <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                                                                                              <Icon className="w-6 h-6 text-white" />
                                                                          </div>div>
                                                                          <span className="heading-impact text-gray-200 leading-none" style={{fontSize: '3.5rem'}}>
                                                                            {(index + 1).toString().padStart(2, '0')}
                                                                          </span>span>
                                                        </div>div>
                                                        <h3 className="font-black text-black text-lg mb-1 uppercase tracking-tight leading-tight">{vision.titleKo}</h3>h3>
                                                        <p className="text-blue-600 text-xs font-bold uppercase tracking-wide mb-3">{vision.titleEn}</p>p>
                                                        <p className="text-gray-600 text-sm leading-relaxed">{vision.description}</p>p>
                                        </div>div>
                                      );
          })}
                        </div>div>
                        <div className="text-center mt-12">
                                  <Link href="/about/vision" className="btn-cic btn-cic-dark px-10 py-4 text-sm font-black tracking-widest inline-block">
                                              비전 더 보기 LEARN MORE
                                  </Link>Link>
                        </div>div>
                </div>div>
          </section>section>
        );
}</section>
