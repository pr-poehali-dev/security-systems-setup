import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

const API = 'https://functions.poehali.dev/a425146a-ba84-4d1c-8403-e14857072e16';

type Obj = { id: number; name: string; address: string };
type Material = { id: number; name: string; unit: string; category: string };
type Movement = {
  id: number; object_id: number; material_id: number; movement_type: 'in' | 'out';
  quantity: number; doc_number: string; note: string; moved_at: string;
  object_name: string; material_name: string; unit: string;
};
type Balance = {
  material_id: number; name: string; unit: string; category: string;
  total_in: number; total_out: number; balance: number;
};

const EMPTY_MOV = { object_id: '', material_id: '', movement_type: 'in', quantity: '', doc_number: '', note: '', moved_at: new Date().toISOString().slice(0, 10) };

const fmt = (n: number) => Number(n).toLocaleString('ru-RU', { maximumFractionDigits: 3 });
const fmtDate = (s: string) => s ? new Date(s).toLocaleDateString('ru-RU') : '—';

export default function Warehouse() {
  const [tab, setTab] = useState<'journal' | 'balance' | 'refs'>('journal');
  const [objects, setObjects] = useState<Obj[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [balance, setBalance] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterObj, setFilterObj] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [modal, setModal] = useState<typeof EMPTY_MOV | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [newObj, setNewObj] = useState({ name: '', address: '' });
  const [newMat, setNewMat] = useState({ name: '', unit: 'шт', category: '' });

  const loadRefs = async () => {
    const [o, m] = await Promise.all([
      fetch(`${API}/objects`).then(r => r.json()),
      fetch(`${API}/materials`).then(r => r.json()),
    ]);
    setObjects(o); setMaterials(m);
  };

  const loadMovements = async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filterObj) p.set('object_id', filterObj);
    if (filterType !== 'all') p.set('movement_type', filterType);
    const data = await fetch(`${API}?${p}`).then(r => r.json());
    setMovements(data);
    setLoading(false);
  };

  const loadBalance = async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filterObj) p.set('object_id', filterObj);
    const data = await fetch(`${API}/balance?${p}`).then(r => r.json());
    setBalance(data);
    setLoading(false);
  };

  useEffect(() => { loadRefs(); }, []);

  useEffect(() => {
    if (tab === 'journal') loadMovements();
    if (tab === 'balance') loadBalance();
  }, [tab, filterObj, filterType]);

  const exportJournal = () => {
    const rows = movements.map(m => ({
      'Дата': fmtDate(m.moved_at),
      'Объект': m.object_name,
      'Материал': m.material_name,
      'Ед. изм.': m.unit,
      'Тип': m.movement_type === 'in' ? 'Приход' : 'Расход',
      'Количество': Number(m.quantity),
      'Документ': m.doc_number || '',
      'Примечание': m.note || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 24 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Журнал движений');
    XLSX.writeFile(wb, `Журнал_материалов_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`);
  };

  const exportBalance = () => {
    const rows = balance.map(b => ({
      'Категория': b.category || '',
      'Материал': b.name,
      'Ед. изм.': b.unit,
      'Приход': Number(b.total_in),
      'Расход': Number(b.total_out),
      'Остаток': Number(b.balance),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 20 }, { wch: 34 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    const objName = objects.find(o => String(o.id) === filterObj)?.name || 'Все объекты';
    XLSX.utils.book_append_sheet(wb, ws, 'Остатки');
    XLSX.writeFile(wb, `Остатки_${objName}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`);
  };

  const openNew = () => { setModal({ ...EMPTY_MOV }); setEditId(null); };
  const openEdit = (m: Movement) => {
    setModal({ object_id: String(m.object_id), material_id: String(m.material_id), movement_type: m.movement_type, quantity: String(m.quantity), doc_number: m.doc_number || '', note: m.note || '', moved_at: m.moved_at?.slice(0, 10) || '' });
    setEditId(m.id);
  };

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    const body = { ...modal, object_id: Number(modal.object_id), material_id: Number(modal.material_id), quantity: Number(modal.quantity) };
    if (editId) {
      await fetch(`${API}?id=${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setSaving(false); setModal(null);
    if (tab === 'journal') loadMovements(); else loadBalance();
  };

  const addObj = async () => {
    if (!newObj.name) return;
    await fetch(`${API}/objects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newObj) });
    setNewObj({ name: '', address: '' }); loadRefs();
  };
  const addMat = async () => {
    if (!newMat.name) return;
    await fetch(`${API}/materials`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newMat) });
    setNewMat({ name: '', unit: 'шт', category: '' }); loadRefs();
  };

  const totalIn = movements.filter(m => m.movement_type === 'in').reduce((s, m) => s + Number(m.quantity), 0);
  const totalOut = movements.filter(m => m.movement_type === 'out').reduce((s, m) => s + Number(m.quantity), 0);

  const inp = (style?: object) => ({ ...{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, background: '#fff' }, ...style });
  const sel = inp;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Golos Text', sans-serif" }}>

      {/* Шапка */}
      <div style={{ background: '#0a0f2e', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#0057ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Package" size={18} />
          </div>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: 1 }}>
            ООО «СОМАКС» — <span style={{ color: '#4da6ff' }}>Учёт материалов</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/crm" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>База контактов</a>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>← На сайт</a>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 24px' }}>

        {/* Вкладки */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0', width: 'fit-content' }}>
          {([['journal', 'Журнал движений', 'ArrowLeftRight'], ['balance', 'Остатки на объекте', 'BarChart2'], ['refs', 'Справочники', 'Settings']] as const).map(([key, label, icon]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: tab === key ? 600 : 400, background: tab === key ? '#0057ff' : 'transparent', color: tab === key ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
              <Icon name={icon} size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Фильтры (журнал и остатки) */}
        {tab !== 'refs' && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={filterObj} onChange={e => setFilterObj(e.target.value)} style={{ ...sel(), width: 280 }}>
              <option value="">Все объекты</option>
              {objects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            {tab === 'journal' && (
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...sel(), width: 180 }}>
                <option value="all">Приход и расход</option>
                <option value="in">Только приход</option>
                <option value="out">Только расход</option>
              </select>
            )}
            {tab === 'journal' && (
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button onClick={exportJournal} disabled={movements.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: movements.length === 0 ? 'not-allowed' : 'pointer', opacity: movements.length === 0 ? 0.5 : 1 }}>
                  <Icon name="Download" size={16} /> Excel
                </button>
                <button onClick={openNew}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#0057ff', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                  <Icon name="Plus" size={16} /> Добавить запись
                </button>
              </div>
            )}
            {tab === 'balance' && (
              <button onClick={exportBalance} disabled={balance.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: balance.length === 0 ? 'not-allowed' : 'pointer', opacity: balance.length === 0 ? 0.5 : 1, marginLeft: 'auto' }}>
                <Icon name="Download" size={16} /> Excel
              </button>
            )}
          </div>
        )}

        {/* ===== ЖУРНАЛ ===== */}
        {tab === 'journal' && (
          <>
            {/* Итоги */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Записей в журнале', val: movements.length, color: '#0057ff', bg: '#eff6ff', icon: 'FileText' },
                { label: 'Приход (позиций)', val: fmt(totalIn), color: '#059669', bg: '#ecfdf5', icon: 'ArrowDownCircle' },
                { label: 'Расход (позиций)', val: fmt(totalOut), color: '#dc2626', bg: '#fef2f2', icon: 'ArrowUpCircle' },
              ].map(c => (
                <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}22`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={c.icon} size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.val}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{c.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {loading ? (
                <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
              ) : movements.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
                  <Icon name="Package" size={40} />
                  <div style={{ marginTop: 12 }}>Записей нет — добавьте первую</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Дата', 'Объект', 'Материал', 'Тип', 'Кол-во', 'Ед.', 'Документ', 'Примечание', ''].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((m, i) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', color: '#475569' }}>{fmtDate(m.moved_at)}</td>
                        <td style={{ padding: '11px 14px', color: '#0f172a', fontWeight: 500 }}>{m.object_name}</td>
                        <td style={{ padding: '11px 14px', color: '#0f172a' }}>{m.material_name}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                            background: m.movement_type === 'in' ? '#ecfdf5' : '#fef2f2',
                            color: m.movement_type === 'in' ? '#059669' : '#dc2626' }}>
                            {m.movement_type === 'in' ? '▲ Приход' : '▼ Расход'}
                          </span>
                        </td>
                        <td style={{ padding: '11px 14px', fontWeight: 600, color: m.movement_type === 'in' ? '#059669' : '#dc2626', textAlign: 'right' }}>
                          {m.movement_type === 'in' ? '+' : '−'}{fmt(m.quantity)}
                        </td>
                        <td style={{ padding: '11px 14px', color: '#94a3b8' }}>{m.unit}</td>
                        <td style={{ padding: '11px 14px', color: '#64748b' }}>{m.doc_number || '—'}</td>
                        <td style={{ padding: '11px 14px', color: '#94a3b8', maxWidth: 160 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.note || '—'}</div>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <button onClick={() => openEdit(m)} style={{ padding: '5px 9px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#475569' }}>
                            <Icon name="Pencil" size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ===== ОСТАТКИ ===== */}
        {tab === 'balance' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Категория', 'Материал', 'Ед.', 'Приход', 'Расход', 'Остаток'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {balance.map((b, i) => (
                    <tr key={b.material_id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12 }}>{b.category || '—'}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 500, color: '#0f172a' }}>{b.name}</td>
                      <td style={{ padding: '11px 16px', color: '#94a3b8' }}>{b.unit}</td>
                      <td style={{ padding: '11px 16px', color: '#059669', fontWeight: 600 }}>{fmt(b.total_in)}</td>
                      <td style={{ padding: '11px 16px', color: '#dc2626', fontWeight: 600 }}>{fmt(b.total_out)}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: Number(b.balance) < 0 ? '#dc2626' : Number(b.balance) === 0 ? '#94a3b8' : '#0f172a' }}>
                          {fmt(b.balance)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ===== СПРАВОЧНИКИ ===== */}
        {tab === 'refs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Объекты */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ margin: '0 0 18px', fontFamily: "'Oswald', sans-serif", fontSize: 18 }}>Объекты</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input value={newObj.name} onChange={e => setNewObj({ ...newObj, name: e.target.value })} placeholder="Название объекта *" style={inp({ flex: 2 })} />
                <input value={newObj.address} onChange={e => setNewObj({ ...newObj, address: e.target.value })} placeholder="Адрес" style={inp({ flex: 2 })} />
                <button onClick={addObj} style={{ padding: '9px 14px', borderRadius: 9, background: '#0057ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+</button>
              </div>
              {objects.map(o => (
                <div key={o.id} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 9, marginBottom: 6 }}>
                  <div style={{ fontWeight: 500, color: '#0f172a' }}>{o.name}</div>
                  {o.address && <div style={{ fontSize: 12, color: '#94a3b8' }}>{o.address}</div>}
                </div>
              ))}
            </div>

            {/* Материалы */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ margin: '0 0 18px', fontFamily: "'Oswald', sans-serif", fontSize: 18 }}>Номенклатура</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <input value={newMat.name} onChange={e => setNewMat({ ...newMat, name: e.target.value })} placeholder="Название *" style={inp({ flex: 3, minWidth: 160 })} />
                <input value={newMat.unit} onChange={e => setNewMat({ ...newMat, unit: e.target.value })} placeholder="Ед." style={inp({ width: 60 })} />
                <input value={newMat.category} onChange={e => setNewMat({ ...newMat, category: e.target.value })} placeholder="Категория" style={inp({ flex: 2, minWidth: 120 })} />
                <button onClick={addMat} style={{ padding: '9px 14px', borderRadius: 9, background: '#0057ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+</button>
              </div>
              <div style={{ maxHeight: 400, overflow: 'auto' }}>
                {materials.map(m => (
                  <div key={m.id} style={{ padding: '9px 14px', background: '#f8fafc', borderRadius: 9, marginBottom: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 500, color: '#0f172a' }}>{m.name}</div>
                    <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
                      <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: 6 }}>{m.unit}</span>
                      {m.category && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 6 }}>{m.category}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно добавления/редактирования */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, margin: 0 }}>{editId ? 'Редактировать' : 'Новая запись'}</h2>
              <button onClick={() => setModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><Icon name="X" size={22} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Объект *</label>
                <select value={modal.object_id} onChange={e => setModal({ ...modal, object_id: e.target.value })} style={sel()}>
                  <option value="">Выберите объект</option>
                  {objects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Материал *</label>
                <select value={modal.material_id} onChange={e => setModal({ ...modal, material_id: e.target.value })} style={sel()}>
                  <option value="">Выберите материал</option>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Тип *</label>
                <select value={modal.movement_type} onChange={e => setModal({ ...modal, movement_type: e.target.value as 'in' | 'out' })} style={sel()}>
                  <option value="in">▲ Приход</option>
                  <option value="out">▼ Расход</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Количество *</label>
                <input type="number" min="0" step="0.001" value={modal.quantity} onChange={e => setModal({ ...modal, quantity: e.target.value })} style={inp()} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Дата</label>
                <input type="date" value={modal.moved_at} onChange={e => setModal({ ...modal, moved_at: e.target.value })} style={inp()} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Номер документа</label>
                <input value={modal.doc_number} onChange={e => setModal({ ...modal, doc_number: e.target.value })} placeholder="ТН-001" style={inp()} />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>Примечание</label>
                <textarea value={modal.note} onChange={e => setModal({ ...modal, note: e.target.value })} rows={2} style={{ ...inp(), resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}>Отмена</button>
              <button onClick={save} disabled={saving || !modal.object_id || !modal.material_id || !modal.quantity}
                style={{ padding: '10px 28px', borderRadius: 10, background: saving ? '#93c5fd' : '#0057ff', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap');`}</style>
    </div>
  );
}