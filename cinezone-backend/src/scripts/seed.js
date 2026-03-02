require('dotenv').config();
const { sequelize } = require('../utils/db');
const { Movie, Category, MovieCategory } = require('../models');

const TMDB_API_KEY = process.env.TMDB_API_KEY || '5dc45758a424def816c14458df01996f';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Mapping des genres TMDB
const genreMapping = {
  28: { name: 'Action', slug: 'action' },
  12: { name: 'Aventure', slug: 'aventure' },
  16: { name: 'Animation', slug: 'animation' },
  35: { name: 'Comédie', slug: 'comedie' },
  80: { name: 'Crime', slug: 'crime' },
  99: { name: 'Documentaire', slug: 'documentaire' },
  18: { name: 'Drame', slug: 'drame' },
  10751: { name: 'Famille', slug: 'famille' },
  14: { name: 'Fantastique', slug: 'fantastique' },
  36: { name: 'Histoire', slug: 'histoire' },
  27: { name: 'Horreur', slug: 'horreur' },
  10402: { name: 'Musique', slug: 'musique' },
  9648: { name: 'Mystère', slug: 'mystere' },
  10749: { name: 'Romance', slug: 'romance' },
  878: { name: 'Science-Fiction', slug: 'science-fiction' },
  10770: { name: 'Téléfilm', slug: 'telefilm' },
  53: { name: 'Thriller', slug: 'thriller' },
  10752: { name: 'Guerre', slug: 'guerre' },
  37: { name: 'Western', slug: 'western' }
};

async function fetchFromTMDB(endpoint) {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=fr-FR`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`TMDB Error: ${response.status}`);
  return response.json();
}

async function getMovieDetails(movieId) {
  return fetchFromTMDB(`/movie/${movieId}?append_to_response=videos`);
}

async function seed() {
  try {
    console.log('Démarrage du seed...\n');

    // Connexion DB
    await sequelize.authenticate();
    console.log('Connexion DB OK\n');

    // Sync tables
    await sequelize.sync({ force: true });
    console.log('Tables recréées\n');

    // 1. Créer les catégories
    console.log('Création des catégories...');
    const categories = {};
    for (const [tmdbId, data] of Object.entries(genreMapping)) {
      const cat = await Category.create({
        name: data.name,
        slug: data.slug,
        description: `Films de ${data.name.toLowerCase()}`
      });
      categories[tmdbId] = cat.id;
    }
    console.log(`✅ ${Object.keys(categories).length} catégories créées\n`);

    // 2. Récupérer les films populaires (5 pages = 100 films)
    console.log('Récupération des films depuis TMDB...');
    const allMovies = [];

    for (let page = 1; page <= 5; page++) {
      const data = await fetchFromTMDB(`/movie/popular?page=${page}`);
      allMovies.push(...data.results);
      console.log(`Page ${page}/5 récupérée (${data.results.length} films)`);
    }

    // Ajouter aussi quelques films bien notés
    for (let page = 1; page <= 3; page++) {
      const data = await fetchFromTMDB(`/movie/top_rated?page=${page}`);
      allMovies.push(...data.results);
    }
    console.log(`${allMovies.length} films récupérés au total\n`);

    // 3. Insérer les films
    console.log('Insertion des films en base...');
    const insertedMovies = new Set();
    let count = 0;

    for (const tmdbMovie of allMovies) {
      // Éviter les doublons
      if (insertedMovies.has(tmdbMovie.id)) continue;
      insertedMovies.add(tmdbMovie.id);

      try {
        // Récupérer les détails pour avoir la durée et le trailer
        const details = await getMovieDetails(tmdbMovie.id);

        // Trouver le trailer YouTube
        let trailerUrl = null;
        if (details.videos?.results?.length > 0) {
          const trailer = details.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          if (trailer) {
            trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
          }
        }

        // Créer le film
        const movie = await Movie.create({
          title: tmdbMovie.title,
          description: tmdbMovie.overview || 'Aucune description disponible.',
          releaseDate: tmdbMovie.release_date || null,
          duration: details.runtime || null,
          poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}` : null,
          trailer: trailerUrl,
          status: 'published',
          averageRating: (tmdbMovie.vote_average / 2).toFixed(2), // Convertir de /10 à /5
          ratingsCount: tmdbMovie.vote_count || 0
        });

        // Associer les catégories
        if (tmdbMovie.genre_ids?.length > 0) {
          for (const genreId of tmdbMovie.genre_ids) {
            if (categories[genreId]) {
              await MovieCategory.create({
                movieId: movie.id,
                categoryId: categories[genreId]
              });
            }
          }
        }

        count++;
        if (count % 10 === 0) {
          console.log(`   ${count} films insérés...`);
        }

        // Petit délai pour éviter le rate limiting TMDB
        await new Promise(r => setTimeout(r, 100));

      } catch (err) {
        console.log(`Erreur pour "${tmdbMovie.title}": ${err.message}`);
      }
    }

    console.log(`\n ${count} films insérés avec succès!`);
    console.log('\n Seed terminé!\n');

    // Stats finales
    const movieCount = await Movie.count();
    const categoryCount = await Category.count();
    console.log(`Statistiques:`);
    console.log(`- ${movieCount} films`);
    console.log(`- ${categoryCount} catégories\n`);

    process.exit(0);

  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

seed();
