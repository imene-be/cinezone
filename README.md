# 🎬 CineZone

> Plateforme de découverte de films — catalogue, compte utilisateur et back-office admin. Projet fil rouge ESCEN.

---

## ✨ Fonctionnalités

**Catalogue & Recherche** — parcours par catégories, filtres, tri, pagination, synchro URL

**Compte** — inscription, connexion JWT, profil, watchlist, notes, historique

**Admin** — CRUD films (upload + import TMDB), catégories, gestion utilisateurs

**Interface** — thème sombre/clair, responsive, notifications, accessibilité RGAA

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

> Prérequis : Node.js >= 20. et MariaDB >= 10.11

```bash
# Backend
cd cinezone-backend && npm install && npm run dev    # → :8000

# Frontend (nouveau terminal)
cd cinezone-frontend && npm install --legacy-peer-deps && npm start    # → :3000

# Ou avec Docker
docker-compose up -d
```

---

## ⚙️ Configuration

Créer un `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinezone
DB_USER=root
DB_PASSWORD=root_password
NODE_ENV=development
PORT=8000
JWT_SECRET=your_secret_key
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000/api
PHPMYADMIN_PORT=8080
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
