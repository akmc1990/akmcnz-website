'use client';

import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaTimes, FaSpinner, FaImages, FaSignInAlt, FaSignOutAlt, FaTrash } from 'react-icons/fa';

const TAGS = ['전체', '유아', '아동', '학생', '청년', '청장년', '장년', '문화', '선교'];

interface Photo {
      public_id: string;
      secure_url: string;
      tags: string[];
      created_at: string;
      context?: { custom?: { caption?: string; }; };
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
      const [deleting, setDeleting] = useState<string | null>(null);
      const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPhotos(); checkAdmin(); }, []);

  const checkAdmin = () => {
          if (typeof window === 'undefined') return;
          setTimeout(() => {
                    const ni = (window as any).netlifyIdentity;
                    if (ni) {
                                setIsAdmin(!!ni.currentUser());
                                ni.on('login', () => { setIsAdmin(true); ni.close(); });
                                ni.on('logout', () => setIsAdmin(false));
                    }
          }, 500);
  };

  const handleLogin = () => { const ni = (window as any).netlifyIdentity; if (ni) ni.open('login'); };
      const handleLogout = () => { const ni = (window as any).netlifyIdentity; if (ni) ni.logout(); };

  const fetchPhotos = async () => {
          setLoading(true);
          try {
                    const res = await fetch('/api/photos');
                    if (res.ok) { const data = await res.json(); setPhotos(data.photos || []); }
          } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filteredPhotos = selectedTag === '전체' ? photos : photos.filter(p => p.tags.includes(selectedTag));

  const handleUpload = async (e: React.FormEvent) => {
          e.preventDefault();
          const files = fileRef.current?.files;
          if (!files || files.length === 0) return;
          const ni = (window as any).netlifyIdentity;
          const user = ni?.currentUser();
          if (!user) { alert('로그인이 필요합니다.'); return; }
          const token = await user.jwt();
          setUploading(true);
          try {
                    let ok = 0;
                    for (let i = 0; i < files.length; i++) {
                                const fd = new FormData();
                                fd.append('file', files[i]);
                                fd.append('tag', uploadTag);
                                fd.append('caption', caption);
                                const res = await fetch('/api/upload-photo', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
                                if (res.ok) ok++;
                                else { const err = await res.json(); alert('업로드 실패: ' + (err.error || 'error')); }
                    }
                    if (ok > 0) {
                                alert(`${ok}장 업로드 완료!`);
                                setShowUpload(false); setCaption('');
                                if (fileRef.current) fileRef.current.value = '';
                                await fetchPhotos();
                    }
          } catch (err) { alert('오류가 발생했습니다.'); } finally { setUploading(false); }
  };

  const handleDelete = async (photo: Photo) => {
          if (!confirm('이 사진을 삭제하시겠습니까?')) return;
          const ni = (window as any).netlifyIdentity;
          const user = ni?.currentUser();
          if (!user) { alert('로그인이 필요합니다.'); return; }
          const token = await user.jwt();
          setDeleting(photo.public_id);
          try {
                    const res = await fetch('/api/delete-photo', {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ public_id: photo.public_id }),
                    });
                    if (res.ok) {
                                setPhotos(prev => prev.filter(p => p.public_id !== photo.public_id));
                                if (selectedPhoto?.public_id === photo.public_id) setSelectedPhoto(null);
                    } else { const err = await res.json(); alert('삭제 실패: ' + (err.error || 'error')); }
          } catch (err) { alert('오류가 발생했습니다.'); } finally { setDeleting(null); }
  };

  return (
          <div className="min-h-screen bg-church-light">
                <div className="bg-church-navy py-16 text-center">
                        <FaImages className="text-church-gold text-5xl mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-white mb-2">사진 / 영상</h1>h1>
                        <p className="text-church-gold text-lg">Photo Gallery</p>p>
                </div>div>
                <div className="max-w-7xl mx-auto px-4 py-10">
                        <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
                                  <div className="flex flex-wrap gap-2">
                                      {TAGS.map(tag => (
                            <button key={tag} onClick={() => setSelectedTag(tag)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-church-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                                {tag}
                            </button>button>
                          ))}
                                  </div>div>
                                  <div className="flex items-center gap-2">
                                      {isAdmin ? (
                            <>
                                            <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 bg-church-teal text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
                                                              <FaUpload /> 사진 업로드
                                            </button>button>
                                            <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors">
                                                              <FaSignOutAlt /> 로그아웃
                                            </button>button>
                            </>>
                          ) : (
                            <button onClick={handleLogin} className="flex items-center gap-2 bg-church-navy text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors">
                                            <FaSignInAlt /> 관리자 로그인
                            </button>button>
                                              )}
                                  </div>div>
                        </div>div>
                    {isAdmin && showUpload && (
                        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                                  <h2 className="text-lg font-bold text-church-navy">사진 업로드</h2>h2>
                                                  <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>button>
                                    </div>div>
                                    <form onSubmit={handleUpload} className="space-y-4">
                                                  <div>
                                                                  <label className="block text-sm font-medium text-gray-700 mb-1">파일 선택 (여러 장 동시 선택 가능)</label>label>
                                                                  <input type="file" ref={fileRef} accept="image/*" multiple required
                                                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-church-navy file:text-white hover:file:bg-blue-900" />
                                                                  <p className="text-xs text-gray-400 mt-1">Ctrl(또는 Cmd) 키를 누른 채 여러 파일 선택 가능</p>p>
                                                  </div>div>
                                                  <div>
                                                                  <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>label>
                                                                  <select value={uploadTag} onChange={e => setUploadTag(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                                                      {TAGS.filter(t => t !== '전체').map(tag => <option key={tag} value={tag}>{tag}</option>option>)}
                                                                  </select>select>
                                                  </div>div>
                                                  <div>
                                                                  <label className="block text-sm font-medium text-gray-700 mb-1">설명 (선택)</label>label>
                                                                  <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="사진 설명"
                                                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                                                  </div>div>
                                                  <button type="submit" disabled={uploading} className="w-full bg-church-teal text-white py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-60 flex items-center justify-center gap-2">
                                                      {uploading ? <><FaSpinner className="animate-spin" /> 업로드 중...</>> : '업로드'}
                                                  </button>button>
                                    </form>form>
                        </div>div>
                        )}
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-4xl text-church-navy" /></div>div>
                      ) : filteredPhotos.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                                    <FaImages className="text-6xl mx-auto mb-4 opacity-30" />
                                    <p>사진이 없습니다.</p>p>
                        </div>div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredPhotos.map(photo => (
                                          <div key={photo.public_id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                                          <img src={photo.secure_url} alt={photo.context?.custom?.caption || ''}
                                                                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                                                                onClick={() => setSelectedPhoto(photo)} />
                                              {isAdmin && (
                                                                <button onClick={e => { e.stopPropagation(); handleDelete(photo); }} disabled={deleting === photo.public_id}
                                                                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50">
                                                                    {deleting === photo.public_id ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
                                                                </button>button>
                                                          )}
                                          </div>div>
                                        ))}
                        </div>div>
                        )}
                </div>div>
              {selectedPhoto && (
                      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
                                <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setSelectedPhoto(null)}><FaTimes /></button>button>
                                <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                                            <img src={selectedPhoto.secure_url} alt={selectedPhoto.context?.custom?.caption || ''} className="w-full max-h-[85vh] object-contain" />
                                    {selectedPhoto.context?.custom?.caption && (
                                        <p className="text-white text-center mt-3 text-sm">{selectedPhoto.context.custom.caption}</p>p>
                                            )}
                                    {isAdmin && (
                                        <div className="flex justify-center mt-4">
                                                        <button onClick={() => handleDelete(selectedPhoto)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-700">
                                                                          <FaTrash /> 이 사진 삭제
                                                        </button>button>
                                        </div>div>
                                            )}
                                </div>div>
                      </div>div>
                )}
          </div>div>
        );
}</></></div>
