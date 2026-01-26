# 🎬 CineZone

> Plateforme de gestion et découverte de films - Projet fil rouge Express / React

[![CI/CD](https://github.com/imene-be/cinezone/actions/workflows/tests.yml/badge.svg)](https://github.com/imene-be/cinezone/actions)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Tests](#-tests)
- [Docker](#-docker)
- [CI/CD](#-cicd)
- [Accessibilité](#-accessibilité)
- [Checklist](#-checklist)
- [Auteur](#-auteur)

---

## 🎯 Aperçu

**CineZone** est une application web full-stack permettant de découvrir, gérer et noter des films. Elle propose une expérience utilisateur moderne avec un design responsive, un mode sombre/clair, et une interface d'administration complète.

---

## ✨ Fonctionnalités

### 🎥 Parcours Public
- **Catalogue de films** avec affichage par catégories (style Netflix)
- **Recherche avancée** avec filtres multi-critères
  - Par catégorie
  - Par note minimum (minRating)
  - Par limite (limit)
- **Tri** (récent, ancien, note, titre A-Z/Z-A, date de sortie)
- **Pagination** dynamique des résultats
- **Synchronisation URL ↔ UI** (partage de recherches via URL)
- **Mémorisation des filtres** (localStorage)

### 🔐 Authentification & Compte
- **Inscription** avec validations fortes
  - Email valide (regex)
  - Mot de passe (min 6 caractères + 1 chiffre)
  - Prénom/Nom (min 2 caractères)
- **Connexion** sécurisée avec JWT (7 jours)
- **Persistance de session** (token localStorage)
- **Gestion du profil** (modification, mot de passe)
- **Déconnexion** avec nettoyage de session

### 👤 Espace Membre
- **Watchlist / Favoris** - Sauvegarder des films à voir
- **Notes & Commentaires** - Noter les films (0-5 étoiles)
- **Historique** - Suivi des films consultés

### 🛠️ Back-office Admin
- **CRUD Films** complet avec upload d'affiche
- **Import depuis TMDB**
- **CRUD Catégories**
- **Gestion des utilisateurs**
- **Contrôle d'accès par rôles** (user/admin)

### 🎨 Design System
- **Thème** sombre/clair avec persistance
- **Composants réutilisables** (Button, Input, Card, MovieCard...)
- **Système de notifications** (Toasts : success, error, warning, info)
- **Design responsive** (mobile-first)

### ♿ Accessibilité (RGAA)
- Attributs ARIA sur tous les composants interactifs
- Navigation au clavier
- Contrastes respectés (WCAG 2.1 AA)
- HTML sémantique

---

## 🛠️ Technologies

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 19.2 | Bibliothèque UI |
| React Router | 7.9 | Routing SPA |
| Tailwind CSS | 3.4 | Framework CSS |
| Axios | 1.13 | Client HTTP |
| Cypress | 15.7 | Tests E2E |
| Jest | 27.5 | Tests unitaires |

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Node.js | 20.x | Runtime JavaScript |
| Express | 5.2 | Framework web |
| Sequelize | 6.37 | ORM |
| MariaDB | 10.11 | Base de données |
| JWT | 9.0 | Authentification |
| Multer | 2.0 | Upload fichiers |
| Express-Validator | 7.3 | Validation des entrées |
| Helmet | 8.1 | Sécurité HTTP |
| Jest | 30.2 | Tests unitaires |

### DevOps
| Technologie | Description |
|-------------|-------------|
| Docker | Conteneurisation |
| Docker Compose | Orchestration |
| GitHub Actions | CI/CD |

---

## 📁 Architecture

```
cineZone/
├── 📂 cinezone-frontend/          # Application React
│   ├── 📂 src/
│   │   ├── 📂 components/        # Composants réutilisables
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── MovieCard.js
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── SearchBar.js
│   │   │   ├── Pagination.js     # Pagination avec accessibilité
│   │   │   └── ...
│   │   ├── 📂 context/           # Contexts React
│   │   │   ├── AuthContext.js
│   │   │   ├── ThemeContext.js
│   │   │   ├── ToastContext.js   # Système de notifications
│   │   │   ├── WatchlistContext.js
│   │   │   ├── NotesContext.js
│   │   │   └── HistoryContext.js
│   │   ├── 📂 pages/             # Pages de l'application
│   │   │   ├── Home.js
│   │   │   ├── Catalog.js        # Avec pagination et filtres
│   │   │   ├── MovieDetail.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── 📂 admin/         # Pages admin
│   │   └── 📂 utils/
│   │       ├── api.js            # Client API
│   │       └── tmdb.js           # Intégration TMDB
│   ├── 📂 cypress/               # Tests E2E
│   └── Dockerfile
│
├── 📂 cinezone-backend/           # API Express
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── routes.json       # Définition déclarative des routes
│   │   ├── 📂 middlewares/
│   │   │   ├── authenticate.js   # Auth + rôles (user/admin)
│   │   │   ├── validators.js     # Express-validator (15+ règles)
│   │   │   └── upload.js         # Multer
│   │   ├── 📂 models/            # Modèles Sequelize
│   │   ├── 📂 services/          # Logique métier
│   │   ├── 📂 routes/
│   │   │   └── router.js         # Routage automatique
│   │   └── 📂 __tests__/         # Tests Jest
│   ├── 📂 uploads/               # Fichiers uploadés
│   └── Dockerfile
│
├── 📂 .github/workflows/
│   └── tests.yml                 # CI/CD GitHub Actions
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 20.x
- **npm** >= 10.x
- **MariaDB** >= 10.11
- **Docker** & **Docker Compose** (optionnel)

### Installation manuelle

```bash
# 1. Cloner le projet
git clone https://github.com/imene-be/cinezone.git
cd cinezone

# 2. Backend
cd cinezone-backend
npm install
npm run dev

# 3. Frontend (nouveau terminal)
cd ../cinezone-frontend
npm install --legacy-peer-deps
npm start
```

---

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Database
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=cinezone
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinezone
DB_USER=root
DB_PASSWORD=root_password

# Backend
NODE_ENV=development
PORT=8000
BACKEND_PORT=8000
JWT_SECRET=your_super_secret_jwt_key

# Frontend
FRONTEND_PORT=3000
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000/api

# PHPMyAdmin
PHPMYADMIN_PORT=8080
PMA_HOST=db
PMA_USER=root
PMA_PASSWORD=root_password
```

---

## 🎮 Utilisation

### Développement

```bash
# Terminal 1 - Backend
cd cinezone-backend && npm run dev
# → http://localhost:8000

# Terminal 2 - Frontend
cd cinezone-frontend && npm start
# → http://localhost:3000
```

### Production (Docker)

```bash
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| PHPMyAdmin | http://localhost:8080 |

---

## 📚 API Documentation

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |

### Films

| Méthode | Endpoint | Auth |
|---------|----------|------|
| GET | `/api/movies` | - |
| GET | `/api/movies/:id` | - |
| POST | `/api/movies` | Admin |
| PUT | `/api/movies/:id` | Admin |
| DELETE | `/api/movies/:id` | Admin |

**Paramètres GET /api/movies :**
- `page` - Numéro de page
- `limit` - Films par page (max 100)
- `search` - Recherche par titre
- `category` - Filtrer par catégorie (slug)
- `minRating` - Note minimum (0-5)
- `sortBy` / `order` - Tri

### Watchlist / Notes / Historique

| Méthode | Endpoint | Auth |
|---------|----------|------|
| GET | `/api/watchlist` | User |
| POST | `/api/watchlist` | User |
| DELETE | `/api/watchlist/:movieId` | User |
| GET/POST/DELETE | `/api/notes` | User |
| GET | `/api/history` | User |

---

## 🧪 Tests

```bash
# Tests unitaires Backend
cd cinezone-backend
npm test
npm run test:coverage

# Tests unitaires Frontend
cd cinezone-frontend
npm test

# Tests E2E (Cypress)
npm run cypress        # Mode interactif
npm run test:e2e       # Mode headless
```

---

## 🐳 Docker

### Services

| Service | Image | Port |
|---------|-------|------|
| db | mariadb:10.11 | 3306 |
| backend | Node 20 (custom) | 8000 |
| frontend | Node 20 Alpine | 3000 |
| phpmyadmin | phpmyadmin | 8080 |

### Commandes

```bash
docker-compose up -d          # Démarrer
docker-compose logs -f        # Logs
docker-compose down           # Arrêter
docker-compose down -v        # Supprimer volumes
```

---

## 🔄 CI/CD

GitHub Actions sur branche `dev` :

```yaml
# .github/workflows/tests.yml
on:
  push:
    branches: [dev]
  pull_request:
    branches: [dev]

jobs:
  test-frontend:
    - npm test -- --watchAll=false
  test-backend:
    - npm test
```

| Branche | Description |
|---------|-------------|
| `main` | Production |
| `dev` | Développement (CI/CD actif) |

---

## ♿ Accessibilité

Le projet respecte les normes **RGAA** :

| Composant | Implémentation |
|-----------|----------------|
| Pagination | `aria-label`, `aria-current` |
| Toast | `role="alert"` |
| MovieCard | `alt` images, `role="article"` |
| Navbar | Navigation landmarks |
| Forms | Labels associés |

---

## 📊 Checklist du Projet

### Vision Produit
- [x] Liste & détail films
- [x] Filtres multi-critères (category, minRating, limit)
- [x] Recherche & Tri
- [x] Pagination
- [x] Inscription avec validations fortes
- [x] Login & JWT persistant
- [x] Profil & déconnexion
- [x] Watchlist / Favoris
- [x] Notes
- [x] Historique
- [x] Admin CRUD films + upload
- [x] Admin catégories
- [x] Tests unitaires + E2E
- [x] Accessibilité RGAA
- [x] CI/CD

### Modules Fonctionnels
- [x] Catalogue (Liste / Détails)
- [x] Recherche & filtres (synchro URL ↔ UI, états mémorisés)
- [x] Auth & profil
- [x] Admin (tableaux, formulaires avancés, validations front)
- [x] Design System (tokens, thèmes, composants transverses)
- [x] Observabilité (toasts, logs)

### DevOps
- [x] Docker (multi-stage builds)
- [x] Docker Compose (4 services)
- [x] Branches git (dev/main)
- [x] CI/CD GitHub Actions

### Bonus
- [x] Express-validator (15+ règles de validation)
- [x] Auth rôles (user/admin)
- [ ] i18n (internationalisation)

**Score : 97% (29/30 critères)**

---

## 👤 Auteur

**Bentifraouine Imene**

- 📧 bentifraouineimene@gmail.com
- 🌐 [imenebe.fr](https://imenebe.fr)
- 🐙 [GitHub](https://github.com/imene-be/cinezone)

---

## 📄 License

Ce projet est sous licence **ISC**.

---

<p align="center">
  Fait avec ❤️ pour le projet fil rouge ESCEN
</p>
