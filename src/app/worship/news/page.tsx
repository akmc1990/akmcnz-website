'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const C = {
    gold: '#B8711A', goldLight: '#E8A040', goldBg: '#FFF4E0',
    cardBg: '#FFFFFF', brown: '#5C3A1E',
    brownDark: '#3A2010', muted: '#8B6A4A', border: '#EDD9B8',
    sky: '#EEF6FF', skyBorder: '#BDDCF7', green: '#EAF7EF', greenBorder: '#A8DABC',
};

interface CardNewsItem { public_id: string; secure_url: string; created_at: string; date: string; }
interface CardData { cards: CardDef[]; label: string; date: string; }
interface CardDef { id: number; type: string; [key: string]: unknown; }

function ProgressBar({ value, max }: { value: number; max: number }) {
    const pct = Math.round((value / max) * 100);
    return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 10, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${C.goldLight},${C.gold})`, borderRadius: 99 }} />
                  </div>div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.gold, minWidth: 32, textAlign: 'right' }}>{value}</span>span>
          </div>div>
        );
}

function CardHeader({ label, title }: { label: string; title: string }) {
    return (
          <div style={{ background: `linear-gradient(135deg,${C.gold} 0%,${C.goldLight} 100%)`, padding: '22px 28px 20px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, letterSpacing: 2, marginBottom: 5 }}>{label}</div>div>
                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>{title}</div>div>
          </div>div>
        );
}

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: ReactNode }) {
    return (
          <button onClick={onClick} disabled={disabled} style={{
                  width: 50, height: 50, borderRadius: '50%',
                  border: `2px solid ${disabled ? C.border : C.gold}`,
                  background: disabled ? 'transparent' : C.goldBg,
                  color: disabled ? C.border : C.gold, fontSize: 26,
                  cursor: disabled ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, transition: 'all 0.2s',
          }}>{children}</button>button>
        );
}

function renderCard(card: CardDef) {
    if (card.type === 'cover') return <CoverCard card={card} />;
    if (card.type === 'vision') return <VisionCard card={card} />;
    if (card.type === 'worship') return <WorshipCard card={card} />;
    if (card.type === 'order') return <OrderCard card={card} />;
    if (card.type === 'events') return <EventsCard card={card} />;
    if (card.type === 'attendance') return <AttendanceCard card={card} />;
    if (card.type === 'offering') return <OfferingCard card={card} />;
    if (card.type === 'closing') return <ClosingCard card={card} />;
    return <div style={{ padding: 24 }}>Unknown card type: {card.type}</div>div>;
}

function CardNewsViewer({ cards }: { cards: CardDef[] }) {
    const [current, setCurrent] = useState(0);
    const card = cards[current];
    return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, fontFamily: "'Noto Sans KR',sans-serif" }}>
                  <div style={{ color: C.muted, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Auckland Korean Methodist Church</div>div>
                  <div style={{ width: '100%', maxWidth: 440, minHeight: 600, borderRadius: 28, overflow: 'hidden', background: C.cardBg, boxShadow: '0 8px 40px rgba(180,120,40,0.18)', display: 'flex', flexDirection: 'column', border: `1.5px solid ${C.border}` }}>
                    {renderCard(card)}
                  </div>div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <NavBtn onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>&#8249;</NavBtn>NavBtn>
                            <div style={{ display: 'flex', gap: 7 }}>
                              {cards.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 30 : 10, height: 10, borderRadius: 99, background: i === current ? C.gold : C.border, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
                      ))}
                            </div>div>
                            <NavBtn onClick={() => setCurrent(c => c + 1)} disabled={current === cards.length - 1}>&#8250;</NavBtn>NavBtn>
                  </div>div>
                  <div style={{ color: C.muted, fontSize: 14, letterSpacing: 2, fontWeight: 600 }}>{current + 1} / {cards.length}</div>div>
          </div>div>
        );
}

export default function NewsPage() {
    const { data: session } = useSession();
    const isAdmin = !!session?.user;
    const [list, setList] = useState<CardNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedData, setSelectedData] = useState<CardData | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [fetchingCard, setFetchingCard] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadDate, setUploadDate] = useState('');
    const [uploadLabel, setUploadLabel] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
        setLoading(true);
        try {
                const res = await fetch('/api/cardnews');
                if (res.ok) { const d = await res.json(); setList(d.cardnews || []); }
        } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadCardNews = async (item: CardNewsItem) => {
        if (selectedId === item.public_id) return;
        setFetchingCard(true); setSelectedId(item.public_id);
        try {
                const res = await fetch(item.secure_url);
                const text = await res.text();
                // Try JSON parse first (new format), fallback gracefully
          const parsed = JSON.parse(text);
                setSelectedData(parsed);
        }
        catch (e) { console.error(e); setSelectedData(null); } finally { setFetchingCard(false); }
  };

  useEffect(() => {
        if (list.length > 0 && !selectedId) loadCardNews(list[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault(); setUploadError('');
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
                          setSelectedId(null); await fetchList();
                } else {
                          const err = await res.json(); setUploadError(err.error || '업로드 실패');
                }
        } catch { setUploadError('오류 발생'); } finally { setUploading(false); }
  };

  const handleDelete = async (item: CardNewsItem) => {
        if (!confirm(`${item.date} 카드뉴스를 삭제하시겠습니까?`)) return;
        setDeleting(item.public_id);
        try {
                const res = await fetch('/api/delete-cardnews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ public_id: item.public_id }) });
                if (res.ok) { setList(p => p.filter(i => i.public_id !== item.public_id)); if (selectedId === item.public_id) { setSelectedId(null); setSelectedData(null); } }
        } catch { alert('삭제 오류'); } finally { setDeleting(null); }
  };

  return (
        <div className="min-h-screen bg-gray-50">
              <div className="max-w-5xl mx-auto px-4 py-8">
                      <div className="flex items-center justify-between mb-8">
                                <h1 className="text-2xl font-bold text-church-navy">교회소식 / 주보</h1>h1>
                                <div className="flex gap-2">
                                  {isAdmin && <button onClick={() => setShowUpload(v => !v)} className="px-4 py-2 bg-church-gold text-white rounded-lg text-sm font-semibold hover:opacity-90">{showUpload ? '✕ 닫기' : '+ 카드뉴스 업로드'}</button>button>}
                                  {isAdmin ? <button onClick={() => signOut()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100">로그아웃</button>button>
                                              : <button onClick={() => signIn('google')} className="px-4 py-2 bg-church-navy text-white rounded-lg text-sm font-semibold hover:opacity-90">관리자 로그인</button>button>}
                                </div>div>
                      </div>div>
                {isAdmin && showUpload && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                                <h2 className="text-lg font-bold text-church-navy mb-4">새 카드뉴스 업로드</h2>h2>
                                <form onSubmit={handleUpload} className="flex flex-col gap-4">
                                              <div className="flex gap-4 flex-wrap">
                                                              <div className="flex flex-col gap-1">
                                                                                <label className="text-sm font-semibold text-gray-600">날짜 (YYYY-MM-DD) *</label>label>
                                                                                <input type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)} required className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                                              </div>div>
                                                              <div className="flex flex-col gap-1 flex-1 min-w-48">
                                                                                <label className="text-sm font-semibold text-gray-600">제목/라벨 (선택)</label>label>
                                                                                <input type="text" value={uploadLabel} onChange={e => setUploadLabel(e.target.value)} placeholder="예: 2026. 05. 17 제37권 20호" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                                              </div>div>
                                              </div>div>
                                              <div className="flex flex-col gap-1">
                                                              <label className="text-sm font-semibold text-gray-600">.jsx 파일 선택 *</label>label>
                                                              <input
                                                                                  type="file"
                                                                                  accept=".jsx,.js"
                                                                                  onChange={e => setUploadFile(e.target.files?.[0] ?? null)}
                                                                                  required
                                                                                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                                                />
                                                              <p className="text-xs text-gray-400">카드뉴스 .jsx 파일을 선택하세요. 파일 내에 <code>const cards = [...]</code>code> 배열이 있어야 합니다.</p>p>
                                              </div>div>
                                  {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>p>}
                                              <button type="submit" disabled={uploading} className="self-start px-6 py-2 bg-church-gold text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">{uploading ? '업로드 중...' : '업로드'}</button>button>
                                </form>form>
                    </div>div>
                      )}
                      <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1">
                                  {loading ? <div className="text-center py-16 text-gray-400">불러오는 중...</div>div>
                                              : list.length === 0 ? <div className="text-center py-16 text-gray-400">등록된 카드뉴스가 없습니다.</div>div>
                                              : fetchingCard ? <div className="text-center py-16 text-gray-400">불러오는 중...</div>div>
                                              : selectedData ? <CardNewsViewer cards={selectedData.cards} />
                                              : <div className="text-center py-16 text-gray-400">카드뉴스를 선택해주세요.</div>div>}
                                </div>div>
                        {list.length > 0 && (
                      <div className="lg:w-64 flex flex-col gap-2">
                                    <h2 className="text-base font-bold text-church-navy mb-2">주보 아카이브</h2>h2>
                        {list.map(item => (
                                        <div key={item.public_id} className={`flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all border ${selectedId === item.public_id ? 'bg-amber-50 border-amber-400' : 'bg-white border-gray-200 hover:border-amber-300'}`} onClick={() => loadCardNews(item)}>
                                                          <div><div className="text-sm font-bold text-gray-800">{item.date}</div>div><div className="text-xs text-gray-400 mt-0.5">카드뉴스</div>div></div>div>
                                          {isAdmin && <button onClick={e => { e.stopPropagation(); handleDelete(item); }} disabled={deleting === item.public_id} className="text-red-400 hover:text-red-600 text-sm p-1 disabled:opacity-40">{deleting === item.public_id ? '...' : '🗑'}</button>button>}
                                        </div>div>
                                      ))}
                      </div>div>
                                )}
                      </div>div>
              </div>div>
        </div>div>
      );
}

function CoverCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; tag?: string; title?: string; subtitle?: string; items?: { label: string; value: string }[]; contact?: string };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'linear-gradient(145deg,#B8711A 0%,#E8A040 60%,#F5C060 100%)', padding: '44px 32px 38px', position: 'relative', overflow: 'hidden' }}>
                  {[200, 140, 80].map((s, i) => <div key={i} style={{ position: 'absolute', right: -s / 3, top: -s / 3, width: s, height: s, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)' }} />)}
                  {c.tag && <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.25)', borderRadius: 99, padding: '7px 18px', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 1.5, marginBottom: 28 }}>{c.tag}</div>div>}
                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, letterSpacing: 3, marginBottom: 10 }}>{c.label}</div>div>
                        <div style={{ color: '#fff', fontSize: 48, fontWeight: 800, lineHeight: 1.2, whiteSpace: 'pre-line' }}>{c.title}</div>div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 10 }}>{c.subtitle}</div>div>
                </div>div>
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {c.items && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{c.items.map((it, i) => <div key={i} style={{ background: C.goldBg, borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${C.border}` }}><div style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 }}>{it.label}</div>div><div style={{ color: C.brownDark, fontSize: 16, fontWeight: 700 }}>{it.value}</div>div></div>div>)}</div>div>}
                        <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1.5px solid ${C.border}`, color: C.muted, fontSize: 14, textAlign: 'center', lineHeight: 1.9 }}>{c.contact?.split('\n').map((l, i) => <span key={i}>{l}{i === 0 ? <br /> : null}</span>span>)}</div>div>
                </div>div>
          </div>div>
        );
}

function VisionCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; quote?: string; verse?: string; ref?: string; vision?: string };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader label={c.label || ''} title={`"${c.quote}"`} />
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                        <div style={{ background: C.goldBg, borderLeft: `6px solid ${C.gold}`, borderRadius: '0 16px 16px 0', padding: '22px', color: C.brown, fontSize: 17, lineHeight: 2.0 }}>{c.verse}</div>div>
                        <div style={{ color: C.muted, fontSize: 15, fontWeight: 600 }}>— {c.ref}</div>div>
                  {c.vision && <div style={{ background: C.sky, border: `1.5px solid ${C.skyBorder}`, borderRadius: 16, padding: '20px 22px', color: '#1E4DAA', fontSize: 16, lineHeight: 1.85 }}><div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>교회 비전</div>div>{c.vision}</div>div>}
                </div>div>
          </div>div>
        );
}

function WorshipCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; title?: string; preacher?: string; scripture?: string; items?: { label: string; value: string }[] };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader label={c.label || ''} title={c.title || ''} />
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {c.preacher && <div style={{ background: C.goldBg, borderRadius: 14, padding: '14px 18px', border: `1.5px solid ${C.border}` }}><div style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>설교자</div>div><div style={{ color: C.brownDark, fontSize: 18, fontWeight: 700 }}>{c.preacher}</div>div></div>div>}
                  {c.scripture && <div style={{ background: C.sky, border: `1.5px solid ${C.skyBorder}`, borderRadius: 14, padding: '14px 18px' }}><div style={{ color: '#1E4DAA', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>본문</div>div><div style={{ color: '#1E4DAA', fontSize: 16, fontWeight: 600 }}>{c.scripture}</div>div></div>div>}
                  {c.items && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{c.items.map((it, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}><span style={{ color: C.muted, fontSize: 14 }}>{it.label}</span>span><span style={{ color: C.brownDark, fontSize: 14, fontWeight: 600 }}>{it.value}</span>span></div>div>)}</div>div>}
                </div>div>
          </div>div>
        );
}

function OrderCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; title?: string; items?: { time?: string; name: string; person?: string }[] };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader label={c.label || ''} title={c.title || '예배 순서'} />
                <div style={{ padding: '28px', flex: 1 }}>
                  {c.items && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{c.items.map((it, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>{it.time && <span style={{ color: C.muted, fontSize: 12, minWidth: 40 }}>{it.time}</span>span>}<span style={{ color: C.brownDark, fontSize: 15, flex: 1 }}>{it.name}</span>span>{it.person && <span style={{ color: C.muted, fontSize: 13 }}>{it.person}</span>span>}</div>div>)}</div>div>}
                </div>div>
          </div>div>
        );
}

function EventsCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; title?: string; items?: { date: string; title: string; desc?: string }[] };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader label={c.label || ''} title={c.title || '교회 소식'} />
                <div style={{ padding: '28px', flex: 1 }}>
                  {c.items && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{c.items.map((it, i) => <div key={i} style={{ background: C.goldBg, borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${C.border}` }}><div style={{ display: 'flex', gap: 10, marginBottom: 4 }}><span style={{ background: C.gold, color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{it.date}</span>span></div>div><div style={{ color: C.brownDark, fontSize: 15, fontWeight: 700 }}>{it.title}</div>div>{it.desc && <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{it.desc}</div>div>}</div>div>)}</div>div>}
                </div>div>
          </div>div>
        );
}

function AttendanceCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; title?: string; total?: number; max?: number; items?: { label: string; value: number }[] };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader label={c.label || ''} title={c.title || '출석 현황'} />
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {c.total !== undefined && c.max !== undefined && <ProgressBar value={c.total} max={c.max} />}
                  {c.items && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{c.items.map((it, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: C.goldBg, borderRadius: 12, border: `1px solid ${C.border}` }}><span style={{ color: C.muted, fontSize: 14 }}>{it.label}</span>span><span style={{ color: C.brownDark, fontSize: 15, fontWeight: 700 }}>{it.value}명</span>span></div>div>)}</div>div>}
                </div>div>
          </div>div>
        );
}

function OfferingCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; title?: string; items?: { label: string; value: string }[]; note?: string };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader label={c.label || ''} title={c.title || '헌금 현황'} />
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {c.items && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{c.items.map((it, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: i % 2 === 0 ? C.goldBg : C.green, borderRadius: 12, border: `1px solid ${i % 2 === 0 ? C.border : C.greenBorder}` }}><span style={{ color: C.muted, fontSize: 14 }}>{it.label}</span>span><span style={{ color: C.brownDark, fontSize: 15, fontWeight: 700 }}>{it.value}</span>span></div>div>)}</div>div>}
                  {c.note && <div style={{ marginTop: 8, color: C.muted, fontSize: 13, textAlign: 'center' }}>{c.note}</div>div>}
                </div>div>
          </div>div>
        );
}

