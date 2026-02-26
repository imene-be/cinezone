import { useTheme } from '../context/ThemeContext';

const Section = ({ number, title, children, theme }) => (
  <div className={`rounded-2xl border p-8 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-start gap-4 mb-4">
      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md shrink-0 mt-0.5">
        {String(number).padStart(2, '0')}
      </span>
      <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
    </div>
    <div className={`ml-12 space-y-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
      {children}
    </div>
  </div>
);

const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md">
    ▸ {children}
  </span>
);

const Check = ({ children, theme }) => (
  <div className={`flex items-start gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
    <span className="text-cyan-400 shrink-0 mt-0.5">✓</span>
    <span>{children}</span>
  </div>
);

const MentionsLegales = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            Transparence & légalité
          </p>
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Mentions légales
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            cinezone — projet scolaire
          </p>
        </div>

        <div className="space-y-6">

          {/* 01 — Qui a fait ce site ? */}
          <Section number={1} title="Qui a fait ce site ?" theme={theme}>
            <p>
              C'est moi,{' '}
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Imène Bentifraouine
              </span>
              , étudiante en Mastère Stratégie Digitale, Manager de projets informatiques (RNCP38905).
              J'ai développé CineZone dans le cadre de ma formation, sans aucune vocation commerciale.
            </p>
            <p>
              CineZone est une application web de catalogue de films et séries, conçue pour explorer
              des œuvres cinématographiques, gérer une liste de lecture personnelle et suivre son
              historique de visionnage.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Tag>Projet scolaire</Tag>
              <Tag>Sans activité commerciale</Tag>
              <Tag>Mastère Stratégie Digitale</Tag>
            </div>
            <div className={`mt-4 pt-4 border-t space-y-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <p>✉ <a href="mailto:bentifraouineimene@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition">bentifraouineimene@gmail.com</a></p>
            </div>
          </Section>

          {/* 02 — Hébergement */}
          <Section number={2} title="Hébergement" theme={theme}>
            <p>
              Ce projet est hébergé localement ou déployé via des plateformes de déploiement
              modernes adaptées aux projets web (Vercel, Render ou équivalent).
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Les informations précises d'hébergement peuvent varier selon l'environnement de déploiement
              retenu pour la présentation du projet.
            </p>
          </Section>

          {/* 03 — Propriété intellectuelle */}
          <Section number={3} title="Propriété intellectuelle" theme={theme}>
            <p>
              Le code source, le design et les contenus originaux de CineZone sont ma propriété
              intellectuelle, réalisés dans un cadre pédagogique.
            </p>
            <p>
              Les affiches, titres et informations relatives aux films et séries sont utilisés
              à titre illustratif et pédagogique uniquement, sans exploitation commerciale.
              Tous les droits sur ces œuvres appartiennent à leurs ayants droit respectifs.
            </p>
            <p>
              Toute reproduction ou exploitation du code ou des visuels produits pour ce projet,
              sans autorisation explicite, est interdite.
            </p>
          </Section>

          {/* 04 — Données personnelles & RGPD */}
          <Section number={4} title="Données personnelles & RGPD" theme={theme}>
            <p>
              Dans le cadre de l'utilisation de CineZone, les données suivantes peuvent être collectées
              lors de la création d'un compte :
            </p>
            <ul className="list-none space-y-1 pl-2">
              {['Nom d\'utilisateur', 'Adresse e-mail', 'Mot de passe (chiffré)', 'Historique de visionnage', 'Liste de films sauvegardés'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Ces données sont stockées uniquement pour le fonctionnement de l'application dans
              le cadre du projet scolaire. Elles ne sont ni revendues ni transmises à des tiers.
            </p>
            <p>
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              Pour toute demande :{' '}
              <a href="mailto:bentifraouineimene@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition">
                bentifraouineimene@gmail.com
              </a>
            </p>
          </Section>

          {/* 05 — Cookies */}
          <Section number={5} title="Cookies" theme={theme}>
            <p>CineZone n'utilise pas de cookies à des fins publicitaires ou de tracking.</p>
            <div className="space-y-2 pt-1">
              <Check theme={theme}>Aucun cookie publicitaire déposé.</Check>
              <Check theme={theme}>Aucun cookie de tracking tiers.</Check>
              <Check theme={theme}>Des données de session peuvent être stockées en localStorage pour maintenir la connexion utilisateur.</Check>
            </div>
          </Section>

          {/* 06 — Cadre légal */}
          <Section number={6} title="Cadre légal" theme={theme}>
            <p>
              La loi LCEN du 21 juin 2004 impose à tout éditeur de site web d'afficher des mentions
              légales. Cette page existe pour s'y conformer, même dans le cadre d'un projet scolaire.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { label: 'RGPD', desc: 'Données collectées dans le formulaire d\'inscription encadrées par le règlement européen. Droit d\'accès, rectification et suppression sur demande.' },
                { label: 'Mentions légales obligatoires', desc: 'Tout site en ligne doit identifier son éditeur. Ce projet est conforme à cette obligation.' },
                { label: 'Cookies', desc: 'Aucun cookie de tracking utilisé. Voir section 05.' },
              ].map(({ label, desc }) => (
                <div key={label} className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white border border-gray-200'}`}>
                  <p className={`font-semibold text-xs mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>▶ {label}</p>
                  <p className="text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 07 — Responsabilité */}
          <Section number={7} title="Responsabilité" theme={theme}>
            <p>
              CineZone est un projet étudiant. Les contenus présentés le sont à titre illustratif
              et pédagogique. Je ne peux pas être tenue responsable d'une utilisation
              du contenu en dehors de ce cadre.
            </p>
            <p>
              Si quelque chose vous pose problème, écrivez-moi directement à{' '}
              <a href="mailto:bentifraouineimene@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition">
                bentifraouineimene@gmail.com
              </a>
            </p>
          </Section>

        </div>

        {/* Footer de la page */}
        <div className={`mt-12 pt-8 border-t text-center text-sm ${theme === 'dark' ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p>Réalisé par <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Imène Bentifraouine</span> — projet scolaire non commercial.</p>
          <p className="mt-1">© 2025 Bentifraouine Imène — Tous droits réservés</p>
          <p className="mt-1 text-xs">Dernière mise à jour : 22 février 2026</p>
        </div>

      </div>
    </div>
  );
};

export default MentionsLegales;
