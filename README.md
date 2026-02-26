# 🎬 CineZone

> Application web full-stack de découverte et gestion de films — Projet fil rouge ESCEN

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

---

## ✨ Fonctionnalités

- Catalogue de films par catégories, recherche, filtres multi-critères, tri et pagination
- Synchronisation URL ↔ UI + mémorisation des filtres (localStorage)
- Inscription avec validations fortes, connexion JWT (7j), profil modifiable
- Watchlist, notes (0–5 étoiles), historique de visionnage
- Back-office admin : CRUD films (upload + import TMDB), catégories, utilisateurs
- Thème sombre / clair, responsive mobile-first, notifications toast
- Accessibilité RGAA (ARIA, navigation clavier, contrastes WCAG 2.1 AA)

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

> Prérequis : Node.js >= 20.x, MariaDB >= 10.11

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
npm run test:e2e       # E2E headless (app doit tourner sur :3000)
```

CI/CD automatique via GitHub Actions sur `dev` et `main`.

---

## 👤 Auteur

**Bentifraouine Imène** — Mastère Stratégie Digitale, Manager de projets informatiques (RNCP38905)

📧 bentifraouineimene@gmail.com · 🌐 [imenebe.fr](https://imenebe.fr) · 🐙 [GitHub](https://github.com/imene-be/cinezone)

---

<p align="center">Fait avec ❤️ pour le projet fil rouge ESCEN</p>
