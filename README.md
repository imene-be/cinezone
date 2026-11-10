# CineZone

Plateforme de découverte de films : catalogue, recherche, compte utilisateur et back-office d'administration. Projet fil rouge du Mastère ESCEN, conçu comme une application complète, testée et conteneurisée.

## Fonctionnalités

**Catalogue et recherche**
- Parcours par catégories, filtres, tri et pagination
- Filtres synchronisés avec l'URL

**Compte utilisateur**
- Inscription et connexion par JWT
- Profil, watchlist, notes et historique

**Administration**
- Création, modification et suppression de films, avec upload d'affiche et import depuis TMDB
- Gestion des catégories et des utilisateurs

**Interface**
- Thème sombre et clair, responsive
- Notifications et accessibilité (RGAA)

## Architecture

```
cinezone/
  cinezone-frontend/   application React (pages, composants, contexte, tests, Cypress)
  cinezone-backend/    API Express (routes, services, modèles Sequelize, middlewares)
  docker-compose.yml   orchestration des services
  .github/workflows/   intégration continue
```

Le back-end sépare les responsabilités : routes, services métier, modèles, middlewares d'authentification, de validation, d'upload et de gestion d'erreurs.

## Technologies

| Couche | Outils |
|---|---|
| Frontend | React, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, Sequelize, MariaDB, JWT, Multer, Express-Validator, Helmet |
| Tests | Jest, Cypress |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/imene-be/cinezone.git
cd cinezone
```

### 2. Créer le fichier `.env` à la racine

```env
# Base de données
DB_NAME=cineZone
DB_USER=root
DB_PASSWORD=root

# Backend
JWT_SECRET=une_longue_chaine_aleatoire

# TMDB : clé gratuite sur https://www.themoviedb.org/settings/api
TMDB_API_KEY=votre_cle_tmdb
```

Deux valeurs sont à renseigner : `JWT_SECRET` (n'importe quelle longue chaîne aléatoire) et `TMDB_API_KEY`.

### 3. Lancer

```bash
docker-compose up -d --build
```

Comptez une quarantaine de secondes le temps que les services démarrent.

| Service | Adresse |
|---|---|
| Application | http://localhost:3000 |
| API | http://localhost:8000/api |
| phpMyAdmin | http://localhost:8080 |

## Tests

```bash
cd cinezone-backend && npm test
cd cinezone-frontend && npm test
npm run cypress        # tests E2E en mode interactif
npm run test:e2e       # tests E2E sans interface
```

Les tests s'exécutent automatiquement avec GitHub Actions sur les branches `dev` et `main`.

---

Réalisé par [Imène Bentifraouine](https://imenebe.fr), dans le cadre du projet fil rouge N4 du Mastère ESCEN (Stratégie digitale, manager de projets informatiques).
