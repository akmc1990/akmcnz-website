'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

interface CardImage { url: string; public_id: string; }
interface CardNewsEntry { date: string; images: CardImage[]; }

export default function NewsPage() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user;

  const [list, setList] = useState<CardNewsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadDate, setUploadDate] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cardnews');
      if (res.ok) {
        const d = await res.json();
        const entries: CardNewsEntry[] = d.cardnews || [];
        setList(entries);
        if (entries.length > 0) { setSelectedDate(entries[0].date); setCurrentIdx(0); }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const selectedEntry = list.find(e => e.date === selectedDate) || null;
  const images = selectedEntry?.images || [];

  const handlePrev = () => setCurrentIdx(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIdx(i => Math.min(images.length - 1, i + 1));
  const handleSelectDate = (date: string) => { setSelectedDate(date); setCurrentIdx(0); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFiles(Array.from(e.target.files || []));
    setUploadError('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!uploadDate) { setUploadError('날짜를 입력해주세요.'); return; }
    if (uploadFiles.length === 0) { setUploadError('이미지 파일을 선택해주세요.'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('date', uploadDate);
      uploadFiles.forEach(f => formData.append('files', f));

      const res = await fetch('/api/upload-cardnews', { method: 'POST', body: formData });
      if (res.ok) {
        setShowUpload(false);
        setUploadDate('');
        setUploadFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchList();
      } else {
        let errMsg = '업로드 실패';
        try { const errData = await res.json(); errMsg = errData.error || errMsg; } catch { /* ignore */ }
        setUploadError('오류: ' + errMsg);
      }
    } catch (err) {
      setUploadError('네트워크 오류: ' + String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (date: string) => {
    if (!confirm(`${date} 주보를 삭제하시겠습니까?`)) return;
    setDeleting(date);
    try {
      const res = await fetch('/api/delete-cardnews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (res.ok) { await fetchList(); }
    } finally { setDeleting(null); }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-church-navy">교회소식 / 주보</h1>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <button onClick={() => setShowUpload(true)}
                  className="bg-church-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                  + 주보 업로드
                </button>
                <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700">로그아웃</button>
              </>
            ) : (
              <button onClick={() => signIn('google')} className="text-sm text-gray-500 hover:text-gray-700">관리자 로그인</button>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-lg font-semibold mb-4">주보 업로드</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                  <input type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지 파일 (여러 장 선택 가능)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange}
                    className="w-full text-sm" required />
                  {uploadFiles.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{uploadFiles.length}개 파일 선택됨</p>
                  )}
                </div>
                {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={uploading}
                    className="flex-1 bg-church-navy text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                    {uploading ? '업로드 중...' : '업로드'}
                  </button>
                  <button type="button" onClick={() => { setShowUpload(false); setUploadError(''); }}
                    className="flex-1 border py-2 rounded-lg text-sm">취소</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main content */}
        {list.length === 0 ? (
          <p className="text-center text-gray-400 py-20">등록된 주보가 없습니다.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Slideshow */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-church-gold mb-4">{selectedDate}</h2>
              {images.length > 0 ? (
                <>
                  {/* Main image */}
                  <div className="relative bg-white rounded-2xl shadow overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <Image src={images[currentIdx]?.url} alt={`슬라이드 ${currentIdx + 1}`}
                      fill className="object-contain" sizes="600px" />
                  </div>
                  {/* Navigation */}
                  {images.length > 1 && (
                    <>
                      <div className="flex items-center justify-center gap-4 mt-4 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition">
                        <button onClick={handlePrev} disabled={currentIdx === 0}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-30">
                          ‹
                        </button>
                        <span className="text-sm text-gray-500">{currentIdx + 1} / {images.length}</span>
                        <button onClick={handleNext} disabled={currentIdx === images.length - 1}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-30">
                          ›
                        </button>
                      </div>
                      {/* Thumbnails */}
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
                        {images.map((img, i) => (
                          <button key={i} onClick={() => setCurrentIdx(i)}
                            className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${currentIdx === i ? 'border-church-gold' : 'border-gray-200'}`}
                            style={{ width: 56, height: 72 }}>
                            <Image src={img.url} alt={`썸네일 ${i + 1}`} fill className="object-cover" sizes="56px" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-400 text-center py-10">이미지가 없습니다.</p>
              )}
            </div>

            {/* Archive sidebar */}
            <div className="w-full md:w-56 flex-shrink-0">
              <h2 className="text-base font-semibold text-church-navy mb-3">주보 아카이브</h2>
              <div className="space-y-2">
                {list.map(entry => (
                  <div key={entry.date} className="flex items-center gap-1">
                    <button onClick={() => handleSelectDate(entry.date)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition ${selectedDate === entry.date ? 'bg-gray-100 font-semibold text-church-navy' : 'hover:bg-gray-50 text-gray-700'}`}>
                      {entry.date}
                      <span className="block text-xs text-gray-400">{entry.images.length}장</span>
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(entry.date)} disabled={deleting === entry.date}
                        className="text-red-400 hover:text-red-600 text-xs px-1 disabled:opacity-50" title="삭제">
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
