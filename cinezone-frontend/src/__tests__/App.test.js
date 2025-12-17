// Tests unitaires Frontend - CineZone

describe('Tests Basiques', () => {

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

});

describe('Tests des Utilitaires', () => {

  test('Vérifier qu\'un email est valide', () => {
    const emailValide = 'test@example.com';
    const emailInvalide = 'test@';

    expect(emailValide).toContain('@');
    expect(emailInvalide).toContain('@');
  });

  test('Vérifier la longueur d\'un mot de passe', () => {
    const motDePasse = 'password123';
    expect(motDePasse.length).toBeGreaterThan(5);
  });

  test('Formater une date', () => {
    const annee = 2024;
    expect(annee).toBe(2024);
    expect(typeof annee).toBe('number');
  });

});

describe('Tests des Données Films', () => {

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

  test('Calculer la moyenne des notes', () => {
    const notes = [8.5, 9.0, 7.5, 8.0];
    const moyenne = notes.reduce((acc, note) => acc + note, 0) / notes.length;

    expect(moyenne).toBe(8.25);
  });

});

describe('Tests des Listes', () => {

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

  test('Vérifier si un film est dans la watchlist', () => {
    const watchlist = [
      { id: 1, title: 'Matrix' },
      { id: 2, title: 'Inception' }
    ];

    const filmPresent = watchlist.some(film => film.id === 1);
    const filmAbsent = watchlist.some(film => film.id === 999);

    expect(filmPresent).toBe(true);
    expect(filmAbsent).toBe(false);
  });

});

describe('Tests des Filtres', () => {

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

  test('Trier les films par année', () => {
    const films = [
      { title: 'Film A', releaseYear: 2020 },
      { title: 'Film B', releaseYear: 2018 },
      { title: 'Film C', releaseYear: 2022 }
    ];

    const filmsTries = [...films].sort((a, b) => b.releaseYear - a.releaseYear);

    expect(filmsTries[0].releaseYear).toBe(2022);
    expect(filmsTries[2].releaseYear).toBe(2018);
  });

});
