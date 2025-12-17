# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances
RUN npm ci

# Stage 2: Production
FROM node:20-alpine AS production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copier les dépendances depuis le stage précédent
COPY --from=dependencies /app/node_modules ./node_modules

# Copier le code source
COPY --chown=nodejs:nodejs . .

# Créer le répertoire uploads avec les bonnes permissions
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=8000

# Exposer le port
EXPOSE 8000

# Passer à l'utilisateur non-root
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Démarrer l'application
CMD ["node", "index.js"]

# Stage 3: Development (optionnel)
FROM node:20-alpine AS development

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances
RUN npm install

# Copier le code source
COPY . .

# Créer le répertoire uploads
RUN mkdir -p uploads

# Exposer le port et le port de debug
EXPOSE 8000 9229

# Démarrer avec nodemon pour le hot-reload
CMD ["npm", "run", "dev"]
