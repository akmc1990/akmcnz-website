'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaUpload, FaTimes, FaSpinner, FaImages, FaSignInAlt, FaSignOutAlt, FaTrash } from 'react-icons/fa';

const TAGS = ['전체', '유아', '아동', '학생', '청년', '청장년', '장년', '문화', '선교'];

interface Photo {
  public_id: string;
  secure_url: string;
  tags: string[];
  created_at: string;
  context?: { custom?: { caption?: string } };
}

export default function GalleryPage() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('전체');
  const [uploading, setUploading] = useState(false);
  const [uploadTag, setUploadTag] = useState('장년');
  const [caption, setCaption] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = selectedTag === '전체'
    ? photos
    : photos.filter(p => p.tags.includes(selectedTag));

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;
    if (!session) { alert('로그인이 필요합니다.'); return; }
    setUploading(true);
    try {
      let ok = 0;
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        fd.append('tag', uploadTag);
        fd.append('caption', caption);
        const res = await fetch('/api/upload-photo', {
          method: 'POST',
          body: fd,
        });
        if (res.ok) {
          ok++;
        } else {
          const err = await res.json();
          alert('업로드 실패: ' + (err.error || 'error'));
        }
      }
      if (ok > 0) {
        alert(ok + '장 업로드 완료!');
        setShowUpload(false);
        setCaption('');
        if (fileRef.current) fileRef.current.value = '';
        await fetchPhotos();
      }
    } catch (err) {
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm('이 사진을 삭제하시겠습니까?')) return;
    if (!session) { alert('로그인이 필요합니다.'); return; }
    setDeleting(photo.public_id);
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: photo.public_id }),
      });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.public_id !== photo.public_id));
        if (selectedPhoto?.public_id === photo.public_id) setSelectedPhoto(null);
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaImages className="text-3xl text-church-navy" />
            <h1 className="text-2xl font-bold text-church-navy">사진 / 영상</h1>
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
            <h2 className="text-lg font-semibold text-church-navy mb-4">사진 업로드</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
                <select
                  value={uploadTag}
                  onChange={e => setUploadTag(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {TAGS.filter(t => t !== '전체').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">캐션 (선택)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="사진 설명..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 선택</label>
                <input type="file" ref={fileRef} multiple accept="image/*" className="text-sm" />
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

        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-church-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-church-navy hover:text-church-navy'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-church-navy" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaImages className="text-5xl mx-auto mb-3 opacity-30" />
            <p>사진이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map(photo => (
              <div key={photo.public_id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                <div className="aspect-square overflow-hidden">
                  <img src={photo.secure_url} alt={photo.context?.custom?.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                {isAdmin && (
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(photo); }}
                    disabled={deleting === photo.public_id}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting === photo.public_id ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
                  </button>
                )}
                {photo.context?.custom?.caption && (
                  <div className="p-2 text-xs text-gray-600 truncate">{photo.context.custom.caption}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedPhoto(null)} className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <FaTimes className="text-2xl" />
            </button>
            <img src={selectedPhoto.secure_url} alt={selectedPhoto.context?.custom?.caption || ''} className="max-w-full max-h-screen object-contain rounded-lg" />
            {selectedPhoto.context?.custom?.caption && (
              <p className="text-white text-center mt-2 text-sm">{selectedPhoto.context.custom.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
