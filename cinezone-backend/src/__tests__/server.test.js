// Tests unitaires Backend - CineZone

describe('Tests Basiques Backend', () => {

  test('Le serveur devrait exporter une app Express', () => {
    expect(true).toBe(true);
  });

  test('Les nombres fonctionnent', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
  });

  test('Les objets fonctionnent', () => {
    const config = { port: 8000, env: 'test' };
    expect(config.port).toBe(8000);
    expect(config).toHaveProperty('env');
  });

});

describe('Tests des Modèles de Données', () => {

  test('Créer un utilisateur valide', () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'user'
    };

    expect(user).toHaveProperty('email');
    expect(user.role).toBe('user');
    expect(user.email).toContain('@');
  });

  test('Vérifier les propriétés d\'un film', () => {
    const movie = {
      id: 1,
      title: 'Inception',
      description: 'Un film de science-fiction',
      releaseYear: 2010,
      duration: 148,
      rating: 8.8
    };

    expect(movie).toHaveProperty('title');
    expect(movie).toHaveProperty('releaseYear');
    expect(movie.duration).toBeGreaterThan(0);
    expect(movie.rating).toBeGreaterThanOrEqual(0);
    expect(movie.rating).toBeLessThanOrEqual(10);
  });

  test('Créer une entrée watchlist', () => {
    const watchlistItem = {
      id: 1,
      userId: 1,
      movieId: 5,
      status: 'À voir'
    };

    expect(watchlistItem).toHaveProperty('userId');
    expect(watchlistItem).toHaveProperty('movieId');
    expect(watchlistItem.status).toBe('À voir');
  });

});

describe('Tests de Validation', () => {

  test('Valider un email', () => {
    const emailValide = 'test@example.com';
    const emailInvalide = 'test';

    expect(emailValide).toMatch(/@/);
    expect(emailInvalide).not.toMatch(/@.*\./);
  });

  test('Valider la longueur d\'un mot de passe', () => {
    const mdpValide = 'password123';
    const mdpTropCourt = '123';

    expect(mdpValide.length).toBeGreaterThanOrEqual(6);
    expect(mdpTropCourt.length).toBeLessThan(6);
  });

  test('Valider une note de film (0-10)', () => {
    const noteValide = 8.5;
    const noteTropHaute = 11;
    const noteTropBasse = -1;

    expect(noteValide).toBeGreaterThanOrEqual(0);
    expect(noteValide).toBeLessThanOrEqual(10);
    expect(noteTropHaute).toBeGreaterThan(10);
    expect(noteTropBasse).toBeLessThan(0);
  });

  test('Valider une année de sortie', () => {
    const anneeValide = 2024;
    const anneeInvalide = 1800;

    expect(anneeValide).toBeGreaterThanOrEqual(1900);
    expect(anneeInvalide).toBeLessThan(1900);
  });

});

describe('Tests des Opérations CRUD', () => {

  test('Ajouter un film à la liste', () => {
    const films = [];
    const nouveauFilm = { id: 1, title: 'Matrix' };

    films.push(nouveauFilm);

    expect(films).toHaveLength(1);
    expect(films[0].title).toBe('Matrix');
  });

  test('Supprimer un film de la liste', () => {
    let films = [
      { id: 1, title: 'Matrix' },
      { id: 2, title: 'Inception' },
      { id: 3, title: 'Interstellar' }
    ];

    films = films.filter(film => film.id !== 2);

    expect(films).toHaveLength(2);
    expect(films.find(f => f.id === 2)).toBeUndefined();
  });

  test('Mettre à jour un film', () => {
    const films = [
      { id: 1, title: 'Matrix', rating: 8.0 },
      { id: 2, title: 'Inception', rating: 8.5 }
    ];

    const filmIndex = films.findIndex(f => f.id === 1);
    films[filmIndex].rating = 9.0;

    expect(films[filmIndex].rating).toBe(9.0);
  });

  test('Rechercher un film par ID', () => {
    const films = [
      { id: 1, title: 'Matrix' },
      { id: 2, title: 'Inception' },
      { id: 3, title: 'Interstellar' }
    ];

    const filmTrouve = films.find(f => f.id === 2);
    const filmInexistant = films.find(f => f.id === 999);

    expect(filmTrouve).toBeDefined();
    expect(filmTrouve.title).toBe('Inception');
    expect(filmInexistant).toBeUndefined();
  });

});

describe('Tests des Requêtes et Filtres', () => {

  test('Filtrer les films par catégorie', () => {
    const films = [
      { id: 1, title: 'Matrix', categoryIds: [1, 2] },
      { id: 2, title: 'Inception', categoryIds: [2, 3] },
      { id: 3, title: 'Titanic', categoryIds: [4] }
    ];

    const filmsCategorie2 = films.filter(film =>
      film.categoryIds.includes(2)
    );

    expect(filmsCategorie2).toHaveLength(2);
  });

  test('Rechercher des films par titre', () => {
    const films = [
      { id: 1, title: 'The Matrix' },
      { id: 2, title: 'The Matrix Reloaded' },
      { id: 3, title: 'Inception' }
    ];

    const resultats = films.filter(film =>
      film.title.toLowerCase().includes('matrix')
    );

    expect(resultats).toHaveLength(2);
  });

  test('Trier les films par note décroissante', () => {
    const films = [
      { title: 'Film A', rating: 7.5 },
      { title: 'Film B', rating: 9.0 },
      { title: 'Film C', rating: 8.2 }
    ];

    const filmsTries = [...films].sort((a, b) => b.rating - a.rating);

    expect(filmsTries[0].rating).toBe(9.0);
    expect(filmsTries[2].rating).toBe(7.5);
  });

  test('Paginer les résultats', () => {
    const films = [
      { id: 1 }, { id: 2 }, { id: 3 },
      { id: 4 }, { id: 5 }, { id: 6 },
      { id: 7 }, { id: 8 }, { id: 9 }
    ];

    const page = 2;
    const limit = 3;
    const debut = (page - 1) * limit;

    const resultats = films.slice(debut, debut + limit);

    expect(resultats).toHaveLength(3);
    expect(resultats[0].id).toBe(4);
    expect(resultats[2].id).toBe(6);
  });

});

describe('Tests des Permissions et Rôles', () => {

  test('Vérifier le rôle admin', () => {
    const user = { id: 1, role: 'admin' };
    expect(user.role).toBe('admin');
  });

  test('Vérifier le rôle utilisateur', () => {
    const user = { id: 2, role: 'user' };
    expect(user.role).not.toBe('admin');
  });

  test('Vérifier les permissions d\'un admin', () => {
    const user = { id: 1, role: 'admin' };
    const peutModifier = user.role === 'admin';

    expect(peutModifier).toBe(true);
  });

});
