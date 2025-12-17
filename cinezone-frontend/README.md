# Frontend CineZone

Application React pour la gestion de films.

## Installation

```bash
npm install
```

## Démarrage

```bash
# Développement
npm start

# Production
npm run build
```

## Tests

```bash
# Lancer les tests
npm test

# Mode watch
npm test -- --watch
```

## Structure

```
src/
├── components/      # Composants réutilisables
├── pages/          # Pages de l'application
├── context/        # Contexts React
├── utils/          # Utilitaires
└── __tests__/      # Tests
```

## Technologies

- React 19
- React Router
- Axios
- TailwindCSS
- Jest (tests)

## Variables d'environnement

Créer `.env` avec :

```env
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_TMDB_API_KEY=votre_cle
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

## Tests E2E (Cypress)

Les tests End-to-End simulent un utilisateur réel.

```bash
# Ouvrir Cypress (interface graphique)
npm run cypress

# Lancer les tests en mode headless
npm run test:e2e
```

**Note :** L'application doit tourner sur http://localhost:3000 pour les tests E2E.

### Workflow complet

```bash
# Terminal 1 : Démarrer l'app
npm start

# Terminal 2 : Lancer les tests E2E
npm run test:e2e
```
