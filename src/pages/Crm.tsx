import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API = 'https://functions.poehali.dev/3a14b500-0ba4-46f8-9905-024e17557ee9';

const STATUSES: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: 'Новый',        color: '#64748b', bg: '#f1f5f9' },
  called:    { label: 'Звонили',      color: '#2563eb', bg: '#eff6ff' },
  interested:{ label: 'Интерес',      color: '#059669', bg: '#ecfdf5' },
  callback:  { label: 'Перезвонить',  color: '#d97706', bg: '#fffbeb' },
  refused:   { label: 'Отказ',        color: '#dc2626', bg: '#fef2f2' },
  client:    { label: 'Клиент',       color: '#7c3aed', bg: '#f5f3ff' },
};

const EMPTY = {
  company_name: '', industry: '', address: '', contact_person: '',
  position: '', phone: '', phone2: '', email: '', status: 'new',
  call_result: '', comment: '', next_call_date: '',
};

type Contact = typeof EMPTY & { id?: number; created_at?: string };

export default function Crm() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState<Contact | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filterStatus !== 'all') p.set('status', filterStatus);
    if (search) p.set('search', search);
    const res = await fetch(`${API}?${p}`);
    setContacts(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus, search]);

  const openNew = () => { setModal({ ...EMPTY }); setIsNew(true); };
  const openEdit = (c: Contact) => { setModal({ ...c }); setIsNew(false); };
  const closeModal = () => setModal(null);

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    if (isNew) {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modal) });
    } else {
      await fetch(`${API}?id=${modal.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modal) });
    }
    setSaving(false);
    closeModal();
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить контакт?')) return;
    await fetch(`${API}?id=${id}`, { method: 'DELETE' });
    load();
  };

  const counts = Object.fromEntries(
    Object.keys(STATUSES).map(s => [s, contacts.filter(c => c.status === s).length])
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Golos Text', sans-serif" }}>

      {/* Шапка */}
      <div style={{ background: '#0a0f2e', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#0057ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Zap" size={18} />
          </div>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: 1 }}>
            ООО «СОМАКС» — <span style={{ color: '#4da6ff' }}>База контактов</span>
          </span>
        </div>
        <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>← На сайт</a>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 24px' }}>

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 24 }}>
          {Object.entries(STATUSES).map(([key, s]) => (
            <div
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
              style={{ background: filterStatus === key ? s.bg : '#fff', border: `2px solid ${filterStatus === key ? s.color : '#e2e8f0'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{counts[key] || 0}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Панель управления */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Icon name="Search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по компании, контакту, телефону..."
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {filterStatus !== 'all' && (
            <button onClick={() => setFilterStatus('all')} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13, color: '#64748b' }}>
              Все
            </button>
          )}
          <button
            onClick={openNew}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#0057ff', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}
          >
            <Icon name="Plus" size={16} /> Добавить
          </button>
        </div>

        {/* Таблица */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
              <Icon name="Users" size={40} />
              <div style={{ marginTop: 12 }}>Контактов не найдено</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Компания', 'Отрасль', 'ЛПР / Должность', 'Телефон', 'Статус', 'Следующий звонок', 'Результат', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => {
                  const st = STATUSES[c.status] || STATUSES.new;
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.company_name}</div>
                        {c.address && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{c.address}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{c.industry || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: '#0f172a' }}>{c.contact_person || '—'}</div>
                        {c.position && <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.position}</div>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <a href={`tel:${c.phone}`} style={{ color: '#0057ff', textDecoration: 'none', fontWeight: 500 }}>{c.phone}</a>
                        {c.phone2 && <div style={{ fontSize: 11, color: '#64748b' }}>{c.phone2}</div>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: c.next_call_date ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap' }}>
                        {c.next_call_date ? new Date(c.next_call_date).toLocaleDateString('ru-RU') : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748b', maxWidth: 180 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.call_result || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(c)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#475569' }}>
                            <Icon name="Pencil" size={13} />
                          </button>
                          <button onClick={() => remove(c.id!)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', color: '#dc2626' }}>
                            <Icon name="Trash2" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: 12, color: '#94a3b8', fontSize: 12, textAlign: 'right' }}>
          Всего записей: {contacts.length}
        </div>
      </div>

      {/* Модальное окно */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, margin: 0 }}>
                {isNew ? 'Новый контакт' : 'Редактировать'}
              </h2>
              <button onClick={closeModal} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <Icon name="X" size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {([
                ['company_name', 'Название компании *', 'text', '1/-1'],
                ['industry', 'Отрасль', 'text', ''],
                ['address', 'Адрес', 'text', '1/-1'],
                ['contact_person', 'ЛПР (ФИО)', 'text', ''],
                ['position', 'Должность', 'text', ''],
                ['phone', 'Телефон', 'text', ''],
                ['phone2', 'Телефон 2', 'text', ''],
                ['email', 'Email', 'text', ''],
                ['next_call_date', 'Дата следующего звонка', 'date', ''],
              ] as [keyof Contact, string, string, string][]).map(([field, label, type, span]) => (
                <div key={field} style={{ gridColumn: span || 'auto' }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>{label}</label>
                  <input
                    type={type}
                    value={(modal[field] as string) || ''}
                    onChange={e => setModal({ ...modal, [field]: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Статус</label>
                <select
                  value={modal.status}
                  onChange={e => setModal({ ...modal, status: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff' }}
                >
                  {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Результат звонка</label>
                <textarea
                  value={modal.call_result || ''}
                  onChange={e => setModal({ ...modal, call_result: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Комментарий</label>
                <textarea
                  value={modal.comment || ''}
                  onChange={e => setModal({ ...modal, comment: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#64748b' }}>
                Отмена
              </button>
              <button
                onClick={save}
                disabled={saving || !modal.company_name}
                style={{ padding: '10px 28px', borderRadius: 10, background: saving ? '#93c5fd' : '#0057ff', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}
