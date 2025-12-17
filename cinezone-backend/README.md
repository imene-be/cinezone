# Backend CineZone

API REST pour la gestion de films.

## Installation

```bash
npm install
```

## Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

## Tests

```bash
npm test
```

## Structure

```
src/
├── models/         # Modèles Sequelize
├── services/       # Logique métier
├── routes/         # Routes Express
├── middlewares/    # Middlewares
├── utils/          # Utilitaires
└── __tests__/      # Tests
```

## Technologies

- Node.js
- Express
- Sequelize
- MariaDB
- JWT
- Multer
- Jest (tests)

## Variables d'environnement

Créer `.env` avec :

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cineZone
DB_USER=root
DB_PASSWORD=root

JWT_SECRET=votre_secret
JWT_EXPIRES_IN=7d

PORT=8000
NODE_ENV=development
```

## Routes principales

- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/movies` - Liste des films
- `POST /api/movies` - Créer un film (admin)
- `GET /api/watchlist` - Ma watchlist
- `GET /api/history` - Mon historique
