# 🚀 GitHub Push Instrukcije

## Kreiranje GitHub Repozitorijuma

### Korak 1: Kreirajte novi repozitorijum na GitHub-u

1. Idite na [github.com](https://github.com)
2. Kliknite na **"+"** u gornjem desnom uglu
3. Odaberite **"New repository"**
4. Unesite naziv: **VRBOVSKO**
5. **VAŽNO**: Ne klikcite na "Initialize this repository with a README"
6. Kliknite **"Create repository"**

### Korak 2: Povežite lokalni projekat sa GitHub-om

Kopirajte i izvršite ove komande u PowerShell-u (u direktorijumu projekta):

```powershell
# Dodajte GitHub repozitorijum kao remote
git remote add origin https://github.com/YOUR_USERNAME/VRBOVSKO.git

# Proverite da li je remote dodat
git remote -v

# Push kod na GitHub (main branch)
git branch -M main
git push -u origin main
```

**Napomena**: Zamenite `YOUR_USERNAME` sa vašim GitHub korisničkim imenom!

### Korak 3: Potvrdite da je push-ovano

1. Otvorite vaš GitHub repozitorijum u browser-u
2. Trebalo bi da vidite sve fajlove (index.html, css/, js/, itd.)
3. Commit message će biti: "Initial commit: Vrbovsko website foundation"

## 🌐 GitHub Pages Deployment (Opciono)

Ako želite da sajt bude javno dostupan na GitHub Pages:

### Korak 1: Omogućite GitHub Pages

1. Idite na Settings vašeg repozitorijuma na GitHub-u
2. U levom meniju odaberite **"Pages"**
3. Pod **"Source"** odaberite **"GitHub Actions"**

### Korak 2: Automatski Deploy

GitHub Actions je već konfigurisan! Svaki put kada push-ujete promene na `main` granu:

```powershell
git add .
git commit -m "Nova promena"
git push origin main
```

Sajt će automatski biti build-ovan i deploy-ovan na:
```
https://YOUR_USERNAME.github.io/VRBOVSKO/
```

Build proces traje oko 1-2 minuta.

## 📝 Svakodnevni Workflow

### Kada radite izmene na sajtu:

```powershell
# 1. Napravite promene u fajlovima

# 2. Proverite status
git status

# 3. Dodajte promene
git add .

# 4. Commit-ujte sa porukom
git commit -m "Opis vaših promena"

# 5. Push-ujte na GitHub
git push origin main
```

### Primer commit poruka:

```
git commit -m "Dodato: Nova sekcija za projekte"
git commit -m "Popravka: Responsive dizajn na mobilnim uređajima"
git commit -m "Ažurirano: Tekstualni sadržaj na početnoj strani"
```

## 🔧 Korisne Git Komande

```powershell
# Pogledajte istoriju commit-ova
git log --oneline

# Pogledajte promene koje niste commit-ovali
git diff

# Vratite fajl na prethodnu verziju
git checkout HEAD -- naziv-fajla.html

# Kreirajte novu granu za eksperiment
git checkout -b nova-feature

# Vratite se na main granu
git checkout main

# Merge-ujte granu u main
git merge nova-feature
```

## ❗ Česte Greške i Rešenja

### Greška: "Authentication failed"

**Rešenje**: Koristite Personal Access Token umesto lozinke:

1. Idite na GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Odaberite scope: `repo` (full control)
4. Kopirajte token
5. Koristite token umesto lozinke kada git zatraži autentifikaciju

### Greška: "Updates were rejected"

**Rešenje**: Pull-ujte najnovije izmene sa GitHub-a prvo:

```powershell
git pull origin main --rebase
git push origin main
```

## 📞 Dodatna Pomoć

- [GitHub Documentation](https://docs.github.com/)
- [Git Command Reference](https://git-scm.com/docs)
- [GitHub Pages Guide](https://docs.github.com/en/pages)

---

**Sledeći korak**: Pokrenite dev server lokalno!

```powershell
npm run dev
```

Otvorite http://localhost:3000/ u browser-u da vidite sajt! 🎉
