import { FaBook, FaPray, FaBible, FaUsers } from 'react-icons/fa';

export const metadata = {
  title: '양육 | AKMC 오클랜드감리교회',
  description: '오클랜드감리교회 양육 및 훈련 프로그램 안내',
};

const programs = [
  {
    category: '제자훈련 과정',
    categoryEn: 'Discipleship Training',
    icon: FaUsers,
    color: 'church-navy',
    items: [
      {
        name: '확신반',
        duration: '4주 코스',
        description: '하나님의 자녀로서 자기 정체성을 확립하고 구원의 확신을 가져 신앙의 기반을 다지는 교인 필수과정',
      },
      {
        name: '성장반',
        duration: '16주 코스',
        description: '평신도 지도자를 양성하여 하나님 나라를 확장하고 그리스도의 몸된 교회를 섬기는 것을 목표로 하며 제자반을 준비하는 과정',
      },
      {
        name: '제자반',
        duration: '1년 코스',
        description: '예수님을 닮고 예수님처럼 살기 위해 애쓰는 과정을 제자훈련이라고 합니다. 제자훈련을 통해 주님의 모든 백성들이 주님의 손과 발이 되어 세상을 치유하며 부흥의 역사가 일어날 것을 기대한다.',
      },
    ],
  },
  {
    category: '사역훈련 과정',
    categoryEn: 'Ministry Training',
    icon: FaPray,
    color: 'church-red',
    items: [
      {
        name: '전도폭발훈련',
        duration: '6개월~1년',
        description: '전도폭발훈련은 먼저 나 자신이 복음으로 무장하여 다른 사람의 영혼을 건지는 하나님의 능력 있는 군사로 키워내는 사역자 훈련이다. 나 자신만이 복음을 전하는 자 되는 것에 그치지 않고 나와 함께 복음을 효과적으로 전할 수 있는 또 한 사람의 전도자를 무장시킨다.',
      },
      {
        name: '증보기도학교',
        duration: '6개월',
        description: '기도의 정병으로 무장되어야 할 군사들을 길러내는 사역자 훈련소이다. 나라와 민족과 교회를 위해, 아파하는 이웃들을 위해 증보도 할 수 있도록 훈련하고, 응답의 기쁨을 함께 나눈다.',
      },
    ],
  },
  {
    category: '성경공부 과정',
    categoryEn: 'Bible Study',
    icon: FaBible,
    color: 'church-teal',
    items: [
      {
        name: '구약의 파노라마',
        duration: '6회 코스',
        description: '참석자들은 혼란스러웠던 사건의 역사적 전개순서와 그 이유, 주요 인물들의 의미와 장소, 사건 등을 연대순으로 정리하면서 하나님께서 보내신 사람들을 통해서 계획하시는 구원의 역사를 배우게 된다.',
      },
      {
        name: '신약의 파노라마',
        duration: '6회 코스',
        description: '신약성경 전체의 내용을 한눈에 볼 수 있고 신약성경의 중요한 내용과 인물, 사건, 장소를 모션과 시청각을 통해서 누구나 쉽게 즐기며 배울 수 있다.',
      },
      {
        name: '리더십개발',
        duration: '1년 코스',
        description: '리더십의 모델이신 예수님의 모습을 성경을 통하여 보고 배우며 예수님처럼 주변에 영향력을 끼치는 삶을 배우는 과정',
      },
      {
        name: 'Coffee Break',
        duration: '소그룹',
        description: '소그룹으로 성경을 함께 읽고 배우며 서로가 받은 은혜를 나누는 과정',
      },
    ],
  },
];

export default function NurturePage() {
  return (
    <div className="min-h-screen bg-church-light">
      {/* Hero */}
      <div className="bg-church-navy py-16 text-center">
        <FaBook className="text-church-gold text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">양육</h1>
        <p className="text-church-gold text-lg">Nurture &amp; Training</p>
        <p className="text-white/70 mt-3 text-sm max-w-xl mx-auto px-4">
          양육과 훈련 과정 안내
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {programs.map((program, idx) => {
          const Icon = program.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className={`bg-${program.color} px-6 py-5 flex items-center gap-3`}>
                <Icon className="text-white text-2xl" />
                <div>
                  <h2 className="text-white font-bold text-xl">◆ {program.category}</h2>
                  <p className="text-white/70 text-sm">{program.categoryEn}</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {program.items.map((item, i) => (
                  <div key={i} className="border-l-4 border-church-gold pl-5 py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-church-navy text-base">● {item.name}</h3>
                      <span className="text-xs bg-church-cream text-church-navy px-2 py-0.5 rounded-full border border-church-gold/30">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Contact for more info */}
        <div className="bg-church-cream rounded-2xl p-6 text-center border border-church-gold/30">
          <FaBook className="text-church-gold text-3xl mx-auto mb-3" />
          <h3 className="font-bold text-church-navy text-lg mb-2">프로그램 참여 문의</h3>
          <p className="text-gray-600 text-sm mb-4">양육 및 훈련 프로그램에 대한 자세한 정보는 교회에 문의해 주세요.</p>
          <a
            href="mailto:admin@akmcnz.org"
            className="inline-block bg-church-navy text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
