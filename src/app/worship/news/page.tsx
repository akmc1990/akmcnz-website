'use client';

import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaFilePdf, FaImage, FaTimes, FaSpinner, FaNewspaper, FaCalendarAlt } from 'react-icons/fa';

interface Bulletin {
  public_id: string;
  secure_url: string;
  format: string;
  created_at: string;
  context?: {
    custom?: {
      title?: string;
    };
  };
}

export default function NewsPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBulletins();
    checkAdmin();
  }, []);

  const checkAdmin = () => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      const netlifyIdentity = (window as any).netlifyIdentity;
      if (netlifyIdentity) {
        const user = netlifyIdentity.currentUser();
        setIsAdmin(!!user);
        netlifyIdentity.on('login', () => setIsAdmin(true));
        netlifyIdentity.on('logout', () => setIsAdmin(false));
      }
    }, 500);
  };

  const fetchBulletins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bulletins');
      if (res.ok) {
        const data = await res.json();
        setBulletins(data.bulletins || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    const netlifyIdentity = (window as any).netlifyIdentity;
    const user = netlifyIdentity?.currentUser();
    if (!user) { alert('로그인이 필요합니다.'); return; }

    const token = await user.jwt();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const res = await fetch('/api/upload-bulletin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert('주보가 업로드되었습니다.');
        setShowUpload(false);
        setTitle('');
        if (fileRef.current) fileRef.current.value = '';
        await fetchBulletins();
      } else {
        const err = await res.json();
        alert('업로드 실패: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-church-light">
      {/* Hero */}
      <div className="bg-church-navy py-16 text-center">
        <FaNewspaper className="text-church-gold text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">교회소식 / 주보</h1>
        <p className="text-church-gold text-lg">Church News & Bulletin</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Admin Upload Button */}
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 bg-church-teal text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors"
            >
              <FaUpload />
              주보 업로드
            </button>
          </div>
        )}

        {/* Upload Form */}
        {isAdmin && showUpload && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-church-navy">주보 업로드</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  파일 선택 (PDF 또는 이미지)
                </label>
                <input
                  type="file"
                  ref={fileRef}
                  accept=".pdf,image/*"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-church-navy file:text-white hover:file:bg-blue-900"
                />
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <FaFilePdf className="text-red-500" /> PDF
                  <FaImage className="text-blue-500" /> 이미지 (JPG, PNG)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 (선택)</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="예: 2026년 5월 17일 주보"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-church-navy"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-church-teal text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {uploading ? <><FaSpinner className="animate-spin" /> 업로드 중...</> : '업로드'}
              </button>
            </form>
          </div>
        )}

        {/* Bulletins List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-church-navy" />
          </div>
        ) : bulletins.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaNewspaper className="text-6xl mx-auto mb-4 opacity-30" />
            <p>아직 업로드된 주보가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bulletins.map((bulletin) => (
              <div
                key={bulletin.public_id}
                className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedBulletin(bulletin)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bulletin.format === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                  {bulletin.format === 'pdf'
                    ? <FaFilePdf className="text-red-500 text-2xl" />
                    : <FaImage className="text-blue-500 text-2xl" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-church-navy truncate">
                    {bulletin.context?.custom?.title || '주보'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <FaCalendarAlt className="text-xs" />
                    {formatDate(bulletin.created_at)}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
                  {bulletin.format}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {selectedBulletin && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBulletin(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setSelectedBulletin(null)}
          >
            <FaTimes />
          </button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            {selectedBulletin.format === 'pdf' ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <FaFilePdf className="text-red-500 text-6xl mx-auto mb-4" />
                <p className="text-church-navy font-semibold text-lg mb-4">
                  {selectedBulletin.context?.custom?.title || '주보'}
                </p>
                <a
                  href={selectedBulletin.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-church-red text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  PDF 열기
                </a>
              </div>
            ) : (
              <img
                src={selectedBulletin.secure_url}
                alt={selectedBulletin.context?.custom?.title || '주보'}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