function ClosingCard({ card }: { card: CardDef }) {
    const c = card as { label?: string; message?: string; verse?: string; ref?: string; contact?: string };
    return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: `linear-gradient(160deg,${C.goldBg} 0%,#fff 100%)` }}>
                <div style={{ padding: '36px 28px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center' }}>
                        <div style={{ width: 60, height: 4, background: `linear-gradient(90deg,${C.goldLight},${C.gold})`, borderRadius: 99 }} />
                  {c.message && <div style={{ color: C.brownDark, fontSize: 20, fontWeight: 800, lineHeight: 1.5 }}>{c.message}</div>div>}
                  {c.verse && <div style={{ background: C.goldBg, borderLeft: `4px solid ${C.gold}`, borderRadius: '0 12px 12px 0', padding: '16px 20px', color: C.brown, fontSize: 15, lineHeight: 1.9, textAlign: 'left', width: '100%' }}>{c.verse}</div>div>}
                  {c.ref && <div style={{ color: C.muted, fontSize: 14, fontWeight: 600 }}>— {c.ref}</div>div>}
                  {c.contact && <div style={{ marginTop: 8, color: C.muted, fontSize: 13, lineHeight: 1.8 }}>{c.contact.split('\n').map((l, i) => <span key={i}>{l}<br /></span>span>)}</div>div>}
                        <div style={{ width: 60, height: 4, background: `linear-gradient(90deg,${C.gold},${C.goldLight})`, borderRadius: 99 }} />
                </div>div>
          </div>div>
        );
}</div>
