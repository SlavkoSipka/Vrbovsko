-- =============================================
-- AKTIVNOSTI, FAZE, GALERIJA - SQL SCHEMA
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

-- Obriši stare tabele ako postoje
DROP TABLE IF EXISTS activity_gallery CASCADE;
DROP TABLE IF EXISTS activity_documents CASCADE;
DROP TABLE IF EXISTS project_activities CASCADE;
DROP TABLE IF EXISTS project_phases CASCADE;

-- =============================================
-- 1. TABELA: FAZE PROJEKTA (samo za projekte)
-- =============================================

CREATE TABLE project_phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planirano' CHECK (status IN ('planirano', 'u_toku', 'zavrseno')),
  cover_image TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phases_select" ON project_phases FOR SELECT USING (true);
CREATE POLICY "phases_all" ON project_phases FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 2. TABELA: AKTIVNOSTI (za projekte i inicijative)
-- =============================================

CREATE TABLE project_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_type TEXT NOT NULL CHECK (parent_type IN ('project', 'initiative')),
  parent_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  short_desc TEXT DEFAULT '',
  description TEXT DEFAULT '',
  goals TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planirano' CHECK (status IN ('planirano', 'u_toku', 'zavrseno')),
  cover_image TEXT DEFAULT '',
  partners TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_select" ON project_activities FOR SELECT USING (true);
CREATE POLICY "activities_all" ON project_activities FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 3. TABELA: DOKUMENTI PO AKTIVNOSTI
-- =============================================

CREATE TABLE activity_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES project_activities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  sort_order INT DEFAULT 0
);

ALTER TABLE activity_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "act_docs_select" ON activity_documents FOR SELECT USING (true);
CREATE POLICY "act_docs_all" ON activity_documents FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 4. TABELA: GALERIJA PO AKTIVNOSTI
-- =============================================

CREATE TABLE activity_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES project_activities(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

ALTER TABLE activity_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "act_gallery_select" ON activity_gallery FOR SELECT USING (true);
CREATE POLICY "act_gallery_all" ON activity_gallery FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 5. DODAJ goals KOLONU NA projects I initiatives
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='goals') THEN
    ALTER TABLE projects ADD COLUMN goals TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='initiatives' AND column_name='goals') THEN
    ALTER TABLE initiatives ADD COLUMN goals TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='detailed_description') THEN
    ALTER TABLE projects ADD COLUMN detailed_description TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='initiatives' AND column_name='detailed_description') THEN
    ALTER TABLE initiatives ADD COLUMN detailed_description TEXT DEFAULT '';
  END IF;
END
$$;

-- =============================================
-- 6. UPDATED_AT TRIGGER ZA AKTIVNOSTI
-- =============================================

DROP TRIGGER IF EXISTS activities_updated_at ON project_activities;
CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON project_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 7. SEED: AKTIVNOSTI ZA "Zeleni obod Vrbovskog"
-- =============================================

INSERT INTO project_activities (parent_type, parent_id, title, slug, activity_date, short_desc, description, goals, status, visible, sort_order)
SELECT
  'project',
  p.id,
  d.title,
  d.slug,
  d.act_date,
  d.short_desc,
  d.description,
  d.goals,
  d.status,
  true,
  d.sort_order
FROM projects p,
(VALUES
  (
    'Saopštenje za javnost od 20.03.2026.',
    'saopstenje-za-javnost-20-03-2026',
    '2026-03-20'::date,
    'Zvanično saopštenje povodom pokretanja projekta „Zeleni obod Vrbovskog – obnova za budućnost".',
    'Udruženje „Inicijativa za održivi razvoj Vrbovskog" objavilo je saopštenje za javnost povodom projekta „Zeleni obod Vrbovskog – obnova za budućnost", usmerenog na očuvanje, zaštitu i unapređenje šumskog pojasa oko naselja Vrbovski kod Padinske Skele.

Projekat obuhvata aktivnosti dokumentovanja postojećeg stanja, identifikacije potreba za unapređenjem, jačanja saradnje sa nadležnim institucijama i podsticanja participativnosti stanovništva.',
    'Informisanje javnosti o pokretanju projekta
Prezentacija ciljeva i planova
Poziv zajednici na uključivanje',
    'zavrseno',
    1
  ),
  (
    'Obaveštenje za javnost — nastavak aktivnosti, 01.04.2026.',
    'obavestenje-za-javnost-01-04-2026',
    '2026-04-01'::date,
    'Nastavak projektnih aktivnosti i obaveštenje javnosti o daljem toku projekta.',
    'Udruženje je objavilo obaveštenje za javnost o nastavku aktivnosti u okviru projekta „Zeleni obod Vrbovskog – obnova za budućnost". Aktivnosti uključuju dalju koordinaciju sa nadležnim institucijama i pripremu narednih koraka.',
    'Informisanje o nastavku aktivnosti
Transparentnost prema zajednici
Priprema za narednu fazu',
    'zavrseno',
    2
  )
) AS d(title, slug, act_date, short_desc, description, goals, status, sort_order)
WHERE p.slug = 'zeleni-obod-vrbovskog';

-- Dodaj dokumente za prvu aktivnost (Saopštenje)
INSERT INTO activity_documents (activity_id, title, url, file_type, sort_order)
SELECT a.id, 'Saopštenje za javnost — PDF', '/dokumenti/saopstenje-vrbovski-20-03-2026.pdf', 'pdf', 1
FROM project_activities a WHERE a.slug = 'saopstenje-za-javnost-20-03-2026';

INSERT INTO activity_documents (activity_id, title, url, file_type, sort_order)
SELECT a.id, 'Plakat – informativni pregled planiranih namena', '/dokumenti/zeleni-obod-plakat-1.pdf', 'pdf', 2
FROM project_activities a WHERE a.slug = 'saopstenje-za-javnost-20-03-2026';

INSERT INTO activity_documents (activity_id, title, url, file_type, sort_order)
SELECT a.id, 'Plakat – uticaj šumskog pojasa na klimatsku adaptabilnost', '/dokumenti/zeleni-obod-plakat-2.pdf', 'pdf', 3
FROM project_activities a WHERE a.slug = 'saopstenje-za-javnost-20-03-2026';
