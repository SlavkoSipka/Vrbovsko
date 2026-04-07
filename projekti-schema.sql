-- =============================================
-- PROJEKTI I INICIJATIVE - SQL SCHEMA
-- Pokreni ovo u Supabase SQL Editor-u
-- =============================================

-- Obriši stare tabele ako postoje
DROP TABLE IF EXISTS initiative_documents CASCADE;
DROP TABLE IF EXISTS project_documents CASCADE;
DROP TABLE IF EXISTS initiatives CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- =============================================
-- 1. TABELA: PROJEKTI
-- =============================================

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'aktivan' CHECK (status IN ('aktivan', 'zavrsen', 'planiran')),
  cover_image TEXT DEFAULT '',
  date_text TEXT DEFAULT '',
  partner TEXT DEFAULT '',
  category TEXT DEFAULT '',
  phase_current INT DEFAULT 0,
  phase_total INT DEFAULT 0,
  progress_pct INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. TABELA: INICIJATIVE
-- =============================================

CREATE TABLE initiatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'aktivan' CHECK (status IN ('aktivan', 'zavrsen')),
  cover_image TEXT DEFAULT '',
  date_text TEXT DEFAULT '',
  category TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 3. TABELA: DOKUMENTI ZA PROJEKTE
-- =============================================

CREATE TABLE project_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT DEFAULT 'link',
  sort_order INT DEFAULT 0
);

-- =============================================
-- 4. TABELA: DOKUMENTI ZA INICIJATIVE
-- =============================================

CREATE TABLE initiative_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  initiative_id UUID REFERENCES initiatives(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT DEFAULT 'link',
  sort_order INT DEFAULT 0
);

-- =============================================
-- 5. RLS POLITIKE
-- =============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_initiatives" ON initiatives FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_project_documents" ON project_documents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_initiative_documents" ON initiative_documents FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "allow_auth_all_projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_initiatives" ON initiatives FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_project_documents" ON project_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_all_initiative_documents" ON initiative_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 5. UPDATED_AT TRIGGERI
-- =============================================

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS initiatives_updated_at ON initiatives;
CREATE TRIGGER initiatives_updated_at
  BEFORE UPDATE ON initiatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 6. SEED - PROJEKAT
-- =============================================

INSERT INTO projects (title, slug, description, status, cover_image, date_text, partner, phase_current, phase_total, progress_pct, sort_order) VALUES
(
  'Zeleni obod Vrbovskog – obnova za budućnost',
  'zeleni-obod-vrbovskog',
  'SAOPŠTENJE ZA JAVNOST POVODOM PROJEKTA „Zeleni obod Vrbovskog – obnova za budućnost"

Beograd, 20. mart 2026.g.

Udruženje „Inicijativa za održivi razvoj Vrbovskog" sprovodi projekat „Zeleni obod Vrbovskog – obnova za budućnost", usmeren na očuvanje, zaštitu i unapređenje šumskog pojasa oko naselja Vrbovski kod Padinske Skele. Ovaj zeleni pojas predstavlja značajan element lokalne klimatske adaptibilnosti i važan faktor otpornosti zajednice na rizike.

Projekat obuhvata aktivnosti dokumentovanja postojećeg stanja, identifikacije potreba za unapređenjem, jačanja saradnje sa nadležnim institucijama i podsticanja participativnosti stanovništva. Poseban akcenat stavljen je na intersektorski pristup i uključivanje svih relevantnih aktera u procese planiranja, zaštite i unapređenja prostora.

Cilj projekta je doprinos dugoročno održivom uređenju i očuvanju zelenog pojasa, kao i jačanju otpornosti naselja Vrbovski na klimatske promene i rizike.

Projekat se realizuje u okviru projekta „EU Resurs centar za civilno društvo u Srbiji" koji Beogradska otvorena škola sprovodi u partnerstvu s organizacijama civilnog društva: Novosadska novinarska škola, ENECA, Užički centar za prava deteta, Nova planska praksa, Sigurne staze, Mladi poljoprivrednici Srbije i međunarodnim partnerom, fondacijom Fridrih Ebert (Friedrich Ebert Stiftung). Projekat je podržan od strane Evropske unije i biće realizovan u periodu od 2023. do 2026. godine.',
  'aktivan',
  '',
  '2023 — 2026',
  'EU / Beogradska otvorena škola',
  2,
  3,
  60,
  1
);

