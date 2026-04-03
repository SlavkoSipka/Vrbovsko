-- =============================================
-- FORUM MIGRACIJA — Dodavanje slika
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

-- 1. Dodaj image_url kolonu na postojeće tabele
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE forum_replies ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- 1b. Dodaj cover_image kolonu na forum_topics
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '';

-- 2. Storage bucket — kreiraj 'uploads' ako ne postoji
-- (Ovo se obično radi iz Supabase Dashboard → Storage → New bucket)
-- Ime: uploads, Public: YES

-- 3. Storage politike — dozvoli anonimnim korisnicima upload u forum/ folder
-- Ove politike dodajte u Supabase Dashboard → Storage → uploads → Policies
-- ILI pokrenite ovaj SQL:

INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "allow_anon_forum_upload" ON storage.objects 
FOR INSERT TO anon, authenticated 
WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = 'forum');

CREATE POLICY "allow_public_read_uploads" ON storage.objects 
FOR SELECT TO anon, authenticated 
USING (bucket_id = 'uploads');
