# CineZone

> Plateforme de découverte de films, catalogue, compte utilisateur et back-office admin. Projet fil rouge ESCEN.

---

## Fonctionnalités

**Catalogue & Recherche** : parcours par catégories, filtres, tri, pagination, synchro URL

**Compte** : inscription, connexion JWT, profil, watchlist, notes, historique

**Admin** : CRUD films (upload + import TMDB), catégories, gestion utilisateurs

**Interface** : thème sombre/clair, responsive, notifications, accessibilité RGAA

---

## Technologies

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

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/imene-be/cinezone.git
cd cinezone
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

Ouvrir `.env` et renseigner :
- `TMDB_API_KEY` — clé gratuite sur [themoviedb.org](https://www.themoviedb.org/settings/api)
- `JWT_SECRET` — n'importe quelle longue chaîne aléatoire

### 3. Lancer

```bash
docker-compose up -d
```

Attendre ~30 secondes le temps que les services démarrent.

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| API | http://localhost:8000/api |
| PHPMyAdmin | http://localhost:8080 |

---

## Tests

```bash
cd cinezone-backend && npm test
cd cinezone-frontend && npm test
npm run cypress        # E2E interactif
npm run test:e2e       # E2E headless (port 3000)
```

CI/CD automatique via GitHub Actions sur `dev` et `main`.

---

## Auteur

**Bentifraouine Imène**  Mastère Stratégie Digitale, Manager de projets informatiques (RNCP38905)

bentifraouineimene@gmail.com · [imenebe.fr](https://imenebe.fr) · [GitHub](https://github.com/imene-be/cinezone)

---

<p align="center">Projet fil rouge N4 ESCEN</p>
