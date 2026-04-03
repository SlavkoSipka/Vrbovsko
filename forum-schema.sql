-- =============================================
-- VRBOVSKI FORUM - SQL ŠEMA
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

-- Tabele
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;
DROP TABLE IF EXISTS forum_topics CASCADE;

-- =============================================
-- 1. TABELE
-- =============================================

CREATE TABLE forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  intro TEXT NOT NULL DEFAULT '',
  call_to_action TEXT NOT NULL DEFAULT '',
  cover_image TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. RLS POLITIKE
-- =============================================

ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Svi mogu da čitaju
CREATE POLICY "forum_topics_public_read" ON forum_topics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "forum_posts_public_read" ON forum_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "forum_replies_public_read" ON forum_replies FOR SELECT TO anon, authenticated USING (true);

-- Anonimni korisnici mogu da pišu postove i odgovore (gosti)
CREATE POLICY "forum_posts_anon_insert" ON forum_posts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "forum_replies_anon_insert" ON forum_replies FOR INSERT TO anon WITH CHECK (true);

-- Ulogovani (admin) mogu sve
CREATE POLICY "forum_topics_auth_all" ON forum_topics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "forum_posts_auth_all" ON forum_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "forum_replies_auth_all" ON forum_replies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 3. INDEXI ZA PERFORMANSE
-- =============================================

CREATE INDEX idx_forum_posts_topic ON forum_posts(topic_id, created_at DESC);
CREATE INDEX idx_forum_replies_post ON forum_replies(post_id, created_at ASC);

-- =============================================
-- 4. SEED — 3 FORUM TEME
-- =============================================

INSERT INTO forum_topics (title, slug, intro, call_to_action, sort_order) VALUES
(
  'Javno / Zajedničko: Gde Su Granice?',
  'javno-zajednicko-gde-su-granice',
  'U naselju postoje različite površine koje svakodnevno koristimo — od staza i prolaza do zelenih površina i prostora između zgrada. Iako formalno ne postoje privatne parcele, u praksi se često postavlja pitanje šta doživljavamo kao zajedničko, a šta kao prostor koji nije namenjen opštoj upotrebi.',
  'Podelite kako vidite granice korišćenja zajedničkih površina i gde najčešće dolazi do različitih tumačenja.',
  1
),
(
  'Rizici i Bezbednost Života u Naselju',
  'rizici-i-bezbednost-zivota-u-naselju',
  'Bezbednost je važan deo svakodnevnog života. U naselju se mogu javiti različiti tipovi rizika — saobraćajni, infrastrukturni, ekološki ili oni koji se tiču održavanja zajedničkih površina.',
  'Podelite koja zapažanja imate o rizicima u naselju i šta najviše utiče na vaš osećaj sigurnosti.',
  2
),
(
  'Svakodnevna Rekreacija i Boravak na Otvorenom',
  'svakodnevna-rekreacija-i-boravak-na-otvorenom',
  'Boravak na otvorenom i lagana rekreacija doprinose zdravlju i kvalitetu života. Otvoreni prostori u naselju koriste se na različite načine — za šetnju, odmor, druženje ili rekreaciju sa decom i kućnim ljubimcima.',
  'Podelite kako koristite otvorene prostore i šta bi moglo da unapredi svakodnevnu rekreaciju u naselju.',
  3
);
