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

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDate, setUploadDate] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
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
        if (entries.length > 0) {
          setSelectedDate(entries[0].date);
          setCurrentIdx(0);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const selectedEntry = list.find(e => e.date === selectedDate) || null;
  const images = selectedEntry?.images || [];

  const handlePrev = () => setCurrentIdx(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIdx(i => Math.min(images.length - 1, i + 1));

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setCurrentIdx(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files);
    setUploadError('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!uploadDate) { setUploadError('날짜를 입력해주세요.'); return; }
    if (uploadFiles.length === 0) { setUploadError('이미지 파일을 선택해주세요.'); return; }
    setUploading(true);
    setUploadProgress('업로드 중... (0/' + uploadFiles.length + ')');
    try {
      const formData = new FormData();
      formData.append('date', uploadDate);
      uploadFiles.forEach(f => formData.append('files', f));
      setUploadProgress('서버에 전송 중...');
      const res = await fetch('/api/upload-cardnews', { method: 'POST', body: formData });
      if (res.ok) {
        setShowUpload(false);
        setUploadDate('');
        setUploadFiles([]);
        setUploadProgress('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchList();
      } else {
        const err = await res.json();
        setUploadError(err.error || '업로드 실패');
      }
    } catch { setUploadError('오류 발생'); }
    finally { setUploading(false); setUploadProgress(''); }
  };

  const handleDelete = async (date: string) => {
    if (!confirm(date + ' 카드뉴스를 삭제하시겠습니까?')) return;
    setDeleting(date);
    try {
      const res = await fetch('/api/delete-cardnews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-church-navy">교회소식 / 주보</h1>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowUpload(v => !v)}
                className="px-4 py-2 bg-church-gold text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                {showUpload ? '✕ 닫기' : '+ 카드뉴스 업로드'}
              </button>
            )}
            {isAdmin
              ? <button onClick={() => signOut()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100">로그아웃</button>
              : <button onClick={() => signIn('google')} className="px-4 py-2 bg-church-navy text-white rounded-lg text-sm font-semibold hover:opacity-90">관리자 로그인</button>
            }
          </div>
        </div>

        {/* Upload Panel */}
        {isAdmin && showUpload && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-bold text-church-navy mb-4">카드뉴스 이미지 업로드</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">날짜 (YYYY-MM-DD) *</label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={e => setUploadDate(e.target.value)}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">이미지 파일 선택 * (여러 장 동시 선택 가능)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                {uploadFiles.length > 0 && (
                  <p className="text-sm text-green-600 font-medium">{uploadFiles.length}장 선택됨</p>
                )}
                <p className="text-xs text-gray-400">JPG, PNG 등 이미지 파일을 선택하세요. 파일명 순서대로 업로드됩니다.</p>
              </div>
              {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
              {uploadProgress && <p className="text-blue-500 text-sm">{uploadProgress}</p>}
              <button
                type="submit"
                disabled={uploading}
                className="self-start px-6 py-2 bg-church-gold text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {uploading ? '업로드 중...' : '업로드'}
              </button>
            </form>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Viewer */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-gray-400">불러오는 중...</div>
            ) : list.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">등록된 카드뉴스가 없습니다.</div>
            ) : images.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">이미지가 없습니다.</div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {/* Date label */}
                <p className="text-church-gold font-bold text-lg tracking-widest">{selectedDate}</p>

                {/* Image viewer */}
                <div className="relative w-full max-w-lg">
                  <Image
                    src={images[currentIdx].url}
                    alt={'카드뉴스 ' + (currentIdx + 1)}
                    width={600}
                    height={800}
                    className="w-full rounded-2xl shadow-lg object-contain"
                    unoptimized
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all"
                    style={{ borderColor: currentIdx === 0 ? '#EDD9B8' : '#B8711A', color: currentIdx === 0 ? '#EDD9B8' : '#B8711A', background: currentIdx === 0 ? 'transparent' : '#FFF4E0' }}
                  >&#8249;</button>

                  {/* Dots */}
                  <div className="flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIdx(i)}
                        className="rounded-full transition-all"
                        style={{ width: i === currentIdx ? 28 : 8, height: 8, background: i === currentIdx ? '#B8711A' : '#EDD9B8', border: 'none', padding: 0 }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentIdx === images.length - 1}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all"
                    style={{ borderColor: currentIdx === images.length - 1 ? '#EDD9B8' : '#B8711A', color: currentIdx === images.length - 1 ? '#EDD9B8' : '#B8711A', background: currentIdx === images.length - 1 ? 'transparent' : '#FFF4E0' }}
                  >&#8250;</button>
                </div>

                <p className="text-gray-400 text-sm">{currentIdx + 1} / {images.length}</p>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 flex-wrap justify-center mt-2">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setCurrentIdx(i)} className="rounded-lg overflow-hidden border-2 transition-all" style={{ borderColor: i === currentIdx ? '#B8711A' : 'transparent' }}>
                        <Image src={img.url} alt={'썸네일 ' + (i + 1)} width={60} height={80} className="object-cover" style={{ width: 60, height: 80 }} unoptimized />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Archive sidebar */}
          {list.length > 0 && (
            <div className="lg:w-60 flex flex-col gap-2 flex-shrink-0">
              <h2 className="text-base font-bold text-church-navy mb-1">주보 아카이브</h2>
              {list.map(entry => (
                <div
                  key={entry.date}
                  className={'flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all border ' + (selectedDate === entry.date ? 'bg-amber-50 border-amber-400' : 'bg-white border-gray-200 hover:border-amber-300')}
                  onClick={() => handleSelectDate(entry.date)}
                >
                  <div>
                    <div className="text-sm font-bold text-gray-800">{entry.date}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{entry.images.length}장</div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={ev => { ev.stopPropagation(); handleDelete(entry.date); }}
                      disabled={deleting === entry.date}
                      className="text-red-400 hover:text-red-600 text-sm p-1 disabled:opacity-40"
                    >
                      {deleting === entry.date ? '...' : '🗑'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
