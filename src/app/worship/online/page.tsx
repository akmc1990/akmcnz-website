'use client'

import { useEffect, useState } from 'react'
import { FiYoutube, FiBell, FiExternalLink } from 'react-icons/fi'

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@akmcnz'

export default function OnlineWorshipPage() {
    const [latestVideoId, setLatestVideoId] = useState<string | null>(null)

  useEffect(() => {
        fetch('/api/youtube-latest')
          .then(res => res.json())
          .then(data => {
                    if (data.videoId) setLatestVideoId(data.videoId)
          })
          .catch(() => {})
  }, [])

  return (
        <div className="min-h-screen bg-gray-50 pt-20">
          {/* Header */}
              <div className="bg-church-navy text-white py-12">
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">실시간 / 온라인 예배</h1>h1>
                                <p className="text-church-teal text-lg">Live & Online Worship</p>p>
                                <p className="text-white/70 mt-2 text-sm">
                                            모든 사역의 시작과 끝, 예배를 최우선으로 삼는 공동체<br />
                                            Worship First: The foundation and crown of every ministry.
                                </p>p>
                      </div>div>
              </div>div>
        
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* YouTube Subscribe Banner */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                                                                          <FiYoutube className="w-7 h-7 text-white" />
                                                          </div>div>
                                                          <div>
                                                                          <h2 className="font-bold text-church-navy text-lg">오클랜드감리교회 YouTube 채널</h2>h2>
                                                                          <p className="text-gray-500 text-sm">구독하고 실시간 예배 알림을 받으세요!</p>p>
                                                          </div>div>
                                            </div>div>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                          <a
                                                                            href={YOUTUBE_CHANNEL_URL}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
                                                                          >
                                                                          <FiYoutube className="w-5 h-5" />
                                                                          구독하기
                                                          </a>a>
                                                          <a
                                                                            href={`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center justify-center gap-2 border-2 border-church-teal text-church-teal hover:bg-church-teal hover:text-white px-5 py-2.5 rounded-lg font-semibold transition-all"
                                                                          >
                                                                          <FiBell className="w-5 h-5" />
                                                                          알림 설정
                                                          </a>a>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                {/* YouTube Embed - Latest Video */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                            <h2 className="font-bold text-church-navy">최근 예배 영상</h2>h2>
                                            <a
                                                            href={YOUTUBE_CHANNEL_URL}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-church-teal text-sm hover:underline"
                                                          >
                                                          더보기 <FiExternalLink className="w-3 h-3" />
                                            </a>a>
                                </div>div>
                                <div className="aspect-video">
                                  {latestVideoId ? (
                        <iframe
                                          src={`https://www.youtube.com/embed/${latestVideoId}`}
                                          title="오클랜드감리교회 최근 예배 영상"
                                          className="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-3">
                                        <FiYoutube className="w-12 h-12 text-red-500" />
                                        <p className="text-gray-500 text-sm">영상을 불러오는 중입니다...</p>p>
                                        <a
                                                            href={YOUTUBE_CHANNEL_URL}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                          >
                                                          <FiYoutube className="w-4 h-4" />
                                                          YouTube 채널에서 보기
                                        </a>a>
                        </div>div>
                                            )}
                                </div>div>
                      </div>div>
              
                {/* Direct Channel Link */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                                <h2 className="font-bold text-church-navy mb-4 text-lg">YouTube 채널 바로가기</h2>h2>
                                <a
                                              href={YOUTUBE_CHANNEL_URL}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-3 bg-church-navy hover:bg-church-teal text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                                            >
                                            <FiYoutube className="w-6 h-6" />
                                            오클랜드감리교회 유튜브 채널 바로가기
                                            <FiExternalLink className="w-4 h-4" />
                                </a>a>
                      </div>div>
              
                {/* Online Banking Info */}
                      <div className="bg-church-cream rounded-xl border border-church-gold/30 p-6">
                                <h3 className="font-bold text-church-navy mb-3">인터넷 뱅킹 헌금 코드 안내</h3>h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                  {[
          { code: '1', label: '십일조' },
          { code: '2', label: '주일헌금' },
          { code: '3', label: '감사헌금' },
          { code: '4', label: '선교헌금' },
          { code: '5', label: '도네이션' },
          { code: '6', label: '속회헌금' },
          { code: '7', label: '절기헌금' },
                      ].map(item => (
                                      <div key={item.code} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-100">
                                                      <span className="w-7 h-7 bg-church-teal text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                        {item.code}
                                                      </span>span>
                                                      <span className="text-sm font-medium text-gray-700">{item.label}</span>span>
                                      </div>div>
                                    ))}
                                </div>div>
                                <div className="bg-white rounded-lg p-4 border border-gray-100 text-sm text-gray-600">
                                            <p className="font-semibold text-church-navy mb-1">인터넷 뱅킹 레퍼런스 입력 방법</p>p>
                                            <p>헌금코드 + 영문이름 형식으로 입력해 주세요.</p>p>
                                            <p className="mt-1 text-church-teal font-medium">예: 주일헌금 홍길동 → <span className="font-bold">2Hgildong</span>span></p>p>
                                </div>div>
                      </div>div>
              </div>div>
        </div>div>
      )
}</div>
