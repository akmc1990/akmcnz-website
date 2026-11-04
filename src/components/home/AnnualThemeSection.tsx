export default function AnnualThemeSection() {
  return (
    <section className="py-20 bg-[#3d5d96] text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3">2026년 표어</p>
        <h2
          className="font-black uppercase leading-none mb-8"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
        >
          믿음이 보이는 교회
        </h2>
        <blockquote className="text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto border-l-4 border-white/60 pl-6 text-left">
          &ldquo;이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라 어떤 사람은 말하기를 너는 믿음이 있고 나는 행함이 있으니 행함이 없는 네 믿음을 내게 보이라 나는 행함으로 내 믿음을 네게 보이리라 하니라&rdquo;
        </blockquote>
        <p className="text-white/70 text-sm font-bold uppercase tracking-wide mt-4">행 2:17-25</p>
      </div>
    </section>
  )
}
