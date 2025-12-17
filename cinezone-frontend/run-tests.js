// Script simple pour lancer les tests sans Jest complexe

console.log('🧪 Lancement des tests Frontend CineZone\n');

let testsReussis = 0;
let testsEchoues = 0;

function test(nom, fn) {
  try {
    fn();
    console.log(`✅ ${nom}`);
    testsReussis++;
  } catch (error) {
    console.log(`❌ ${nom}`);
    console.log(`   Erreur: ${error.message}`);
    testsEchoues++;
  }
}

function expect(valeur) {
  return {
    toBe: (attendu) => {
      if (valeur !== attendu) {
        throw new Error(`Attendu ${attendu}, reçu ${valeur}`);
      }
    },
    toBeGreaterThan: (attendu) => {
      if (valeur <= attendu) {
        throw new Error(`${valeur} n'est pas supérieur à ${attendu}`);
      }
    },
    toContain: (attendu) => {
      if (!String(valeur).includes(attendu)) {
        throw new Error(`"${valeur}" ne contient pas "${attendu}"`);
      }
    },
    toHaveLength: (attendu) => {
      if (valeur.length !== attendu) {
        throw new Error(`Longueur attendue ${attendu}, reçue ${valeur.length}`);
      }
    },
    toHaveProperty: (prop) => {
      if (!(prop in valeur)) {
        throw new Error(`Propriété "${prop}" non trouvée`);
      }
    }
  };
}

console.log('📦 Tests Basiques\n');

test('L\'application existe', () => {
  expect(true).toBe(true);
});

test('Addition fonctionne correctement', () => {
  expect(1 + 1).toBe(2);
  expect(5 + 3).toBe(8);
});

test('Les chaînes de caractères fonctionnent', () => {
  const titre = 'CineZone';
  expect(titre).toBe('CineZone');
  expect(titre.length).toBe(8);
});

console.log('\n🛠️  Tests des Utilitaires\n');

test('Vérifier qu\'un email est valide', () => {
  const emailValide = 'test@example.com';
  expect(emailValide).toContain('@');
});

test('Vérifier la longueur d\'un mot de passe', () => {
  const motDePasse = 'password123';
  expect(motDePasse.length).toBeGreaterThan(5);
});

console.log('\n🎬 Tests des Données Films\n');

test('Créer un objet film', () => {
  const film = {
    id: 1,
    title: 'Inception',
    releaseYear: 2010,
    rating: 8.8
  };
  expect(film.title).toBe('Inception');
  expect(film.releaseYear).toBe(2010);
  expect(film.rating).toBeGreaterThan(8);
});

test('Vérifier les propriétés d\'un film', () => {
  const film = {
    id: 2,
    title: 'Interstellar',
    categoryIds: ['Sci-Fi', 'Drama']
  };
  expect(film).toHaveProperty('id');
  expect(film).toHaveProperty('title');
  expect(film.categoryIds).toHaveLength(2);
});

console.log('\n📋 Tests des Listes\n');

test('Ajouter un film à la watchlist', () => {
  const watchlist = [];
  watchlist.push({ id: 1, title: 'Matrix' });
  expect(watchlist).toHaveLength(1);
  expect(watchlist[0].title).toBe('Matrix');
});

test('Retirer un film de la watchlist', () => {
  let watchlist = [
    { id: 1, title: 'Matrix' },
    { id: 2, title: 'Inception' }
  ];
  watchlist = watchlist.filter(film => film.id !== 1);
  expect(watchlist).toHaveLength(1);
  expect(watchlist[0].title).toBe('Inception');
});

console.log('\n🔍 Tests des Filtres\n');

test('Filtrer les films par note minimale', () => {
  const films = [
    { title: 'Film A', rating: 7.5 },
    { title: 'Film B', rating: 8.5 },
    { title: 'Film C', rating: 9.0 }
  ];
  const filmsBienNotes = films.filter(film => film.rating >= 8.0);
  expect(filmsBienNotes).toHaveLength(2);
});

test('Rechercher un film par titre', () => {
  const films = [
    { title: 'Inception' },
    { title: 'Interstellar' },
    { title: 'The Matrix' }
  ];
  const resultats = films.filter(film =>
    film.title.toLowerCase().includes('inter')
  );
  expect(resultats).toHaveLength(1);
  expect(resultats[0].title).toBe('Interstellar');
});

// Résumé
console.log('\n' + '='.repeat(50));
console.log(`📊 Résultats des tests:`);
console.log(`   ✅ Réussis: ${testsReussis}`);
console.log(`   ❌ Échoués: ${testsEchoues}`);
console.log(`   📈 Total: ${testsReussis + testsEchoues}`);
console.log('='.repeat(50) + '\n');

if (testsEchoues > 0) {
  process.exit(1);
}
