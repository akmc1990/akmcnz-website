'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

interface CardImage { url: string; public_id: string; }
interface CardNewsEntry { date: string; images: CardImage[]; pdfUrl?: string | null; }

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
  const [uploadMode, setUploadMode] = useState<'pdf' | 'images'>('pdf');
  const [uploadPdf, setUploadPdf] = useState<File | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

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
  const pdfUrl = selectedEntry?.pdfUrl || null;

  const handlePrev = () => setCurrentIdx(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIdx(i => Math.min(images.length - 1, i + 1));
  const handleSelectDate = (date: string) => { setSelectedDate(date); setCurrentIdx(0); };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadPdf(file);
    setUploadError('');
    // Warn if PDF is too large (Vercel 4.5MB body limit)
    if (file && file.size > 4 * 1024 * 1024) {
      setUploadError('⚠️ PDF 파일이 4MB를 초과합니다. 업로드가 실패할 수 있습니다. PDF를 압축하거나 페이지를 줄여주세요.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFiles(Array.from(e.target.files || []));
    setUploadError('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!uploadDate) { setUploadError('날짜를 입력해주세요.'); return; }
    if (uploadMode === 'pdf' && !uploadPdf) { setUploadError('PDF 파일을 선택해주세요.'); return; }
    if (uploadMode === 'images' && uploadFiles.length === 0) { setUploadError('이미지 파일을 선택해주세요.'); return; }

    setUploading(true);
    setUploadProgress(uploadMode === 'pdf' ? 'PDF 변환 중... (페이지 수에 따라 30초~1분 소요될 수 있습니다)' : '업로드 중...');
    try {
      const formData = new FormData();
      formData.append('date', uploadDate);
      if (uploadMode === 'pdf' && uploadPdf) { formData.append('pdf', uploadPdf); }
      else { uploadFiles.forEach(f => formData.append('files', f)); }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

      const res = await fetch('/api/upload-cardnews', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const result = await res.json();
        setShowUpload(false); setUploadDate(''); setUploadPdf(null);
        setUploadFiles([]); setUploadProgress(''); setUploadMode('pdf');
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (pdfInputRef.current) pdfInputRef.current.value = '';
        await fetchList();
        if (result.pageCount) {
          alert('업로드 완료! ' + result.pageCount + '페이지가 변환되었습니다.');
        }
      } else {
        let errMsg = '업로드 실패';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch { /* ignore */ }
        if (res.status === 413) errMsg = '파일이 너무 큽니다 (최대 4.5MB). PDF를 압축해주세요.';
        if (res.status === 504) errMsg = '서버 시간 초과. PDF 페이지 수를 줄이거나 나중에 다시 시도해주세요.';
        setUploadError('오류: ' + errMsg);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setUploadError('요청 시간 초과 (90초). PDF 파일이 너무 크거나 페이지가 많습니다. 파일을 줄여서 다시 시도해주세요.');
      } else {
        setUploadError('네트워크 오류: ' + String(err));
      }
    }
    finally { setUploading(false); setUploadProgress(''); }
  };

  const handleDelete = async (date: string) => {
    if (!confirm(date + ' 카드뉴스를 삭제하시겠습니까?')) return;
    setDeleting(date);
    try {
      const res = await fetch('/api/delete-cardnews', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (res.ok) {
        const newList = list.filter(e => e.date !== date);
        setList(newList);
        if (selectedDate === date) {
          if (newList.length > 0) { setSelectedDate(newList[0].date); setCurrentIdx(0); }
          else { setSelectedDate(null); }
        }
      }
    } catch { alert('삭제 오류'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-church-navy">교회소식 / 주보</h1>
          <div className="flex items-center gap-3">
            {isAdmin && <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700 underline">로그아웃</button>}
            {!isAdmin ? (
              <button onClick={() => signIn()} className="bg-church-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition">관리자 로그인</button>
            ) : (
              <button onClick={() => setShowUpload(v => !v)} className="bg-church-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
                {showUpload ? '✕ 닫기' : '+ 주보 업로드'}
              </button>
            )}
          </div>
        </div>

        {isAdmin && showUpload && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-church-navy mb-1">주보 업로드</h2>
            <p className="text-xs text-gray-400 mb-4">PDF는 4MB 이하 권장 (Vercel 서버 제한)</p>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">날짜 (YYYY-MM-DD)</label>
                <input type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-church-navy" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">업로드 방식</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="uploadMode" value="pdf" checked={uploadMode === 'pdf'} onChange={() => setUploadMode('pdf')} className="accent-church-navy" />
                    <span className="text-sm font-medium text-church-navy">PDF 업로드 (자동 변환)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="uploadMode" value="images" checked={uploadMode === 'images'} onChange={() => setUploadMode('images')} />
                    <span className="text-sm text-gray-600">이미지 파일 업로드</span>
                  </label>
                </div>
              </div>
              {uploadMode === 'pdf' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주보 PDF 파일 (4MB 이하 권장)</label>
                  <div className="border-2 border-dashed border-church-navy/30 rounded-lg p-4 bg-blue-50">
                    <p className="text-xs text-gray-500 mb-2">PDF를 업로드하면 각 페이지가 자동으로 이미지 카드로 변환되며, 원본 PDF 다운로드 링크도 함께 제공됩니다. 변환에 30초~1분 정도 소요될 수 있습니다.</p>
                    <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" onChange={handlePdfChange} className="text-sm" />
                    {uploadPdf && <p className="text-xs text-gray-600 mt-1">선택됨: {uploadPdf.name} ({(uploadPdf.size / 1024 / 1024).toFixed(1)}MB)</p>}
                  </div>
                </div>
              )}
              {uploadMode === 'images' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지 파일 (여러 장 선택 가능)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="text-sm" />
                  {uploadFiles.length > 0 && <p className="text-xs text-gray-500 mt-1">선택됨: {uploadFiles.length}개 파일</p>}
                </div>
              )}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-600 text-sm">{uploadError}</p>
                </div>
              )}
              {uploadProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <p className="text-blue-600 text-sm">{uploadProgress}</p>
                  </div>
                </div>
              )}
              <button type="submit" disabled={uploading}
                className="bg-church-navy text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50">
                {uploading ? '처리 중...' : (uploadMode === 'pdf' ? 'PDF 업로드 & 변환' : '이미지 업로드')}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-navy"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center text-gray-400 py-16">업로드된 주보가 없습니다.</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              {selectedEntry && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-semibold text-church-gold">{selectedDate}</p>
                    {pdfUrl && (
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        주보 PDF 다운로드
                      </a>
                    )}
                  </div>
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden" style={{ aspectRatio: '3/4', maxWidth: 420, margin: '0 auto' }}>
                    {images.length > 0 && (
                      <Image src={images[currentIdx]?.url} alt={`주보 ${currentIdx + 1}`} fill
                        className="object-contain" sizes="(max-width: 768px) 100vw, 420px" priority={currentIdx === 0} />
                    )}
                  </div>
                  {images.length > 1 && (
                    <>
                      <div className="flex justify-center items-center gap-4 mt-4">
                        <button onClick={handlePrev} disabled={currentIdx === 0}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition">&#8249;</button>
                        <div className="flex gap-1.5">
                          {images.map((_, i) => (
                            <button key={i} onClick={() => setCurrentIdx(i)}
                              className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'bg-church-navy w-5' : 'bg-gray-300'}`} />
                          ))}
                        </div>
                        <button onClick={handleNext} disabled={currentIdx === images.length - 1}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition">&#8250;</button>
                      </div>
                      <p className="text-center text-sm text-gray-400 mt-2">{currentIdx + 1} / {images.length}</p>
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
                        {images.map((img, i) => (
                          <button key={i} onClick={() => setCurrentIdx(i)}
                            className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${i === currentIdx ? 'border-church-navy' : 'border-transparent'}`}
                            style={{ width: 56, height: 72 }}>
                            <Image src={img.url} alt={`썸네일 ${i + 1}`} fill className="object-cover" sizes="56px" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="w-full md:w-56 flex-shrink-0">
              <h2 className="text-base font-semibold text-church-navy mb-3">주보 아카이브</h2>
              <div className="space-y-2">
                {list.map(entry => (
                  <div key={entry.date} className="flex items-center gap-1">
                    <button onClick={() => handleSelectDate(entry.date)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition ${selectedDate === entry.date ? 'bg-church-navy/10 text-church-navy font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                      {entry.date}
                      <span className="block text-xs text-gray-400">{entry.images.length}장{entry.pdfUrl ? ' · PDF' : ''}</span>
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(entry.date)} disabled={deleting === entry.date}
                        className="text-red-400 hover:text-red-600 text-xs px-1 disabled:opacity-50" title="삭제">&#x2715;</button>
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
