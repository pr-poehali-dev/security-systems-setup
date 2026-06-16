import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/ca6da9d7-cd5f-4d59-b717-8b4d3f94444d/files/b831ef5f-fc34-409e-9cf4-4117800fe537.jpg';

const services = [
  { icon: 'Zap', title: 'Электромонтаж', desc: 'Внутренние и наружные электромонтажные работы любой сложности под ключ.' },
  { icon: 'Cctv', title: 'Видеонаблюдение', desc: 'Проектирование и монтаж систем видеонаблюдения для дома и бизнеса.' },
  { icon: 'Flame', title: 'Пожаротушение', desc: 'Системы пожарной сигнализации и пожаротушения. Лицензия на монтаж.' },
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

const Index = () => {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3 font-display font-bold text-2xl tracking-wide">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground neon-glow">
              <Icon name="Zap" size={20} />
            </span>
            <span>ООО «<span className="text-primary">СОМАКС</span>»</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">Услуги</a>
            <a href="#advantages" className="hover:text-primary transition-colors">Преимущества</a>
            <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
          </nav>
          <a href="tel:+79092057512">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Icon name="Phone" size={16} /> Позвонить
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center grid-bg pt-16">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
              <Icon name="Sparkles" size={14} /> ООО «Сомакс» — системы безопасности под ключ
            </span>
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[0.95] mb-6">
              ИНЖЕНЕРНЫЕ <span className="text-primary neon-text">СИСТЕМЫ</span> ДЛЯ ВАШЕГО ОБЪЕКТА
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-8">
              Электромонтаж, видеонаблюдение, пожаротушение, контроль доступа, водоснабжение
              и отопление. Поставка материалов и монтаж с гарантией качества.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contacts">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base neon-glow">
                  Оставить заявку <Icon name="ArrowRight" size={18} />
                </Button>
              </a>
              <a href="#services">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary font-semibold text-base">
                  Наши услуги
                </Button>
              </a>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
            <img
              src={HERO_IMG}
              alt="Монтаж инженерных систем"
              className="relative rounded-3xl border border-border w-full object-cover aspect-square animate-float-slow"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 container">
        <div className="max-w-2xl mb-14">
          <span className="text-primary font-display font-semibold tracking-widest uppercase text-sm">Что мы делаем</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">Полный спектр услуг</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative p-7 rounded-2xl bg-card border border-border hover:border-primary/60 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-secondary text-primary mb-5 group-hover:neon-glow transition-all">
                <Icon name={s.icon} size={26} />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section id="advantages" className="py-24 bg-secondary/30 border-y border-border">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <span className="text-accent font-display font-semibold tracking-widest uppercase text-sm">Почему мы</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">Преимущества компании</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <div
                key={a.title}
                className="p-7 rounded-2xl bg-card border border-border animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <Icon name={a.icon} size={32} className="text-accent mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-24 container">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-primary font-display font-semibold tracking-widest uppercase text-sm">Контакты</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-8">Свяжитесь с нами</h2>
            <div className="space-y-5">
              <a href="tel:+79092057512" className="flex items-center gap-4 group">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-primary group-hover:neon-glow transition-all">
                  <Icon name="Phone" size={22} />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground uppercase tracking-widest">Телефон</span>
                  <span className="font-display font-semibold text-xl">8 909 205-75-12</span>
                </span>
              </a>
              <a href="tel:+79205929959" className="flex items-center gap-4 group">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-primary group-hover:neon-glow transition-all">
                  <Icon name="Phone" size={22} />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground uppercase tracking-widest">Денис</span>
                  <span className="font-display font-semibold text-xl">8 920 592-99-59</span>
                </span>
              </a>
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-8 rounded-2xl bg-card border border-border"
          >
            <h3 className="font-display font-semibold text-2xl mb-6">Обратная связь</h3>
            <div className="space-y-4">
              <Input
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-secondary border-border h-12"
              />
              <Input
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-secondary border-border h-12"
              />
              <Textarea
                placeholder="Опишите задачу"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-secondary border-border min-h-28"
              />
              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold neon-glow">
                Отправить заявку <Icon name="Send" size={16} />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <Icon name="Zap" size={18} className="text-primary" />
            ООО «СОМАКС»
          </div>
          <p>© 2026 ООО «Сомакс» — электромонтаж и системы безопасности. Лицензия МЧС.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;