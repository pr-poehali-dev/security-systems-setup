import Icon from '@/components/ui/icon';

const PRODUCT_IMG =
  'https://cdn.poehali.dev/projects/ca6da9d7-cd5f-4d59-b717-8b4d3f94444d/files/d5a5fd72-d62c-4c12-8e4c-f79239e25c82.jpg';

const products = [
  { icon: 'ToggleLeft', title: 'Модульная автоматика', desc: 'Автоматические выключатели, УЗО, дифавтоматы, боксы и щитки.' },
  { icon: 'Plug', title: 'Установочное оборудование', desc: 'Розетки, выключатели, рамки — широкий выбор серий и производителей.' },
  { icon: 'Lightbulb', title: 'Лампы и светильники', desc: 'LED, люминесцентные, промышленные, декоративные — любой вид и мощность.' },
  { icon: 'Cable', title: 'Кабельно-проводниковая продукция', desc: 'ВВГ, NYM, ПВС, КВВ, КВВГ и другие марки кабеля в наличии и под заказ.' },
];

const benefits = [
  { icon: 'BadgeCheck', color: '#00b37a', title: 'Гарантия качества', desc: 'Работаем только с проверенными производителями и официальными дистрибьюторами.' },
  { icon: 'Percent', color: '#f59e0b', title: 'Гибкая система скидок', desc: 'Индивидуальные условия для постоянных клиентов и крупных заказов.' },
  { icon: 'Truck', color: '#3b82f6', title: 'Поставка на следующий день', desc: 'Ходовые позиции отгружаем на следующий день после оплаты.' },
  { icon: 'MapPin', color: '#ec4899', title: 'Доставка до объекта', desc: 'Привезём материалы прямо на стройплощадку или склад.' },
  { icon: 'Calculator', color: '#8b5cf6', title: 'Расчёт объектов', desc: 'Помогаем рассчитать инженерные сети по проекту строительства.' },
  { icon: 'RefreshCw', color: '#06b6d4', title: 'Подбор аналогов', desc: 'Найдём замену любой позиции по техническим характеристикам.' },
];

const Letter = () => {
  return (
    <>
      {/* Панель управления — только на экране */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0057ff] text-white font-bold text-sm shadow-lg hover:bg-[#0044cc] transition-colors"
        >
          <Icon name="Printer" size={16} /> Сохранить PDF
        </button>
        <a
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm border border-gray-200 hover:bg-gray-200 transition-colors"
        >
          ← На сайт
        </a>
      </div>

      {/* Само письмо */}
      <div style={{ background: '#f0f4f8', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Golos Text', sans-serif" }}>
        <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.10)' }}>

          {/* Шапка письма */}
          <div style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 100%)', padding: '40px 48px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,255,0.25) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: 100, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, position: 'relative' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0057ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Zap" size={20} />
              </div>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: 1.5 }}>ООО «СОМАКС»</span>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, border: '1px solid rgba(0,180,255,0.4)', color: '#00c8ff', fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
                Коммерческое предложение
              </div>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 34, color: '#fff', margin: '0 0 12px', lineHeight: 1.1 }}>
                Поставка электрооборудования<br />
                <span style={{ color: '#4da6ff' }}>и электроматериалов</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 480 }}>
                Широкий ассортимент от ведущих производителей, конкурентные цены и надёжные сроки поставки для вашего объекта.
              </p>
            </div>
          </div>

          {/* Приветствие */}
          <div style={{ padding: '32px 48px 0', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.8, margin: '0 0 24px' }}>
              Уважаемые партнёры,
            </p>
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.8, margin: '0 0 24px' }}>
              Компания <strong>ООО «Сомакс»</strong> предлагает вам сотрудничество в области поставок электрооборудования и электроматериалов. Мы являемся надёжным поставщиком для строительных организаций, электромонтажных компаний и розничных клиентов.
            </p>

            {/* Фото продукции */}
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
              <img src={PRODUCT_IMG} alt="Электрооборудование" style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
            </div>
          </div>

          {/* Ассортимент */}
          <div style={{ padding: '32px 48px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", color: '#0057ff', fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Наш ассортимент</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 24, margin: '0 0 24px', color: '#0f172a' }}>Что мы поставляем</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {products.map((p) => (
                <div key={p.title} style={{ padding: '20px 22px', borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0057ff', flexShrink: 0 }}>
                    <Icon name={p.icon} size={18} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#0f172a' }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: '14px 20px', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: 13 }}>
              <strong>И многое другое:</strong> прожекторы, щитовое оборудование, заземление, кабельные каналы, крепёж, инструмент и сопутствующие материалы.
            </div>
          </div>

          {/* Преимущества */}
          <div style={{ padding: '32px 48px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", color: '#0057ff', fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Почему выбирают нас</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 24, margin: '0 0 24px', color: '#0f172a' }}>Наши преимущества</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {benefits.map((b) => (
                <div key={b.title} style={{ padding: '18px 18px', borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: b.color }}>
                    <Icon name={b.icon} size={20} />
                  </div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#0f172a' }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA — призыв к действию */}
          <div style={{ padding: '32px 48px', background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 100%)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>
              Готовы обсудить ваш проект?
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Пришлите спецификацию или список материалов — мы подготовим коммерческое предложение в течение дня и поможем с подбором аналогов.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              <a href="tel:+79092057512" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: '#0057ff', color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
                <Icon name="Phone" size={16} /> 8 909 205-75-12
              </a>
              <a href="tel:+79205929959" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Icon name="Phone" size={16} /> 8 920 592-99-59 (Денис)
              </a>
            </div>

            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
              ООО «Сомакс» · Электрооборудование и монтаж · Лицензия МЧС
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap');
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; background: #f0f4f8 !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Letter;
