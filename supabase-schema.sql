-- =============================================
-- VRBOVSKI ADMIN - KOMPLETAN SQL
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

-- Prvo obriši stare tabele ako postoje
DROP TABLE IF EXISTS topic_documents CASCADE;
DROP TABLE IF EXISTS topic_images CASCADE;
DROP TABLE IF EXISTS topic_items CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS sections CASCADE;

-- =============================================
-- 1. TABELE
-- =============================================

CREATE TABLE sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  body TEXT DEFAULT '',
  disclaimer TEXT DEFAULT '',
  icon_svg TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (section_id, slug)
);

CREATE TABLE topic_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  icon TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  link TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE topic_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE topic_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT DEFAULT 'link',
  sort_order INT DEFAULT 0
);

-- =============================================
-- 2. RLS - ISKLJUCENO (jednostavnije za pocetak)
-- =============================================

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_documents ENABLE ROW LEVEL SECURITY;

-- Svi mogu da citaju
CREATE POLICY "allow_public_read_sections" ON sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_topics" ON topics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_items" ON topic_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_images" ON topic_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_documents" ON topic_documents FOR SELECT TO anon, authenticated USING (true);

-- Ulogovani korisnici mogu sve
CREATE POLICY "allow_auth_all_sections" ON sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_topics" ON topics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_items" ON topic_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_images" ON topic_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_documents" ON topic_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 3. UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS topics_updated_at ON topics;
CREATE TRIGGER topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. SEKCIJA
-- =============================================

INSERT INTO sections (title, slug, sort_order) VALUES
  ('Održivi Razvoj', 'odrzivi-razvoj', 1);

-- =============================================
-- 5. SEED - SVIH 6 TEMA
-- =============================================

DO $$
DECLARE
  sec_id UUID;
  t_id UUID;
