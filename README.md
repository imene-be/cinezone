# 🎬 CineZone

> Plateforme de découverte de films, catalogue, compte utilisateur et back-office admin. Projet fil rouge ESCEN.

---

## ✨ Fonctionnalités

**Catalogue & Recherche** : parcours par catégories, filtres, tri, pagination, synchro URL

**Compte** : inscription, connexion JWT, profil, watchlist, notes, historique

**Admin** : CRUD films (upload + import TMDB), catégories, gestion utilisateurs

**Interface** : thème sombre/clair, responsive, notifications, accessibilité RGAA

---

## 🛠️ Technologies

### Frontend
| Technologie | Description |
|-------------|-------------|
| React | Bibliothèque UI |
| React Router | Routing SPA |
| Tailwind CSS | Framework CSS |
| Axios | Client HTTP |
| Cypress | Tests E2E |
| Jest | Tests unitaires |

### Backend
| Technologie | Description |
|-------------|-------------|
| Node.js | Runtime JavaScript |
| Express | Framework web |
| Sequelize | ORM |
| MariaDB | Base de données |
| JWT | Authentification |
| Multer | Upload fichiers |
| Express-Validator | Validation des entrées |
| Helmet | Sécurité HTTP |
| Jest | Tests unitaires |

### DevOps
| Technologie | Description |
|-------------|-------------|
| Docker | Conteneurisation |
| Docker Compose | Orchestration |
| GitHub Actions | CI/CD |

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/imene-be/cinezone.git
cd cinezone
```

### 2. Créer le fichier `.env` à la racine

```env
DB_ROOT_PASSWORD=root
DB_NAME=cineZone
DB_USER=cinezone
DB_PASSWORD=cinezone
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_api_key
```

### 3. Lancer

**Avec Docker (recommandé) :**

```bash
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| PHPMyAdmin | http://localhost:8080 |

**Sans Docker :**

> Prérequis : Node.js >= 20 et MariaDB >= 10.11

```bash
# Terminal 1 — Backend
cd cinezone-backend && npm install && npm run dev

# Terminal 2 — Frontend
cd cinezone-frontend && npm install --legacy-peer-deps && npm start
```

---

## 🧪 Tests

```bash
cd cinezone-backend && npm test
cd cinezone-frontend && npm test
npm run cypress        # E2E interactif
npm run test:e2e       # E2E headless (port 3000)
```

CI/CD automatique via GitHub Actions sur `dev` et `main`.

---

## 👤 Auteur

**Bentifraouine Imène**  Mastère Stratégie Digitale, Manager de projets informatiques (RNCP38905)

📧 bentifraouineimene@gmail.com · 🌐 [imenebe.fr](https://imenebe.fr) · 🐙 [GitHub](https://github.com/imene-be/cinezone)

---

<p align="center">Projet fil rouge N4 ESCEN</p>
