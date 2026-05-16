'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
  const { data: session } = useSession();
  const isAdmin = !!session?.user;
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBulletins();
  }, []);

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
    if (!session) { alert('로그인이 필요합니다.'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      const res = await fetch('/api/upload-bulletin', {
        method: 'POST',
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
    if (!session) { alert('로그인이 필요합니다.'); return; }
    setDeleting(bulletin.public_id);
    try {
      const res = await fetch('/api/delete-bulletin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: bulletin.public_id }),
      });
      if (res.ok) {
        setBulletins(prev => prev.filter(b => b.public_id !== bulletin.public_id));
        if (selectedBulletin?.public_id === bulletin.public_id) setSelectedBulletin(null);
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaNewspaper className="text-3xl text-church-navy" />
            <h1 className="text-2xl font-bold text-church-navy">교회소식 / 주보</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-2 px-4 py-2 bg-church-navy text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                <FaUpload /> 업로드
              </button>
            )}
            {isAdmin ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                <FaSignOutAlt /> 로그아웃
              </button>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                <FaSignInAlt /> 관리자 로그인
              </button>
            )}
          </div>
        </div>

        {showUpload && isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-church-navy mb-4">주보 업로드</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="주보 제목..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">파일 선택 (PDF, 이미지)</label>
                <input type="file" ref={fileRef} accept=".pdf,image/*" className="text-sm" />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-church-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 text-sm flex items-center gap-2"
              >
                {uploading ? <><FaSpinner className="animate-spin" /> 업로드 중...</> : '업로드'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-church-navy" />
          </div>
        ) : bulletins.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaNewspaper className="text-5xl mx-auto mb-3 opacity-30" />
            <p>주보가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bulletins.map(bulletin => (
              <div key={bulletin.public_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setSelectedBulletin(bulletin)}>
                  {bulletin.format === 'pdf' ? (
                    <FaFilePdf className="text-2xl text-red-500 flex-shrink-0" />
                  ) : (
                    <FaImage className="text-2xl text-blue-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {bulletin.context?.custom?.title || '주보'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <FaCalendarAlt className="text-xs" />
                      {formatDate(bulletin.created_at)}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(bulletin)}
                    disabled={deleting === bulletin.public_id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 ml-2"
                  >
                    {deleting === bulletin.public_id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBulletin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBulletin(null)}>
          <div className="relative bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">{selectedBulletin.context?.custom?.title || '주보'}</h3>
              <button onClick={() => setSelectedBulletin(null)} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-4">
              {selectedBulletin.format === 'pdf' ? (
                <iframe src={selectedBulletin.secure_url} className="w-full h-96" title={selectedBulletin.context?.custom?.title || '주보'} />
              ) : (
                <img src={selectedBulletin.secure_url} alt={selectedBulletin.context?.custom?.title || '주보'} className="max-w-full mx-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