-- Dokumenti za projekat Zeleni obod
INSERT INTO project_documents (project_id, title, url, file_type, sort_order)
SELECT p.id, d.title, d.url, d.file_type, d.sort_order
FROM projects p,
(VALUES
  ('Plakat – informativni pregled planiranih namena', '/dokumenti/zeleni-obod-plakat-1.pdf', 'pdf', 1),
  ('Plakat – uticaj šumskog pojasa na klimatsku adaptabilnost', '/dokumenti/zeleni-obod-plakat-2.pdf', 'pdf', 2),
  ('Saopštenje za javnost povodom projekta – 20.03.2026.', '/dokumenti/saopstenje-vrbovski-20-03-2026.pdf', 'pdf', 3),
  ('Obaveštenje za javnost — nastavak aktivnosti, 01.04.2026.', '/dokumenti/obavestenje-za-javnost-01-04-2026.docx', 'file', 4)
) AS d(title, url, file_type, sort_order)
WHERE p.slug = 'zeleni-obod-vrbovskog';

-- Projekat 2: Inicijativa za unapređenje javnog prostora
INSERT INTO projects (title, slug, description, status, cover_image, date_text, partner, phase_current, phase_total, progress_pct, sort_order) VALUES
(
  'Inicijativa za unapređenje javnog prostora u Vrbovskom',
  'unapredjenje-javnog-prostora',
  'Najava inicijative za unapređenje javnog prostora u naselju Vrbovski

Udruženje pokreće pripremu novog projekta usmerenog na unapređenje kvaliteta javnih prostora u naselju Vrbovski, sa posebnim fokusom na bezbednost, pristupačnost i održivo korišćenje zajedničkih površina. Inicijativa će obuhvatiti koordinaciju sa nadležnim institucijama i stručnim službama, kao i razmatranje relevantnih evropskih praksi koje mogu doprineti sistemskom rešavanju uočenih izazova.

Cilj projekta je da, kroz partnerski pristup i uključivanje zajednice, doprinese stvaranju uređenijeg, funkcionalnijeg i bezbednijeg okruženja za sve stanovnike. Detalji o aktivnostima biće predstavljeni nakon završetka pripremne faze i usaglašavanja sa institucijama.',
  'planiran',
  '',
  'Q3 2026',
  '',
  0,
  2,
  0,
  2
);

-- Dokument za projekat Unapređenje javnog prostora
INSERT INTO project_documents (project_id, title, url, file_type, sort_order)
SELECT p.id, 'Dokumentacija — javni prostor u Vrbovskom', '/galerija/unapredjenje-javnog-prostora.webp', 'image', 1
FROM projects p WHERE p.slug = 'unapredjenje-javnog-prostora';

-- Projekat 3: Otpornost kroz lokalne ekološke resurse
INSERT INTO projects (title, slug, description, status, cover_image, date_text, partner, phase_current, phase_total, progress_pct, sort_order) VALUES
(
  'Otpornost kroz lokalne ekološke resurse',
  'otpornost-lokalni-resursi',
  'Najava aktivnosti: Jačanje otpornosti naselja kroz lokalne ekološke resurse

U narednom periodu pokrećemo inicijativu usmerenu na unapređenje kvaliteta života u naselju kroz održivo uređenje javnih površina. Fokus je na afirmaciji lokalnih ekoloških resursa i savremenim pristupima koji doprinose boljoj mikroklimi, većoj otpornosti prostora i prijatnijem okruženju za sve stanovnike.

Aktivnosti će obuhvatiti:
• identifikaciju potencijala postojećih zelenih površina
• razvoj malih pilot-rešenja koja unapređuju otpornost prostora
• uključivanje zajednice kroz informativne i edukativne sadržaje

Cilj je da zajednički pokažemo kako promišljeno korišćenje lokalnih prirodnih vrednosti može doprineti stabilnijem, zdravijem i lepšem naselju.

Uskoro sledi više informacija o prvim koracima i mogućnostima uključivanja.',
  'planiran',
  '/galerija/otpornost-lokalni-resursi.webp',
  'Q4 2026',
  '',
  0,
  3,
  0,
  3
);

