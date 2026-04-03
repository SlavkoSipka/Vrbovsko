-- =============================================
-- SARADNJA I PARTNERI - SQL SCHEMA
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

-- Obriši stare tabele ako postoje
DROP TABLE IF EXISTS fondovi CASCADE;
DROP TABLE IF EXISTS partners CASCADE;

-- =============================================
-- 1. TABELA: PARTNERI (lokalni partneri + donatori)
-- =============================================

CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partners_select" ON partners FOR SELECT USING (true);
CREATE POLICY "partners_all" ON partners FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 2. TABELA: FONDOVI (EU fondovi accordion)
-- =============================================

CREATE TABLE fondovi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE fondovi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fondovi_select" ON fondovi FOR SELECT USING (true);
CREATE POLICY "fondovi_all" ON fondovi FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 3. SEED DATA: FONDOVI
-- =============================================

INSERT INTO fondovi (name, description, sort_order) VALUES
  ('Kohezijski fond', 'Podržava velike infrastrukturne i ekološke projekte u državama članicama sa nižim BDP‑om.', 1),
  ('ERDF — Evropski fond za regionalni razvoj', 'Usmeren na regionalni razvoj, inovacije i unapređenje javne infrastrukture.', 2),
  ('ESF+ — Evropski socijalni fond Plus', 'Fokusiran na zapošljavanje, obrazovanje i socijalnu uključenost.', 3),
  ('EAFRD — Evropski poljoprivredni fond za ruralni razvoj', 'Podržava održivu poljoprivredu i razvoj ruralnih područja.', 4),
  ('Horizon Europe', 'Program EU za istraživanje, inovacije i tehnološki razvoj.', 5),
  ('LIFE program', 'Program posvećen zaštiti životne sredine, biodiverziteta i klimatskim akcijama.', 6);
