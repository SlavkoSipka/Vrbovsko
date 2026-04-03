-- =============================================
-- MIGRACIJA: Dodaj wall_replies tabelu
-- Pokreni ovo ako si već pokrenuo wall-schema.sql
-- pre nego što su dodati odgovori admina
-- =============================================

CREATE TABLE IF NOT EXISTS wall_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES wall_posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE wall_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wall_replies_public_read" ON wall_replies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "wall_replies_auth_all" ON wall_replies FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_wall_replies_post ON wall_replies(post_id, created_at);
