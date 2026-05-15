'use client';

import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaFilePdf, FaImage, FaTimes, FaSpinner, FaNewspaper, FaCalendarAlt, FaSignInAlt, FaSignOutAlt, FaTrash } from 'react-icons/fa';

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
  const [deleting, setDeleting] = useState<string | null>(null);
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
        setIsAdmin(!!netlifyIdentity.currentUser());
        netlifyIdentity.on('login', () => { setIsAdmin(true); netlifyIdentity.close(); });
        netlifyIdentity.on('logout', () => setIsAdmin(false));
      }
    }, 500);
  };

  const handleLogin = () => {
    const ni = (window as any).netlifyIdentity;
    if (ni) ni.open('login');
  };

  const handleLogout = () => {
    const ni = (window as any).netlifyIdentity;
    if (ni) ni.logout();
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
    const ni = (window as any).netlifyIdentity;
    const user = ni?.currentUser();
    if (!user) { alert('로그인이 필요합니다.'); return; }
    const token = await user.jwt();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      const res = await fetch('/api/upload-bulletin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        alert('주보 업로드 완료!');
        setShowUpload(false);
        setTitle('');
        if (fileRef.current) fileRef.current.value = '';
        await fetchBulletins();
      } else {
        const err = await res.json();
        alert('업로드 실패: ' + (err.error || 'error'));
      }
    } catch (err) {
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (bulletin: Bulletin) => {
    if (!confirm('이 주보를 삭제하시겠습니까?')) return;
    const ni = (window as any).netlifyIdentity;
    const user = ni?.currentUser();
    if (!user) { alert('로그인이 필요합니다.'); return; }
    const token = await user.jwt();
    setDeleting(bulletin.public_id);
    try {
      const res = await fetch('/api/delete-bulletin', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: bulletin.public_id }),
      });
      if (res.ok) {
        setBulletins(prev => prev.filter(b => b.public_id !== bulletin.public_id));
        if (selectedBulletin?.public_id === bulletin.public_id) setSelectedBulletin(null);
      } else {
        const err = await res.json();
        alert('삭제 실패: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-church-light">
      <div className="bg-church-navy py-16 text-center">
        <FaNewspaper className="text-church-gold text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">교회소식 / 주보</h1>
        <p className="text-church-gold text-lg">Church News &amp; Bulletin</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap justify-end gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-2 bg-church-teal text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                <FaUpload /> 주보 업로드
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                <FaSignOutAlt /> 로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-church-navy text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors"
            >
              <FaSignInAlt /> 관리자 로그인
            </button>
          )}
        </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 (선택)</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="주보 제목 (예: 2024년 1월 첫째 주)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">파일 선택 (PDF 또는 이미지)</label>
                <input
                  type="file"
                  ref={fileRef}
                  accept=".pdf,image/*"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-church-navy file:text-white hover:file:bg-blue-900"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-church-teal text-white py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" /> 업로드 중...
                  </>
                ) : '업로드'}
              </button>
            </form>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-church-navy" />
          </div>
        ) : bulletins.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaNewspaper className="text-6xl mx-auto mb-4 opacity-30" />
            <p>등록된 주보가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bulletins.map(bulletin => (
              <div
                key={bulletin.public_id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {bulletin.format === 'pdf' ? (
                    <FaFilePdf className="text-red-500 text-2xl flex-shrink-0" />
                  ) : (
                    <FaImage className="text-blue-500 text-2xl flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-church-navy truncate">
                      {bulletin.context?.custom?.title || '주보'}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaCalendarAlt />
                      {formatDate(bulletin.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={bulletin.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-church-teal text-sm font-medium hover:underline"
                  >
                    {bulletin.format === 'pdf' ? 'PDF 열기' : '보기'}
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(bulletin)}
                      disabled={deleting === bulletin.public_id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1"
                    >
                      {deleting === bulletin.public_id
                        ? <FaSpinner className="animate-spin" />
                        : <FaTrash />
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
