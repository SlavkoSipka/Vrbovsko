-- =============================================
-- VRBOVSKI ANKETE - SQL ŠEMA
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

DROP TABLE IF EXISTS survey_votes CASCADE;
DROP TABLE IF EXISTS survey_options CASCADE;
DROP TABLE IF EXISTS survey_polls CASCADE;

-- =============================================
-- 1. TABELE
-- =============================================

CREATE TABLE survey_polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  is_closed BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE survey_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES survey_polls(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE survey_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES survey_polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES survey_options(id) ON DELETE CASCADE NOT NULL,
  voter_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (poll_id, voter_name)
);

-- =============================================
-- 2. RLS POLITIKE
-- =============================================

ALTER TABLE survey_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "polls_public_read" ON survey_polls FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "options_public_read" ON survey_options FOR SELECT TO anon, authenticated USING (true);

-- Anonimni mogu da glasaju (INSERT) ali ne mogu da čitaju tuđe glasove
CREATE POLICY "votes_anon_insert" ON survey_votes FOR INSERT TO anon WITH CHECK (true);
-- Samo admin može da čita sve glasove (za rezultate)
CREATE POLICY "votes_auth_read" ON survey_votes FOR SELECT TO authenticated USING (true);
-- Anonimni mogu da čitaju samo agregirane podatke preko RPC, ali ne direktno glasove
-- Za javne rezultate (zatvorene ankete) koristimo count agreagciju

CREATE POLICY "polls_auth_all" ON survey_polls FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "options_auth_all" ON survey_options FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "votes_auth_all" ON survey_votes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 3. RPC — Javni brojač glasova (za zatvorene ankete)
-- =============================================

CREATE OR REPLACE FUNCTION get_poll_results(p_poll_id UUID)
RETURNS TABLE(option_id UUID, vote_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT sv.option_id, COUNT(*)::BIGINT as vote_count
  FROM survey_votes sv
  WHERE sv.poll_id = p_poll_id
  GROUP BY sv.option_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Provera da li je ime već glasalo
CREATE OR REPLACE FUNCTION check_voter_exists(p_poll_id UUID, p_voter_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM survey_votes WHERE poll_id = p_poll_id AND voter_name = p_voter_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. INDEXI
-- =============================================

CREATE INDEX idx_survey_options_poll ON survey_options(poll_id, sort_order);
CREATE INDEX idx_survey_votes_poll ON survey_votes(poll_id);
CREATE INDEX idx_survey_votes_voter ON survey_votes(poll_id, voter_name);

-- =============================================
-- 5. SEED — 3 ANKETE
-- =============================================

DO $$
DECLARE
  poll1_id UUID;
  poll2_id UUID;
  poll3_id UUID;
BEGIN
  INSERT INTO survey_polls (title, question, sort_order)
  VALUES ('Javno / Zajedničko', 'Šta u naselju smatrate zajedničkim prostorom dostupnim svima?', 1)
  RETURNING id INTO poll1_id;

  INSERT INTO survey_options (poll_id, label, sort_order) VALUES
    (poll1_id, 'Zelene površine i travnjaci između zgrada', 1),
    (poll1_id, 'Staze, prolazi i pešačke komunikacije', 2),
    (poll1_id, 'Prostore oko zgrada koji nisu jasno uređeni', 3),
    (poll1_id, 'Samo ono što je jasno obeleženo kao javno', 4),
    (poll1_id, 'Nisam siguran/sigurna', 5);

  INSERT INTO survey_polls (title, question, sort_order)
  VALUES ('Rizici i Bezbednost', 'Koji tip rizika najviše primećujete u svakodnevnom životu?', 2)
  RETURNING id INTO poll2_id;

  INSERT INTO survey_options (poll_id, label, sort_order) VALUES
    (poll2_id, 'Saobraćajni rizici', 1),
    (poll2_id, 'Infrastrukturni rizici', 2),
    (poll2_id, 'Ekološki rizici', 3),
    (poll2_id, 'Rizici vezani za održavanje zajedničkih površina', 4),
    (poll2_id, 'Ne primećujem značajne rizike', 5);

  INSERT INTO survey_polls (title, question, sort_order)
  VALUES ('Svakodnevna Rekreacija', 'Na koji način najčešće koristite otvorene prostore?', 3)
  RETURNING id INTO poll3_id;

  INSERT INTO survey_options (poll_id, label, sort_order) VALUES
    (poll3_id, 'Šetnja i lagana fizička aktivnost', 1),
    (poll3_id, 'Boravak na zelenim površinama', 2),
    (poll3_id, 'Rekreacija sa decom', 3),
    (poll3_id, 'Rekreacija sa kućnim ljubimcima', 4),
    (poll3_id, 'Retko koristim otvorene prostore', 5);
END $$;
