# 🐳 Guide Docker - CineZone

## 📋 Prérequis

- Docker Desktop installé : https://www.docker.com/products/docker-desktop
- Docker Compose (inclus avec Docker Desktop)

## 🚀 Démarrage rapide

### 1. Configuration

Copiez le fichier `.env.example` en `.env` et modifiez les valeurs :

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé API TMDB :
```
TMDB_API_KEY=votre_clé_api_tmdb
```

### 2. Lancer tous les services

```bash
docker-compose up -d
```

Cette commande lance :
- **Base de données** MariaDB sur le port **3306**
- **Backend API** Node.js sur le port **8000**
- **Frontend** React (Nginx) sur le port **3000**
- **PHPMyAdmin** sur le port **8080**

### 3. Accéder aux services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Application React |
| Backend API | http://localhost:8000 | API REST Node.js |
| PHPMyAdmin | http://localhost:8080 | Interface de gestion DB |
| MariaDB | localhost:3306 | Base de données |

## 📦 Commandes Docker utiles

### Lancer les services
```bash
# Lancer en mode détaché (arrière-plan)
docker-compose up -d

# Lancer avec logs visibles
docker-compose up

# Lancer un service spécifique
docker-compose up -d backend
```

### Arrêter les services
```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker-compose down -v
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuilder les images
```bash
# Rebuilder tout
docker-compose build

# Rebuilder un service spécifique
docker-compose build backend

# Rebuilder et relancer
docker-compose up -d --build
```

### Vérifier l'état des services
```bash
# Liste des conteneurs en cours
docker-compose ps

# Voir l'utilisation des ressources
docker stats
```

### Exécuter des commandes dans un conteneur
```bash
# Ouvrir un terminal dans le backend
docker-compose exec backend sh

# Exécuter une commande npm
docker-compose exec backend npm install

# Accéder à la base de données
docker-compose exec db mysql -u cinezone -p
```

## 🔧 Mode développement vs Production

### Développement (par défaut)
```bash
# Le code est monté en volume, hot-reload activé
NODE_ENV=development docker-compose up -d
```

### Production
```bash
# Utilise les images optimisées
NODE_ENV=production docker-compose up -d --build
```

## 🛠️ Dépannage

### Le frontend ne se connecte pas au backend
Vérifiez que `REACT_APP_BASE_URL` dans `.env` pointe vers `http://localhost:8000/api`

### La base de données ne démarre pas
```bash
# Supprimer le volume et recréer
docker-compose down -v
docker-compose up -d db
```

### Problème de permissions sur les uploads
```bash
docker-compose exec backend sh
chmod -R 777 uploads
```

### Nettoyer complètement Docker
```bash
# Supprimer tous les conteneurs, volumes et images du projet
docker-compose down -v --rmi all

# Nettoyer le système Docker (attention !)
docker system prune -a
```

## 📊 Healthchecks

Tous les services ont des healthchecks configurés :
- **DB** : Vérifie la connexion MariaDB
- **Backend** : Vérifie l'endpoint `/health`
- **Frontend** : Vérifie que Nginx répond

Pour voir l'état de santé :
```bash
docker-compose ps
```

## 🔐 Sécurité

⚠️ **Important pour la production** :
1. Changez `JWT_SECRET` dans `.env`
2. Changez les mots de passe de la base de données
3. N'exposez pas PHPMyAdmin publiquement
4. Utilisez HTTPS en production

## 📝 Structure des volumes

```
volumes:
  - mariadb_data          # Données de la base de données
  - backend_uploads       # Fichiers uploadés (posters, etc.)
```

Les volumes persistent même après `docker-compose down`. Pour supprimer les données, utilisez `-v`.
