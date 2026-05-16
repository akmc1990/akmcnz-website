'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface CardNewsItem {
  public_id: string;
  secure_url: string;
  created_at: string;
  date: string;
}

export default function NewsPage() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user;
  const [list, setList] = useState<CardNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CardNewsItem | null>(null);
  const [jsxCode, setJsxCode] = useState<string | null>(null);
  const [fetchingCode, setFetchingCode] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDate, setUploadDate] = useState('');
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cardnews');
      if (res.ok) { const d = await res.json(); setList(d.cardnews || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadCardNews = async (item: CardNewsItem) => {
    if (selectedItem?.public_id === item.public_id) return;
    setFetchingCode(true);
    setSelectedItem(item);
    setJsxCode(null);
    try {
      const res = await fetch(item.secure_url);
      const text = await res.text();
      setJsxCode(text);
    } catch (e) { console.error(e); } finally { setFetchingCode(false); }
  };

  useEffect(() => {
    if (list.length > 0 && !selectedItem) loadCardNews(list[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    if (!jsxCode || !iframeRef.current) return;
    const iframe = iframeRef.current;
    const html = buildIframeHtml(jsxCode);
    iframe.srcdoc = html;
  }, [jsxCode]);

  const buildIframeHtml = (code: string): string => {
    return [
      "<!DOCTYPE html>",
      "<html><head>",
      "<meta charset='utf-8' />",
      "<script src='https://unpkg.com/@babel/standalone/babel.min.js'><" + "/script>",
      "<script src='https://unpkg.com/react@18/umd/react.development.js'><" + "/script>",
      "<script src='https://unpkg.com/react-dom@18/umd/react-dom.development.js'><" + "/script>",
      "<link href='https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap' rel='stylesheet'>",
      "<style>* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #f0ece3; font-family: 'Noto Sans KR', sans-serif; } #root { width: 100%; }</style>",
      "</head><body>",
      "<div id='root'></div>",
      "<script type='text/babel' data-presets='react'>",
      code,
      "const __root = ReactDOM.createRoot(document.getElementById('root'));",
      "const __comp = typeof App !== 'undefined' ? App : typeof CardNews !== 'undefined' ? CardNews : null;",
      "if (__comp) { __root.render(React.createElement(__comp)); } else { document.getElementById('root').innerHTML = '<p style=\\\'color:red;padding:20px\\\'>App 또는 CardNews 컴포넌트를 찾을 수 없습니다.</p>'; }",
      "<" + "/script>",
      "</body></html>"
    ].join('\n');
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('이 카드뉴스를 삭제하시겠습니까?')) return;
    setDeleting(publicId);
    try {
      const res = await fetch('/api/delete-cardnews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId }),
      });
      if (res.ok) {
        if (selectedItem?.public_id === publicId) { setSelectedItem(null); setJsxCode(null); }
        await fetchList();
      }
    } catch (e) { console.error(e); } finally { setDeleting(null); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!uploadDate) { setUploadError('날짜를 입력해주세요.'); return; }
    if (!uploadFile) { setUploadError('.jsx 파일을 선택해주세요.'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('date', uploadDate);
      formData.append('label', uploadLabel || uploadDate);
      const res = await fetch('/api/upload-cardnews', { method: 'POST', body: formData });
      if (res.ok) {
        setShowUpload(false); setUploadDate(''); setUploadLabel(''); setUploadFile(null);
        await fetchList();
      } else {
        const d = await res.json();
        setUploadError(d.error || '업로드 실패');
      }
    } catch { setUploadError('업로드 중 오류가 발생했습니다.'); } finally { setUploading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: "'Noto Sans KR',sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3A2010' }}>교회소식 / 주보</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            {isAdmin && (
              <button onClick={() => setShowUpload(v => !v)} style={{ padding: '8px 18px', background: '#B8711A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>+ 카드뉴스 업로드</button>
            )}
            {session ? (
              <button onClick={() => signOut()} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: 8, cursor: 'pointer', color: '#666' }}>로그아웃</button>
            ) : (
              <button onClick={() => signIn('google')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: 8, cursor: 'pointer', color: '#666' }}>관리자 로그인</button>
            )}
          </div>
        </div>

        {isAdmin && showUpload && (
          <form onSubmit={handleUpload} style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#3A2010' }}>새 카드뉴스 업로드</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 4 }}>날짜 (YYYY-MM-DD)</label>
                <input type='text' value={uploadDate} onChange={e => setUploadDate(e.target.value)} placeholder='예: 2026-05-17' style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 4 }}>제목 (선택)</label>
                <input type='text' value={uploadLabel} onChange={e => setUploadLabel(e.target.value)} placeholder='예: 2026. 05. 17 제37권 20호' style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 4 }}>.jsx 파일 선택</label>
                <input type='file' accept='.jsx,.js,.tsx,.ts' onChange={e => setUploadFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#f9f9f9' }} />
              </div>
              {uploadError && <p style={{ color: 'red', fontSize: 13 }}>{uploadError}</p>}
              <button type='submit' disabled={uploading} style={{ padding: '10px 24px', background: uploading ? '#ccc' : '#B8711A', color: '#fff', border: 'none', borderRadius: 8, cursor: uploading ? 'default' : 'pointer', fontWeight: 600, fontSize: 15 }}>{uploading ? '업로드 중...' : '업로드'}</button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#888', padding: 60 }}>불러오는 중...</div>
            ) : list.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: 60 }}>등록된 카드뉴스가 없습니다.</div>
            ) : fetchingCode ? (
              <div style={{ textAlign: 'center', color: '#888', padding: 60 }}>카드뉴스를 불러오는 중...</div>
            ) : jsxCode ? (
              <iframe ref={iframeRef} style={{ width: '100%', minHeight: 900, border: 'none', borderRadius: 16 }} sandbox='allow-scripts' title='카드뉴스' />
            ) : null}
          </div>

          {list.length > 0 && (
            <div style={{ width: 200, flexShrink: 0 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#3A2010', marginBottom: 12 }}>주보 아카이브</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(item => (
                  <div key={item.public_id} onClick={() => loadCardNews(item)} style={{ padding: '10px 12px', background: selectedItem?.public_id === item.public_id ? '#FFF4E0' : '#fff', border: selectedItem?.public_id === item.public_id ? '2px solid #B8711A' : '1px solid #e5e5e5', borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#3A2010' }}>{item.date}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>카드뉴스</div>
                    </div>
                    {isAdmin && (
                      <button onClick={e => { e.stopPropagation(); handleDelete(item.public_id); }} disabled={deleting === item.public_id} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, padding: 2 }}>🗑</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
