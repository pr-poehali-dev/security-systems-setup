CREATE TABLE objects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(30) NOT NULL DEFAULT 'шт',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE material_movements (
  id SERIAL PRIMARY KEY,
  object_id INTEGER REFERENCES objects(id),
  material_id INTEGER REFERENCES materials(id),
  movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('in', 'out')),
  quantity NUMERIC(12,3) NOT NULL,
  doc_number VARCHAR(100),
  note TEXT,
  moved_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_movements_object ON material_movements(object_id);
CREATE INDEX idx_movements_material ON material_movements(material_id);
CREATE INDEX idx_movements_date ON material_movements(moved_at);

INSERT INTO objects (name, address) VALUES
  ('Объект №1 — ТЦ «Мегаполис»', 'г. Белгород, ул. Победы, 165'),
  ('Объект №2 — Жилой дом ул. Есенина', 'г. Белгород, ул. Есенина, 44'),
  ('Объект №3 — Склад «Промзона»', 'Белгородский р-н, пос. Разумное');

INSERT INTO materials (name, unit, category) VALUES
  ('Кабель ВВГ 3х2.5', 'м', 'Кабель'),
  ('Кабель NYM 3х1.5', 'м', 'Кабель'),
  ('Автомат ABB 16А однополюс', 'шт', 'Автоматика'),
  ('Автомат ABB 25А двухполюс', 'шт', 'Автоматика'),
  ('Розетка Legrand белая', 'шт', 'Розетки/выключатели'),
  ('Выключатель 1кл Legrand', 'шт', 'Розетки/выключатели'),
  ('Труба гофрированная ПВХ 20мм', 'м', 'Трубы/кабельканалы'),
  ('Щит навесной 12 мод.', 'шт', 'Щитовое');

INSERT INTO material_movements (object_id, material_id, movement_type, quantity, doc_number, moved_at) VALUES
  (1, 1, 'in',  500, 'ТН-001', '2026-06-01'),
  (1, 1, 'out', 120, NULL,      '2026-06-03'),
  (1, 3, 'in',  20,  'ТН-001', '2026-06-01'),
  (1, 3, 'out',  5,  NULL,     '2026-06-05'),
  (2, 2, 'in',  300, 'ТН-002', '2026-06-10'),
  (2, 2, 'out',  80, NULL,     '2026-06-12'),
  (2, 5, 'in',   50, 'ТН-002', '2026-06-10'),
  (2, 5, 'out',  22, NULL,     '2026-06-13');
