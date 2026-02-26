# 🐳 Docker - CineZone

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## Démarrage

### 1. Créer le fichier `.env` à la racine

```env
DB_ROOT_PASSWORD=root
DB_NAME=cineZone
DB_USER=cinezone
DB_PASSWORD=cinezone
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_api_key
```

### 2. Lancer

```bash
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| PHPMyAdmin | http://localhost:8080 |

---

## Commandes utiles

```bash
# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Rebuilder
docker-compose up -d --build

# Supprimer les données (⚠️)
docker-compose down -v
```
