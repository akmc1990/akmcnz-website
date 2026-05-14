'use client';

import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaFilter, FaTimes, FaSpinner, FaImages } from 'react-icons/fa';

const TAGS = ['전체', '유아', '아동', '학생', '청년', '청장년', '장년', '문화', '선교'];

interface Photo {
  public_id: string;
  secure_url: string;
  tags: string[];
  created_at: string;
  context?: {
    custom?: {
      caption?: string;
    };
  };
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('전체');
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadTag, setUploadTag] = useState('장년');
  const [caption, setCaption] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
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
      formData.append('tag', uploadTag);
      formData.append('caption', caption);

      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert('사진이 업로드되었습니다.');
        setShowUpload(false);
        setCaption('');
        if (fileRef.current) fileRef.current.value = '';
        await fetchPhotos();
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

  return (
    <div className="min-h-screen bg-church-light">
      {/* Hero */}
      <div className="bg-church-navy py-16 text-center">
        <FaImages className="text-church-gold text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">사진 / 영상</h1>
        <p className="text-church-gold text-lg">Photo Gallery</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-church-navy text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-church-navy hover:text-church-navy'
              }`}
            >
              {tag}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-church-teal text-white flex items-center gap-2 hover:bg-teal-700 transition-colors"
            >
              <FaUpload />
              사진 업로드
            </button>
          )}
        </div>

        {/* Upload Form */}
        {isAdmin && showUpload && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-church-navy">사진 업로드</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 선택</label>
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-church-navy file:text-white hover:file:bg-blue-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
                <select
                  value={uploadTag}
                  onChange={e => setUploadTag(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-church-navy"
                >
                  {TAGS.filter(t => t !== '전체').map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명 (선택)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="사진 설명을 입력하세요"
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

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-church-navy" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaImages className="text-6xl mx-auto mb-4 opacity-30" />
            <p>사진이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredPhotos.map(photo => (
              <div
                key={photo.public_id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.secure_url}
                  alt={photo.context?.custom?.caption || '교회 사진'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.tags && photo.tags.length > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-church-navy/80 text-white text-xs px-2 py-0.5 rounded-full">
                      {photo.tags[0]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setSelectedPhoto(null)}
          >
            <FaTimes />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selectedPhoto.secure_url}
              alt={selectedPhoto.context?.custom?.caption || '교회 사진'}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {selectedPhoto.context?.custom?.caption && (
              <p className="text-white text-center mt-3 text-sm">
                {selectedPhoto.context.custom.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
