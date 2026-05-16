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
      </div>
      <span style={{ fontSize: 16, fontWeight: 800, color: C.gold, minWidth: 32, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function CardHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ background: `linear-gradient(135deg,${C.gold} 0%,${C.goldLight} 100%)`, padding: '22px 28px 20px' }}>
      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, letterSpacing: 2, marginBottom: 5 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>{title}</div>
    </div>
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
    }}>{children}</button>
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
  return <div style={{ padding: 24 }}>Unknown card type</div>;
}

function CardNewsViewer({ cards }: { cards: CardDef[] }) {
  const [current, setCurrent] = useState(0);
  const card = cards[current];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, fontFamily: "'Noto Sans KR',sans-serif" }}>
      <div style={{ color: C.muted, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Auckland Korean Methodist Church</div>
      <div style={{ width: '100%', maxWidth: 440, minHeight: 600, borderRadius: 28, overflow: 'hidden', background: C.cardBg, boxShadow: '0 8px 40px rgba(180,120,40,0.18)', display: 'flex', flexDirection: 'column', border: `1.5px solid ${C.border}` }}>
        {renderCard(card)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <NavBtn onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>&#8249;</NavBtn>
        <div style={{ display: 'flex', gap: 7 }}>
          {cards.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 30 : 10, height: 10, borderRadius: 99, background: i === current ? C.gold : C.border, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
          ))}
        </div>
        <NavBtn onClick={() => setCurrent(c => c + 1)} disabled={current === cards.length - 1}>&#8250;</NavBtn>
      </div>
      <div style={{ color: C.muted, fontSize: 14, letterSpacing: 2, fontWeight: 600 }}>{current + 1} / {cards.length}</div>
    </div>
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
  const [uploadJson, setUploadJson] = useState('');
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
    try { const res = await fetch(item.secure_url); setSelectedData(await res.json()); }
    catch (e) { console.error(e); } finally { setFetchingCard(false); }
  };

  useEffect(() => {
    if (list.length > 0 && !selectedId) loadCardNews(list[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); setUploadError('');
    if (!uploadDate) { setUploadError('날짜를 입력해주세요.'); return; }
    let parsed;
    try { parsed = JSON.parse(uploadJson); if (!Array.isArray(parsed)) throw new Error('array'); }
    catch { setUploadError('cards JSON이 배열 형태가 아닙니다.'); return; }
    setUploading(true);
    try {
      const res = await fetch('/api/upload-cardnews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cards: parsed, label: uploadLabel || uploadDate, date: uploadDate }) });
      if (res.ok) { setShowUpload(false); setUploadDate(''); setUploadLabel(''); setUploadJson(''); setSelectedId(null); await fetchList(); }
      else { const err = await res.json(); setUploadError(err.error || '업로드 실패'); }
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
          <h1 className="text-2xl font-bold text-church-navy">교회소식 / 주보</h1>
          <div className="flex gap-2">
            {isAdmin && <button onClick={() => setShowUpload(v => !v)} className="px-4 py-2 bg-church-gold text-white rounded-lg text-sm font-semibold hover:opacity-90">{showUpload ? '✕ 닫기' : '+ 카드뉴스 업로드'}</button>}
            {isAdmin ? <button onClick={() => signOut()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100">로그아웃</button>
              : <button onClick={() => signIn('google')} className="px-4 py-2 bg-church-navy text-white rounded-lg text-sm font-semibold hover:opacity-90">관리자 로그인</button>}
          </div>
        </div>
        {isAdmin && showUpload && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-bold text-church-navy mb-4">새 카드뉴스 업로드</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">날짜 (YYYY-MM-DD) *</label>
                  <input type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)} required className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-48">
                  <label className="text-sm font-semibold text-gray-600">제목/라벨 (선택)</label>
                  <input type="text" value={uploadLabel} onChange={e => setUploadLabel(e.target.value)} placeholder="예: 2026. 05. 17 제37권 20호" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">cards JSON 배열 *</label>
                <textarea value={uploadJson} onChange={e => setUploadJson(e.target.value)} placeholder='[{"id":1,"type":"cover",...}]' rows={8} required className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
                <p className="text-xs text-gray-400">카드뉴스 코드의 const cards = [...] 배열 내용을 붙여넣으세요.</p>
              </div>
              {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
              <button type="submit" disabled={uploading} className="self-start px-6 py-2 bg-church-gold text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">{uploading ? '업로드 중...' : '업로드'}</button>
            </form>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {loading ? <div className="text-center py-16 text-gray-400">불러오는 중...</div>
              : list.length === 0 ? <div className="text-center py-16 text-gray-400">등록된 카드뉴스가 없습니다.</div>
              : fetchingCard ? <div className="text-center py-16 text-gray-400">불러오는 중...</div>
              : selectedData ? <CardNewsViewer cards={selectedData.cards} />
              : null}
          </div>
          {list.length > 0 && (
            <div className="lg:w-64 flex flex-col gap-2">
              <h2 className="text-base font-bold text-church-navy mb-2">주보 아카이브</h2>
              {list.map(item => (
                <div key={item.public_id} className={`flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all border ${selectedId === item.public_id ? 'bg-amber-50 border-amber-400' : 'bg-white border-gray-200 hover:border-amber-300'}`} onClick={() => loadCardNews(item)}>
                  <div><div className="text-sm font-bold text-gray-800">{item.date}</div><div className="text-xs text-gray-400 mt-0.5">카드뉴스</div></div>
                  {isAdmin && <button onClick={e => { e.stopPropagation(); handleDelete(item); }} disabled={deleting === item.public_id} className="text-red-400 hover:text-red-600 text-sm p-1 disabled:opacity-40">{deleting === item.public_id ? '...' : '🗑'}</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CoverCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; tag?: string; title?: string; subtitle?: string; items?: { label: string; value: string }[]; contact?: string };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(145deg,#B8711A 0%,#E8A040 60%,#F5C060 100%)', padding: '44px 32px 38px', position: 'relative', overflow: 'hidden' }}>
        {[200, 140, 80].map((s, i) => <div key={i} style={{ position: 'absolute', right: -s / 3, top: -s / 3, width: s, height: s, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)' }} />)}
        {c.tag && <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.25)', borderRadius: 99, padding: '7px 18px', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 1.5, marginBottom: 28 }}>{c.tag}</div>}
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, letterSpacing: 3, marginBottom: 10 }}>{c.label}</div>
        <div style={{ color: '#fff', fontSize: 48, fontWeight: 800, lineHeight: 1.2, whiteSpace: 'pre-line' }}>{c.title}</div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 10 }}>{c.subtitle}</div>
      </div>
      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {c.items && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{c.items.map((it, i) => <div key={i} style={{ background: C.goldBg, borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${C.border}` }}><div style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 }}>{it.label}</div><div style={{ color: C.brownDark, fontSize: 16, fontWeight: 700 }}>{it.value}</div></div>)}</div>}
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1.5px solid ${C.border}`, color: C.muted, fontSize: 14, textAlign: 'center', lineHeight: 1.9 }}>{c.contact?.split('\n').map((l, i) => <span key={i}>{l}{i === 0 ? <br /> : null}</span>)}</div>
      </div>
    </div>
  );
}

function VisionCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; quote?: string; verse?: string; ref?: string; vision?: string };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title={`"${c.quote}"`} />
      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <div style={{ background: C.goldBg, borderLeft: `6px solid ${C.gold}`, borderRadius: '0 16px 16px 0', padding: '22px', color: C.brown, fontSize: 17, lineHeight: 2.0 }}>{c.verse}</div>
        <div style={{ color: C.muted, fontSize: 15, fontWeight: 600 }}>— {c.ref}</div>
        {c.vision && <div style={{ background: C.sky, border: `1.5px solid ${C.skyBorder}`, borderRadius: 16, padding: '20px 22px', color: '#1E4DAA', fontSize: 16, lineHeight: 1.85 }}><div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>교회 비전</div>{c.vision}</div>}
      </div>
    </div>
  );
}

function WorshipCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; items?: { time: string; icon: string }[]; sermon?: string; scripture?: string; leader?: string };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title="예배 시간 안내" />
      <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(c.items || []).map((it, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: i < 2 ? C.goldBg : C.sky, border: `1.5px solid ${i < 2 ? C.border : C.skyBorder}`, borderRadius: 14, padding: '16px 18px' }}><span style={{ fontSize: 26 }}>{it.icon}</span><span style={{ color: C.brownDark, fontSize: 17, fontWeight: 700 }}>{it.time}</span></div>)}
        <div style={{ marginTop: 6, background: `linear-gradient(135deg,${C.goldBg},#FFFBF0)`, border: `2px solid ${C.gold}`, borderRadius: 18, padding: '20px 22px' }}>
          <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>이번 주 말씀증언</div>
          <div style={{ color: C.brownDark, fontSize: 18, fontWeight: 800, lineHeight: 1.4, marginBottom: 8 }}>"{c.sermon}"</div>
          <div style={{ color: C.muted, fontSize: 15, fontWeight: 600 }}>{c.scripture} · {c.leader}</div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; subtitle?: string; steps?: { icon: string; name: string; detail: string }[] };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title={c.subtitle || ''} />
      <div style={{ padding: '18px 22px', flex: 1, overflowY: 'auto' }}>
        {(c.steps || []).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 46, flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: i % 2 === 0 ? C.goldBg : C.sky, border: `2px solid ${i % 2 === 0 ? C.gold : C.skyBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{s.icon}</div>
              {i < (c.steps?.length ?? 0) - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 10 }} />}
            </div>
            <div style={{ paddingLeft: 14, paddingBottom: i < (c.steps?.length ?? 0) - 1 ? 16 : 0, paddingTop: 7 }}>
              <div style={{ color: C.brownDark, fontSize: 17, fontWeight: 800, marginBottom: 3 }}>{s.name}</div>
              <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; events?: { date: string; title: string }[]; notice?: string };
  const colors = [C.gold, '#C0442A', '#2A6AE0', '#2A9E5A'];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title="다가오는 일정" />
      <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(c.events || []).map((ev, i) => <div key={i} style={{ display: 'flex', gap: 14, background: '#FAFAFA', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: '16px' }}><div style={{ minWidth: 62, background: colors[i % 4], borderRadius: 12, padding: '9px 4px', textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>{ev.date}</div><div style={{ color: C.brownDark, fontSize: 16, lineHeight: 1.7, whiteSpace: 'pre-line', fontWeight: 600 }}>{ev.title}</div></div>)}
        {c.notice && <div style={{ padding: '14px 16px', background: C.green, border: `1.5px solid ${C.greenBorder}`, borderRadius: 14, color: '#1A6A3A', fontSize: 15, fontWeight: 600 }}>{c.notice}</div>}
      </div>
    </div>
  );
}

function AttendanceCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; stats?: { name: string; value: number }[]; total?: number };
  const stats = c.stats || [];
  const maxVal = stats.length > 0 ? Math.max(...stats.map(s => s.value)) : 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title="지난 주일 현황" />
      <div style={{ padding: '24px 28px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28, background: `linear-gradient(135deg,${C.goldBg},#FFF0CC)`, borderRadius: 20, padding: '24px', border: `2px solid ${C.gold}` }}>
          <div style={{ color: C.muted, fontSize: 15, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>전체 출석</div>
          <div style={{ color: C.gold, fontSize: 68, fontWeight: 900, lineHeight: 1 }}>{c.total}</div>
          <div style={{ color: C.muted, fontSize: 17, marginTop: 4, fontWeight: 600 }}>명</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {stats.map((s, i) => <div key={i}><div style={{ marginBottom: 7 }}><span style={{ color: C.brownDark, fontSize: 16, fontWeight: 700 }}>{s.name}</span></div><ProgressBar value={s.value} max={maxVal + 5} /></div>)}
        </div>
      </div>
    </div>
  );
}

function OfferingCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; rows?: { type: string; names: string }[]; account?: string };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title="감사와 헌신" />
      <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(c.rows || []).map((row, i) => <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${C.border}` }}><div style={{ background: `linear-gradient(90deg,${C.gold},${C.goldLight})`, padding: '10px 16px', color: '#fff', fontSize: 15, fontWeight: 800 }}>{row.type}</div><div style={{ padding: '12px 16px', color: C.brownDark, fontSize: 15, lineHeight: 1.75, background: '#FAFAFA' }}>{row.names}</div></div>)}
        <div style={{ background: C.sky, border: `1.5px solid ${C.skyBorder}`, borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ color: '#2563AB', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>온라인 헌금 안내</div>
          <div style={{ color: '#1E3A6E', fontSize: 17, fontWeight: 800 }}>Payee: AKMC</div>
          <div style={{ color: '#2563AB', fontSize: 15, marginTop: 3 }}>Account: {c.account}</div>
        </div>
      </div>
    </div>
  );
}

function ClosingCard({ card }: { card: CardDef }) {
  const c = card as { label?: string; lines?: string[]; contact?: string; website?: string };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader label={c.label || ''} title="우리가 꿈꾸는 교회" />
      <div style={{ padding: '26px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(c.lines || []).map((line, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: i % 2 === 0 ? C.goldBg : C.sky, border: `1.5px solid ${i % 2 === 0 ? C.border : C.skyBorder}`, borderRadius: 14, padding: '16px 18px' }}><div style={{ width: 11, height: 11, borderRadius: '50%', background: i % 2 === 0 ? C.gold : '#2563AB', flexShrink: 0 }} /><span style={{ color: C.brownDark, fontSize: 16, fontWeight: 600, lineHeight: 1.55 }}>{line}</span></div>)}
        </div>
        <div style={{ marginTop: 24, paddingTop: 22, borderTop: `2px solid ${C.border}` }}>
          <div style={{ color: C.gold, fontSize: 21, fontWeight: 800, marginBottom: 7 }}>오클랜드감리교회</div>
          <div style={{ color: C.muted, fontSize: 15, lineHeight: 1.9, whiteSpace: 'pre-line' }}>{c.contact}</div>
          {c.website && <div style={{ color: C.gold, fontSize: 14, marginTop: 6, fontWeight: 600 }}>{c.website}</div>}
        </div>
      </div>
    </div>
  );
}
