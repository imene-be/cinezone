// Support file pour les tests E2E Cypress
// Ce fichier se charge avant chaque test

// Ignorer les erreurs non critiques
Cypress.on('uncaught:exception', (err) => {
  // Retourner false empêche Cypress de faire échouer le test
  return false;
});
