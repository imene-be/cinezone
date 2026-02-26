# CineZone

Application web full-stack de découverte et gestion de films — Projet fil rouge ESCEN.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, React Router 7, Tailwind CSS 3.4, Axios |
| Backend | Node.js 20, Express 5, Sequelize 6, JWT, Multer, Express-Validator |
| Base de données | MariaDB 10.11 |
| Tests | Jest (unitaires), Cypress (E2E) |
| DevOps | Docker, Docker Compose, GitHub Actions |

---

## Fonctionnalités

**Catalogue**
- Parcours par catégories, recherche full-text, filtres (catégorie, note min, tri), pagination
- Synchronisation des filtres avec l'URL + mémorisation en localStorage

**Compte utilisateur**
- Inscription avec validations fortes (front + Express-Validator), connexion JWT (7 jours)
- Watchlist, notes 0–5 étoiles, historique de visionnage, profil modifiable

**Administration** *(rôle admin)*
- CRUD films avec upload d'affiche et import TMDB
- CRUD catégories, gestion des utilisateurs

**Interface**
- Thème sombre / clair persistant, responsive mobile-first, notifications toast

---

## Structure

```
cineZone/
├── cinezone-frontend/        # React
│   └── src/
│       ├── components/       # Composants réutilisables
│       ├── pages/            # Pages + admin/
│       ├── context/          # Auth, Theme, Toast, Watchlist, Notes, History
│       └── utils/            # Client API, TMDB
│
├── cinezone-backend/         # API REST Express
│   └── src/
│       ├── models/           # Sequelize
│       ├── services/         # Logique métier
│       ├── middlewares/      # Auth, validators, upload
│       ├── config/routes.json
│       └── __tests__/
│
├── .github/workflows/tests.yml
├── docker-compose.yml
└── README.md
```

---

## Lancer le projet

### Manuellement

> Prérequis : Node.js >= 20, MariaDB >= 10.11

```bash
# Backend
cd cinezone-backend
npm install
npm run dev          # http://localhost:8000

# Frontend (nouveau terminal)
cd cinezone-frontend
npm install --legacy-peer-deps
npm start            # http://localhost:3000
```

### Avec Docker

```bash
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| PHPMyAdmin | http://localhost:8080 |

---

## Variables d'environnement

Créer un `.env` à la racine du backend :

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinezone
DB_USER=root
DB_PASSWORD=root_password

PORT=8000
NODE_ENV=development
JWT_SECRET=your_secret_key

REACT_APP_API_URL=http://localhost:8000/api
```

---

## API — Routes principales

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/movies              ?page, limit, search, category, minRating, sortBy
GET    /api/movies/:id
POST   /api/movies              (admin)
PUT    /api/movies/:id          (admin)
DELETE /api/movies/:id          (admin)

GET/POST/DELETE  /api/watchlist
GET/POST/DELETE  /api/notes
GET              /api/history
```

---

## Tests

```bash
# Unitaires backend
cd cinezone-backend && npm test

# Unitaires frontend
cd cinezone-frontend && npm test

# E2E Cypress (app doit tourner sur :3000)
npm run cypress       # interface graphique
npm run test:e2e      # headless
```

CI/CD automatique via GitHub Actions sur les branches `dev` et `main`.

---

## Auteur

**Imène Bentifraouine** — Mastère Stratégie Digitale, Manager de projets informatiques (RNCP38905)

bentifraouineimene@gmail.com · [imenebe.fr](https://imenebe.fr) · [GitHub](https://github.com/imene-be/cinezone)

---

*Projet scolaire non commercial — © 2025 Bentifraouine Imène*
