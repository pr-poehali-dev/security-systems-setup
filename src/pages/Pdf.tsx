import Icon from '@/components/ui/icon';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/ca6da9d7-cd5f-4d59-b717-8b4d3f94444d/files/b831ef5f-fc34-409e-9cf4-4117800fe537.jpg';

const services = [
  { icon: 'Zap', title: 'Электромонтаж', desc: 'Внутренние и наружные электромонтажные работы любой сложности под ключ.' },
  { icon: 'Cctv', title: 'Видеонаблюдение', desc: 'Проектирование и монтаж систем видеонаблюдения для дома и бизнеса.' },
  { icon: 'Flame', title: 'Пожаротушение', desc: 'Системы пожарной сигнализации и пожаротушения. Лицензия МЧС на монтаж.' },
  { icon: 'KeyRound', title: 'Контроль доступа', desc: 'Установка и настройка СКУД: домофоны, турникеты, электронные замки.' },
  { icon: 'Droplets', title: 'Водоснабжение', desc: 'Внутренние и наружные сети водоснабжения и канализации.' },
  { icon: 'ThermometerSun', title: 'Отопление и вентиляция', desc: 'Монтаж систем отопления и вентиляции для комфортного микроклимата.' },
];

const advantages = [
  { icon: 'BadgeCheck', title: 'Лицензия МЧС', desc: 'Официальная лицензия на монтаж пожарной сигнализации.' },
  { icon: 'TrendingDown', title: 'Конкурентные цены', desc: 'Поставка материалов электрики и слаботочки по выгодным ценам.' },
  { icon: 'ShieldCheck', title: 'Качество работ', desc: 'Сертифицированные материалы и гарантия на все виды работ.' },
  { icon: 'Wrench', title: 'Полный цикл', desc: 'От проектирования и поставки до монтажа и обслуживания.' },
];

const Pdf = () => {
  return (
    <>
      {/* Кнопка печати — только на экране, скрыта при печати */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00e5ff] text-[#0a0f1e] font-bold text-sm shadow-lg hover:bg-[#00c8e0] transition-colors"
        >
          <Icon name="Download" size={16} /> Сохранить PDF
        </button>
        <a
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition-colors"
        >
          ← На сайт
        </a>
      </div>

      <div
        id="pdf-root"
        style={{ fontFamily: "'Golos Text', sans-serif", background: '#fff', color: '#0a0f1e' }}
      >
        {/* ── СТРАНИЦА 1: Обложка ── */}
        <div className="pdf-page" style={pageStyle}>
          <div style={{ background: '#0a0f1e', height: '100%', padding: '60px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            {/* Декор */}
            <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)' }} />

            {/* Шапка */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Zap" size={24} />
              </div>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: 2 }}>ООО «СОМАКС»</span>
            </div>

            {/* Центр */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, border: '1px solid rgba(0,229,255,0.4)', color: '#00e5ff', fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
                  Системы безопасности под ключ
                </div>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 52, lineHeight: 1, color: '#fff', margin: '0 0 24px' }}>
                  ИНЖЕНЕРНЫЕ <span style={{ color: '#00e5ff' }}>СИСТЕМЫ</span> ДЛЯ ВАШЕГО ОБЪЕКТА
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.6 }}>
                  Электромонтаж, видеонаблюдение, пожаротушение, контроль доступа, водоснабжение и отопление. Поставка материалов и монтаж с гарантией качества.
                </p>
              </div>
              <div>
                <img src={HERO_IMG} alt="Монтаж инженерных систем" style={{ width: '100%', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover', aspectRatio: '1' }} />
              </div>
            </div>

            {/* Низ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>© 2026 ООО «Сомакс»</span>
              <div style={{ display: 'flex', gap: 24 }}>
                <span style={{ color: '#00e5ff', fontSize: 13, fontWeight: 600 }}>8 909 205-75-12</span>
                <span style={{ color: '#00e5ff', fontSize: 13, fontWeight: 600 }}>8 920 592-99-59</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── СТРАНИЦА 2: Услуги ── */}
        <div className="pdf-page" style={pageStyle}>
          <div style={{ padding: '60px 64px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", color: '#00e5ff', fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Что мы делаем</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 40, margin: 0 }}>Полный спектр услуг</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, flex: 1 }}>
              {services.map((s) => (
                <div key={s.title} style={{ padding: 28, borderRadius: 16, background: '#f4f7fb', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e8f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#0088aa' }}>
                    <Icon name={s.icon} size={22} />
                  </div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>ООО «Сомакс» — стр. 2</div>
          </div>
        </div>

        {/* ── СТРАНИЦА 3: Преимущества + Контакты ── */}
        <div className="pdf-page" style={pageStyle}>
          <div style={{ padding: '60px 64px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Преимущества */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", color: '#ff6400', fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Почему мы</div>
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 36, margin: 0 }}>Преимущества компании</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {advantages.map((a) => (
                  <div key={a.title} style={{ padding: 28, borderRadius: 16, background: '#f4f7fb', border: '1px solid #e2e8f0', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ color: '#ff6400', flexShrink: 0, marginTop: 2 }}>
                      <Icon name={a.icon} size={28} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{a.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Контакты */}
            <div style={{ background: '#0a0f1e', borderRadius: 20, padding: '36px 40px', color: '#fff' }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", color: '#00e5ff', fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>Контакты</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 26 }}>ООО «СОМАКС»</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>Электромонтаж и системы безопасности</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff' }}>
                      <Icon name="Phone" size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2 }}>Телефон</div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16 }}>8 909 205-75-12</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff' }}>
                      <Icon name="Phone" size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2 }}>Денис</div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16 }}>8 920 592-99-59</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Электромонтаж', 'Видеонаблюдение', 'Пожаротушение', 'СКУД'].map(tag => (
                    <span key={tag} style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(0,229,255,0.3)', color: '#00e5ff', fontSize: 12, width: 'fit-content' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>ООО «Сомакс» — стр. 3</div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Golos+Text:wght@400;500;600&display=swap');
        .pdf-page { width: 297mm; min-height: 210mm; background: #fff; }
        @media print {
          @page { size: A4 landscape; margin: 0; }
          .pdf-page { page-break-after: always; width: 297mm; height: 210mm; overflow: hidden; }
          body { margin: 0; }
        }
      `}</style>
    </>
  );
};

const pageStyle: React.CSSProperties = {
  width: '297mm',
  minHeight: '210mm',
  background: '#fff',
  boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
  marginBottom: 32,
};

export default Pdf;