-- =============================================
-- 8. SEED - INICIJATIVE
-- =============================================

INSERT INTO initiatives (title, slug, description, status, cover_image, date_text, sort_order) VALUES
(
  'Dečije igralište',
  'decije-igraliste',
  'SAOPŠTENJE ZA JAVNOST

22.8.2025. Udruženje Inicijativa za održivi razvoj Vrbovskog podnelo je hitan zahtev komunalnoj inspekciji zbog neuređenog i nebezbednog gradilišta dečijeg igrališta na zelenoj površini između zgrada Vrbovski 16–19. Lokacija više od godinu dana nije obeležena, nema podatke o investitoru, a prostor je tretira hemijskim sredstvima bez upozorenja, što predstavlja rizik za stanovnike.

Zatražena je hitna kontrola, utvrđivanje zakonitosti radova i privremena obustava do utvrđivanja činjenica. O daljim koracima javnost će biti obaveštena.',
  'aktivan',
  '/galerija/decije-igraliste.webp',
  '22.8.2025.',
  1
),
(
  'Rasveta Besni Fok – Vrbovski',
  'rasveta-besni-fok-vrbovski',
  'Pokrenuta inicijativa za postavljanje javne rasvete duž trase „Besni Fok – Vrbovski"

27.8.2025. Udruženje je podneskom opštini Palilula i Gradskom Sekretarijatu za energetiku pokrenulo inicijativu za postavljanje javne rasvete na delu saobraćajnice koja povezuje Besni Fok i Vrbovski, na teritoriji MZ Padinska Skela. Reč je o jedinoj putnoj vezi Vrbovskog sa Zrenjaninskim putem i gradom Beogradom, koja je već duži niz godina u potpunom mraku. Neosvetljena trasa predstavlja ozbiljan bezbednosni rizik za stanovnike, javni prevoz i privredu.

Inicijativa se zasniva na važećem Planu generalne regulacije GO Palilula, koji propisuje da sve saobraćajnice moraju biti opremljene javnim osvetljenjem. Udruženje je podnelo zvaničan zahtev nadležnim institucijama i traži pokretanje postupka za tehničku procenu i postavljanje rasvete na ovoj kritičnoj deonici.

Cilj inicijative je povećanje bezbednosti, kvaliteta života i ravnopravnog tretmana svih naselja u okviru opštine.

Gradski Sekretarijat za energetiku je dao pozitivan odgovor ali konačan odgovor od opštine Palilula nije dobijen.',
  'aktivan',
  '/galerija/rasveta-besni-fok.webp',
  '27.8.2025.',
  2
),
(
  'Neprohodna pešačka staza',
  'staza-sneg',
  'Neprohodna pešačka staza u Vrbovskom ugrožava bezbednost građana

5.1.2026. Udruženje „Inicijativa za održivi razvoj Vrbovskog", postupajući u javnom interesu građana naselja Vrbovski (MZ Padinska Skela, opština Palilula), podnelo je prijavu nadležnim organima zbog nepostupanja po Odluci o komunalnom redu na pešačkoj stazi uz kolovoz, u dužini od oko 300 metara, na parceli 48/1 KO Kovilovo.

Navedena pešačka staza decenijama predstavlja ključnu komunikaciju unutar naselja, ali je u zimskim mesecima, bez redovnog komunalnog održavanja, u potpunosti neprohodna i ozbiljno ugrožava bezbednost građana, posebno dece i starijih lica koja se njome kreću ka zdravstvenim, trgovinskim i saobraćajnim sadržajima.

Iako se parcela nalazi u privatnom vlasništvu pravnog lica, staza se faktički koristi kao javna površina. Zbog toga Udruženje zahteva hitan inspekcijski nadzor, hitno uklanjanje snega i leda, kao i pokretanje postupka trajnog utvrđivanja nadležnosti za održavanje ove i drugih javnih površina u naselju Vrbovski, u skladu sa važećim planskim dokumentima.

Građani Vrbovskog ne smeju biti izloženi rizicima po bezbednost zbog nerešenih imovinsko-pravnih odnosa i institucionalnog nepostupanja.',
  'zavrsen',
  '/galerija/staza-sneg.webp',
  '5.1.2026.',
  3
),
(
  'Prevoz linija 102',
  'prevoz-102',
  'Prigovor nadležnim zbog obustave saobraćaja na liniji 102 tokom većeg dela dana 5. januara 2026

5.1.2026. Inicijativa građana Vrbovskog podnela je prigovor nadležnim službama zbog obustave saobraćaja na liniji 102 tokom većeg dela dana 5. januara 2026. godine, bez ikakvog prethodnog obaveštenja. Prevoz na ovoj liniji nije funkcionisao sve do 15.50 časova, što je dovelo do značajnih poteškoća za stanovnike koji su u jutarnjim i prepodnevnim satima uzaludno čekali prevoz na temperaturama ispod nule.

Od nadležnih je zatraženo da dostave razloge obustave, objasne zašto nije bilo zvaničnog obaveštenja i navedu koje će mere biti preduzete kako bi se sprečilo ponavljanje ovakvih situacija.',
  'zavrsen',
  '/galerija/prevoz-102.webp',
  '5.1.2026.',
  4
),
(
  'Stadion Vrbovski',
  'stadion-vrbovski',
  'Obaveštenje za javnost – Inicijativa za uređenje sportsko-rekreativne površine u Vrbovskom

11.2.2026. Pokrenuta je inicijativa za uređenje zapuštene sportsko-rekreativne površine u centralnoj zoni naselja Vrbovski, na parcelama 60 i delu 48/1 KO Kovilovo, koje su važećim urbanističkim planom već određene kao javna namena – „Rekreativni i sportski objekti i kompleksi".

Cilj inicijative je da se ovaj prostor, koji je trenutno zarasli, neosvetljen i nebezbedan za korišćenje, uredi tako da stanovnicima obezbedi bezbedno mesto za šetnju, trčanje, rekreaciju i boravak na otvorenom. Predložene mere obuhvataju košenje i čišćenje terena, uređenje kružnih staza, postavljanje javne rasvete i povezivanje prostora sa obližnjim šumskim kompleksom.

Uređenjem ovog prostora Vrbovski bi dobio pristupačnu, bezbednu i zdravu javnu površinu za sve generacije, što je u skladu sa zakonom, standardima javnog zdravlja i ciljevima održivog razvoja. Inicijativa ima za cilj da ova površina ostane trajno dostupna svim stanovnicima i da postane važan resurs za kvalitetniji život u zajednici.

Opština Palilula je odgovorila 18.2.2026. da uređenje ovog kompleksa nije u njenoj nadležnosti i uputila na gradsku nadležnost.',
  'aktivan',
  '/galerija/stadion-vrbovski.webp',
  '11.2.2026.',
  5
);

-- =============================================
-- MIGRACIJA: Dodaj kolonu category (pokreni ako tabele već postoje)
-- =============================================
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';
-- ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';

-- Postavi podrazumevane kategorije za seed podatke
-- UPDATE projects SET category = 'Životna sredina' WHERE slug = 'zeleni-obod-vrbovskog';
-- UPDATE projects SET category = 'Urbani razvoj'   WHERE slug = 'unapredjenje-javnog-prostora';
-- UPDATE projects SET category = 'Životna sredina' WHERE slug = 'otpornost-lokalni-resursi';
-- UPDATE initiatives SET category = 'Urbani razvoj'  WHERE slug = 'decije-igraliste';
-- UPDATE initiatives SET category = 'Javni prevoz'   WHERE slug = 'rasveta-besni-fok-vrbovski';
-- UPDATE initiatives SET category = 'Infrastruktura' WHERE slug = 'staza-sneg';
-- UPDATE initiatives SET category = 'Javni prevoz'   WHERE slug = 'prevoz-102';
-- UPDATE initiatives SET category = 'Urbani razvoj'  WHERE slug = 'stadion-vrbovski';