BEGIN
  SELECT id INTO sec_id FROM sections WHERE slug = 'odrzivi-razvoj';

  -- 1. Ciljevi Održivog Razvoja
  INSERT INTO topics (section_id, title, slug, short_desc, subtitle, body, icon_svg, sort_order)
  VALUES (sec_id, 'Ciljevi Održivog Razvoja', 'ciljevi-odrzivog-razvoja',
    'Univerzalni skup od 17 UN ciljeva za unapređenje kvaliteta života i zaštitu resursa',
    'Globalni okvir Ujedinjenih nacija za održivu budućnost',
    'Ciljevi održivog razvoja predstavljaju univerzalni skup od 17 međusobno povezanih ciljeva koje su usvojile Ujedinjene nacije kao deo Agende 2030. Ovi ciljevi definišu međunarodni okvir za unapređenje kvaliteta života, zaštitu prirodnih resursa i izgradnju pravednih, otpornih i održivih zajednica. Kao lokalna inicijativa, Vrbovski se može strateški uskladiti sa ovim globalnim standardima.',
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    1
  ) RETURNING id INTO t_id;

  INSERT INTO topic_items (topic_id, icon, title, description, sort_order) VALUES
    (t_id, '1', 'Svet bez siromaštva', '', 1),
    (t_id, '2', 'Svet bez gladi', '', 2),
    (t_id, '3', 'Zdravlje i blagostanje', '', 3),
    (t_id, '4', 'Kvalitetno obrazovanje', '', 4),
    (t_id, '5', 'Rodna ravnopravnost', '', 5),
    (t_id, '6', 'Čista voda i sanitarni uslovi', '', 6),
    (t_id, '7', 'Pristupačna i čista energija', '', 7),
    (t_id, '8', 'Dostojanstven rad i ekonomski rast', '', 8),
    (t_id, '9', 'Industrija, inovacije i infrastruktura', '', 9),
    (t_id, '10', 'Smanjenje nejednakosti', '', 10),
    (t_id, '11', 'Održivi gradovi i zajednice', '', 11),
    (t_id, '12', 'Odgovorna potrošnja i proizvodnja', '', 12),
    (t_id, '13', 'Klimatska akcija', '', 13),
    (t_id, '14', 'Život ispod vode', '', 14),
    (t_id, '15', 'Život na kopnu', '', 15),
    (t_id, '16', 'Mir, pravda i snažne institucije', '', 16),
    (t_id, '17', 'Partnerstva za ciljeve', '', 17);

  INSERT INTO topic_documents (topic_id, title, url, file_type, sort_order) VALUES
    (t_id, 'UN Sustainable Development Goals', 'https://www.un.org/sustainabledevelopment', 'link', 1);

  -- 2. Agenda 2030 u Republici Srbiji
  INSERT INTO topics (section_id, title, slug, short_desc, subtitle, body, icon_svg, sort_order)
  VALUES (sec_id, 'Agenda 2030 u Republici Srbiji', 'agenda-2030-srbija',
    'Nacionalni okvir koji povezuje UN Agendu 2030 sa evropskim politikama u Srbiji',
    'Zvanični okvir koji povezuje Srbiju sa UN Agendom 2030 i evropskim politikama',
    'Dokument „Agenda 2030 u Republici Srbiji – Nacionalni prioriteti za ostvarivanje ciljeva održivog razvoja" predstavlja krovni nacionalni okvir usvojen u Narodnoj skupštini. Njime se globalni ciljevi održivog razvoja povezuju sa obavezama iz procesa pristupanja EU, stvarajući jedinstvenu osnovu za planiranje i sprovođenje politika održivog razvoja u Srbiji.',
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    2
  ) RETURNING id INTO t_id;

  INSERT INTO topic_items (topic_id, icon, title, description, sort_order) VALUES
    (t_id, '🏛️', 'Usvojen u Narodnoj skupštini', 'Postavlja zvanične nacionalne prioritete i obavezuje institucije na njihovo sprovođenje.', 1),
    (t_id, '🌍', 'Povezuje UN i EU ciljeve', 'Usklađuje ciljeve održivog razvoja (SDGs) sa evropskim politikama i poglavljem 27.', 2),
    (t_id, '🎯', 'Fokus na ključne oblasti', 'Životna sredina, klima, energija, upravljanje resursima, zajednice i održivi razvoj.', 3),
    (t_id, '🔗', 'Most ka Evropskom zelenom dogovoru', 'Povezuje nacionalne mere sa evropskim standardima u oblasti zaštite životne sredine.', 4),
    (t_id, '🧭', 'Okvir za planiranje politika', 'Služi kao smernica za strateško planiranje, praćenje i izveštavanje institucija.', 5);

  -- 3. Urbanizam i Planiranje
  INSERT INTO topics (section_id, title, slug, short_desc, subtitle, body, icon_svg, sort_order)
  VALUES (sec_id, 'Urbanizam i Planiranje', 'urbanizam-planiranje',
    'Održivo uređenje prostora zasnovano na standardima, analizi potreba i zaštiti javnog interesa',
    'Mali rečnik održivog planiranja',
    'Održivo planiranje podrazumeva uređenje prostora zasnovano na jasnim standardima, analizi potreba i dugoročnoj zaštiti javnog interesa. Pažnja se usmerava na kvalitet javnih površina, dostupnost, bezbednost i racionalno korišćenje resursa.',
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    3
  ) RETURNING id INTO t_id;

  INSERT INTO topic_items (topic_id, icon, title, description, sort_order) VALUES
    (t_id, '🏛️', 'Javni prostor', 'Ulice, trgovi, parkovi i pešačke zone uređeni prema standardima pristupačnosti, bezbednosti i funkcionalnosti.', 1),
    (t_id, '🌳', 'Zeleno planiranje', 'Uključivanje zelenih površina, drvoreda, hladova i prirodnih tampon zona radi povećanja klimatske otpornosti.', 2),
    (t_id, '🌡️', 'Klimatska adaptacija', 'Prostorne i infrastrukturne mere koje smanjuju posledice vrućina, poplava i drugih klimatskih ekstrema.', 3),
    (t_id, '♻️', 'Upravljanje otpadom', 'Sistem separatnog odlaganja, reciklaže i održavanja čistoće javnog prostora.', 4),
    (t_id, '🛡️', 'Otpornost naselja', 'Sposobnost prostora da funkcioniše uprkos klimatskim, infrastrukturnim ili socijalnim poremećajima.', 5),
    (t_id, '🗳️', 'Participacija zajednice', 'Uključivanje stanovnika u procese odlučivanja kroz ankete, javne izveštaje i konsultacije.', 6);

  -- 4. Klimatska Otpornost
  INSERT INTO topics (section_id, title, slug, short_desc, subtitle, body, icon_svg, sort_order)
  VALUES (sec_id, 'Klimatska Otpornost', 'klimatska-otpornost',
    'Priprema zajednice za klimatske promene, smanjenje rizika i brz oporavak',
    'Priprema, prilagođavanje, oporavak',
    'Klimatska otpornost znači da zajednica može da se pripremi za klimatske promene, da smanji rizike i da se brzo oporavi nakon vrućina, poplava ili oluja.',
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>',
    4
  ) RETURNING id INTO t_id;

  INSERT INTO topic_items (topic_id, icon, title, description, sort_order) VALUES
    (t_id, '🌳', 'Zelenilo', 'Smanjuje temperaturu, stvara hlad i upija kišnicu.', 1),
    (t_id, '🧱', 'Infrastruktura', 'Propusne površine i dobra odvodnja smanjuju rizik od poplava.', 2),
    (t_id, '♻️', 'Otpad', 'Čisto okruženje i odgovorno upravljanje otpadom jačaju stabilnost sistema.', 3),
    (t_id, '👥', 'Zajednica', 'Informisana i uključena zajednica brže reaguje i brže se oporavlja.', 4);

  -- 5. EU Vodiči i Smernice
  INSERT INTO topics (section_id, title, slug, short_desc, subtitle, body, disclaimer, icon_svg, sort_order)
  VALUES (sec_id, 'EU Vodiči i Smernice', 'eu-vodici-smernice',
    'Standardi i modeli EU za zelenilo, javne prostore, otpad i klimatsku otpornost',
    'Evropski standardi za lokalne zajednice',
    'Evropska unija razvija vodiče i smernice koje pomažu lokalnim zajednicama da planiraju i sprovode projekte u skladu sa najvišim standardima održivosti.',
    'Ovaj sajt izrađen je uz finansijsku pomoć Evropske unije. Za njegovu sadržinu odgovorno je udruženje „INICIJATIVA ZA ODRŽIVI RAZVOJ VRBOVSKOG" i ona nužno ne odražava stavove Evropske unije.',
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
    5
  ) RETURNING id INTO t_id;

  INSERT INTO topic_items (topic_id, icon, title, description, link, sort_order) VALUES
    (t_id, '🌡️', 'EU Strategy on Adaptation to Climate Change', 'Priprema zajednica za vrućine, poplave i ekstremne vremenske uslove.', 'https://climate.ec.europa.eu/eu-action/adaptation-climate-change/eu-adaptation-strategy_en', 1),
    (t_id, '🌳', 'EU Green Infrastructure Strategy', 'Razvoj zelenih površina i prirodnih rešenja u urbanim sredinama.', 'https://climate-adapt.eea.europa.eu/en/metadata/publications/eu-green-infrastructure-strategy', 2),
    (t_id, '🌱', 'EU Urban Greening Plans', 'Modeli za ozelenjavanje naselja i povećanje hlada u javnim prostorima.', 'https://urbannatureplans.eu/sites/default/files/media/documents/UGP%20Guidance.pdf', 3),
    (t_id, '♻️', 'EU Waste Framework Directive', 'Standardi za reciklažu, odvajanje otpada i cirkularnu ekonomiju.', 'https://environment.ec.europa.eu/topics/waste-and-recycling/waste-framework-directive_en', 4),
    (t_id, '⚖️', 'EU Climate Law', 'Okvir za smanjenje emisija i klimatsku neutralnost do 2050.', 'https://climate.ec.europa.eu/eu-action/european-climate-law_en', 5),
    (t_id, '🐞', 'EU Biodiversity Strategy 2030', 'Zaštita prirode i obnova ekosistema u urbanim i ruralnim sredinama.', 'https://environment.ec.europa.eu/strategy/biodiversity-strategy-2030_en', 6),
    (t_id, '💧', 'EU Zero Pollution Action Plan', 'Smanjenje zagađenja vazduha, vode i zemljišta radi zdravijeg okruženja.', 'https://environment.ec.europa.eu/strategy/zero-pollution-action-plan_en', 7),
    (t_id, '🏛️', 'EU Renovation Wave', 'Povećanje energetske efikasnosti i modernizacija javnih i stambenih objekata.', 'https://energy.ec.europa.eu/topics/energy-efficiency/energy-efficient-buildings/renovation-wave_en', 8);

  -- 6. Cirkularna Ekonomija
  INSERT INTO topics (section_id, title, slug, short_desc, subtitle, body, icon_svg, sort_order)
  VALUES (sec_id, 'Cirkularna Ekonomija', 'cirkularna-ekonomija',
    'Ponovna upotreba, popravka, reciklaža i smanjenje otpada za održivije naselje',
    'Duže, efikasnije, odgovornije',
    'Cirkularna ekonomija podrazumeva da se materijali koriste duže, efikasnije i odgovornije — kroz ponovnu upotrebu, popravku, reciklažu i smanjenje otpada.',
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>',
    6
  ) RETURNING id INTO t_id;

  INSERT INTO topic_items (topic_id, icon, title, description, sort_order) VALUES
    (t_id, '🔄', 'Efikasno korišćenje resursa', 'Produžavanje životnog veka proizvoda kroz ponovnu upotrebu i popravku.', 1),
    (t_id, '♻️', 'Reciklaža kao standard', 'Odvajanje otpada i vraćanje materijala u novi ciklus upotrebe.', 2),
    (t_id, '🧩', 'Manje otpada', 'Smanjenje količine otpada kroz pametnu potrošnju i odgovorne navike.', 3),
    (t_id, '🌍', 'Lokalni zatvoreni tokovi', 'Korišćenje resursa unutar zajednice radi manjeg zagađenja i veće održivosti.', 4),
    (t_id, '🛠️', 'Popravka pre zamene', 'Podsticanje servisa, popravki i produženog korišćenja umesto bacanja.', 5),
    (t_id, '🧪', 'Inovacije i novi materijali', 'Uvođenje održivih materijala i rešenja koja smanjuju ekološki otisak.', 6);

END $$;
