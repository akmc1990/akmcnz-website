'use client'

import { useState } from 'react'
import { FiSend, FiMapPin, FiPhone, FiMail, FiCheck } from 'react-icons/fi'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert('제출 중 오류가 발생했습니다. 이메일로 직접 연락해 주세요.')
      }
    } catch {
      alert('제출 중 오류가 발생했습니다. 이메일로 직접 연락해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-church-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-2">CONTACT</h1>
          <p className="text-church-teal">문의하기</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-church-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-church-teal" />
                </div>
                <div>
                  <p className="font-semibold text-church-navy mb-1">주소</p>
                  <p className="text-gray-600 text-sm">427 Lake Road, Takapuna,<br />Auckland 0622, NZ</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-church-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-5 h-5 text-church-teal" />
                </div>
                <div>
                  <p className="font-semibold text-church-navy mb-1">전화</p>
                  <a href="tel:+6494419114" className="text-gray-600 text-sm hover:text-church-teal">+64-9-441-9114</a>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-church-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-5 h-5 text-church-teal" />
                </div>
                <div>
                  <p className="font-semibold text-church-navy mb-1">이메일</p>
                  <a href="mailto:admin@akmcnz.org" className="text-gray-600 text-sm hover:text-church-teal">admin@akmcnz.org</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-church-navy mb-2">문의가 접수되었습니다!</h3>
                <p className="text-gray-600">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-church-navy mb-6">문의하기</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">성함 *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-teal"
                        placeholder="성함을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일 주소 *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-teal"
                        placeholder="이메일을 입력하세요"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-teal"
                        placeholder="주소 (선택)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-teal"
                        placeholder="전화번호 (선택)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">문의 사항 *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-teal resize-none"
                      placeholder="문의 내용을 입력해 주세요"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-church-teal hover:bg-teal-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    {submitting ? <div className="spinner w-5 h-5 border-2" /> : <FiSend className="w-4 h-4" />}
                    {submitting ? '제출 중...' : '제출하기 Submit'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
