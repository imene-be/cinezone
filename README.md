# 🎬 CineZone - Plateforme de Films

Application web de gestion de films avec authentification, watchlist et interface d'administration.

## 🚀 Démarrage Rapide avec Docker

```bash
# Copier les variables d'environnement
cp .env.example .env

# Lancer tous les services
docker-compose up
```

**Accès:**
- Frontend : http://localhost
- Backend API : http://localhost:8000
- PhpMyAdmin : http://localhost:8080 (avec --profile dev)

## 🛠️ Installation Manuelle

### Backend
```bash
cd cinezone-backend
npm install
npm start
```

### Frontend
```bash
cd cinezone-frontend
npm install
npm start
```

## 📁 Structure

```
cineZone/
├── cinezone-frontend/    # React App
├── cinezone-backend/     # Express API
├── docker-compose.yml    # Docker config
└── .env.example          # Variables template
```

## 🧪 Tests

```bash
# Frontend
cd cinezone-frontend
npm test

# Backend
cd cinezone-backend
npm test
```

## 🌿 Branches Git

- `main` - Production
- `dev` - Développement

```bash
# Nouvelle fonctionnalité
git checkout dev
git checkout -b feature/ma-fonctionnalite
git push origin feature/ma-fonctionnalite
```

## 🐳 Docker

```bash
# Démarrer
docker-compose up

# Rebuild
docker-compose up --build

# Arrêter
docker-compose down

# Logs
docker-compose logs -f
```

## 🔑 Fonctionnalités

- ✅ Authentification JWT
- ✅ CRUD Films
- ✅ Intégration TMDB
- ✅ Watchlist & Notes
- ✅ Historique
- ✅ Interface Admin
- ✅ Thème clair/sombre
- ✅ Accessibilité RGAA
- ✅ **Filtres avec synchro URL ↔ UI**
- ✅ **Mémorisation des filtres (localStorage)**

### 🔗 Synchronisation URL et Filtres

Le catalogue supporte la **synchronisation bidirectionnelle** entre l'URL et l'interface :

```
/catalog?q=inception&category=1&minRating=7&sort=rating
```

**Avantages** :
- 🔗 Partage de liens avec filtres actifs
- 🔄 Navigation navigateur (précédent/suivant)
- 💾 Mémorisation entre sessions (localStorage)
- 🔖 Bookmarks avec filtres

Voir [FEATURES.md](FEATURES.md) pour plus de détails.

## 📚 Documentation

- [Frontend](cinezone-frontend/README.md)
- [Backend](cinezone-backend/README.md)

## 👤 Auteur

**Imene Bentifraouine**
- 📧 bentifraouineimene@gmail.com
- 🌐 [imenebe.fr](https://imenebe.fr)

## 🎯 Tests E2E

Les tests End-to-End vérifient le parcours utilisateur complet.

```bash
cd cinezone-frontend

# Interface graphique
npm run cypress

# Mode automatique
npm run test:e2e
```

**Important :** Démarrez l'application avant de lancer les tests E2E !

```bash
# Terminal 1
docker-compose up
# OU
npm start

# Terminal 2
npm run test:e2e
```
