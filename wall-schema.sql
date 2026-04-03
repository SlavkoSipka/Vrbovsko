-- =============================================
-- VRBOVSKI ZID (PREDLOZI + PROBLEMI) — SQL ŠEMA
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

DROP TABLE IF EXISTS wall_posts CASCADE;

CREATE TABLE wall_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wall_type TEXT NOT NULL CHECK (wall_type IN ('predlozi', 'problemi')),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- RLS POLITIKE
-- =============================================

ALTER TABLE wall_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wall_public_read" ON wall_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "wall_anon_insert" ON wall_posts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "wall_auth_all" ON wall_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE wall_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES wall_posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE wall_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wall_replies_public_read" ON wall_replies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "wall_replies_auth_all" ON wall_replies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- INDEXI
-- =============================================

CREATE INDEX idx_wall_posts_type ON wall_posts(wall_type, created_at DESC);
CREATE INDEX idx_wall_replies_post ON wall_replies(post_id, created_at);
