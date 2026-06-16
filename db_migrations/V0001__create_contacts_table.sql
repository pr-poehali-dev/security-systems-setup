CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  address VARCHAR(255),
  contact_person VARCHAR(150),
  position VARCHAR(100),
  phone VARCHAR(50),
  phone2 VARCHAR(50),
  email VARCHAR(150),
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  call_result TEXT,
  next_call_date DATE,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_company ON contacts(company_name);

INSERT INTO contacts (company_name, industry, address, contact_person, position, phone, status) VALUES
('ООО СтройМонтаж', 'Строительство', 'г. Белгород, ул. Победы, 12', 'Иванов Сергей Петрович', 'Главный инженер', '8-910-000-0001', 'new'),
('АО БелгородЭнерго', 'Энергетика', 'г. Белгород, пр. Богдана Хмельницкого, 100', 'Петров Алексей Иванович', 'Начальник снабжения', '8-910-000-0002', 'new'),
('ООО ПромСтрой', 'Промышленность', 'г. Белгород, ул. Губкина, 17', 'Сидорова Марина Викторовна', 'Директор', '8-910-000-0003', 'new');
