# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ARG REACT_APP_BASE_URL
ARG REACT_APP_TMDB_API_KEY
ARG REACT_APP_TMDB_BASE_URL
ARG REACT_APP_TMDB_IMAGE_BASE_URL

ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_TMDB_API_KEY=$REACT_APP_TMDB_API_KEY
ENV REACT_APP_TMDB_BASE_URL=$REACT_APP_TMDB_BASE_URL
ENV REACT_APP_TMDB_IMAGE_BASE_URL=$REACT_APP_TMDB_IMAGE_BASE_URL

# Build de l'application
RUN npm run build

# Stage 2: Production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis le stage précédent
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
