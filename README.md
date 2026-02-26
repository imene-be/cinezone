# CineZone

Application web de découverte et gestion de films — Projet fil rouge ESCEN.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)

**Stack :** React 19 · React Router 7 · Tailwind CSS · Node.js 20 · Express 5 · Sequelize · MariaDB · JWT · Docker · GitHub Actions

---

## Lancer le projet

```bash
# Backend
cd cinezone-backend && npm install && npm run dev   # :8000

# Frontend
cd cinezone-frontend && npm install --legacy-peer-deps && npm start   # :3000

# Ou tout avec Docker
docker-compose up -d
```

## Variables d'environnement

Créer un `.env` dans `cinezone-backend/` :

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinezone
DB_USER=root
DB_PASSWORD=root_password
PORT=8000
JWT_SECRET=your_secret_key
REACT_APP_API_URL=http://localhost:8000/api
```

## Tests

```bash
cd cinezone-backend && npm test
cd cinezone-frontend && npm test
npm run test:e2e   # Cypress (app sur :3000)
```

---

**Imène Bentifraouine** — Mastère Stratégie Digitale (RNCP38905)
bentifraouineimene@gmail.com · [imenebe.fr](https://imenebe.fr)
