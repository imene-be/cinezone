import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";
import gridMovies from "../assets/images/gridMovies.png";

// FAQ
const faqData = [
  {
    question: "Qu'est-ce que CINEZONE ?",
    answer: "CINEZONE est une plateforme web permettant de consulter un catalogue complet de films, accéder aux fiches détaillées et gérer votre espace membre (watchlist, notes, historique)."
  },
  {
    question: "Quels types de contenus sont disponibles ?",
    answer: "CINEZONE propose un catalogue varié comprenant les films, leurs fiches détaillées, les catégories et les notes attribuées par les utilisateurs."
  },
  {
    question: "Ai-je besoin d'un compte pour utiliser Cinezone ?",
    answer: "La consultation du catalogue est publique. En revanche, la création d'un compte est nécessaire pour gérer votre watchlist, noter des films ou consulter votre historique."
  },
  {
    question: "Puis-je utiliser Cinezone sur tous les appareils ?",
    answer: "Oui. L'interface de Cinezone est entièrement responsive et accessible sur ordinateur, tablette et smartphone."
  },
  {
    question: "Les enfants peuvent-ils utiliser Cinezone ?",
    answer: "Oui, mais Cinezone ne propose pas encore de profil enfant dédié. Une version adaptée pourra être ajoutée en option."
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleGetStarted = () => {
    navigate("/catalog");
  };

  return (
    <div className={`relative w-full min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>

      {/* ---------------- Hero Section ---------------- */}
      <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">

        {/* Image + dégradé */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${gridMovies})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${
            theme === 'dark'
              ? 'via-gray-900/40 to-gray-900'
              : 'via-gray-100/40 to-gray-100'
          }`}></div>
        </div>

        {/* Contenu Hero */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 max-w-7xl mx-auto">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg animate-fadeInUp ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Découvrez des milliers de films
          </h1>

          <p className={`text-xl md:text-2xl mb-8 drop-shadow-md animate-fadeInUp delay-200 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Votre catalogue de films en ligne
          </p>

          <div className="animate-fadeInUp delay-400">
            <Button variant="primary" size="lg" onClick={handleGetStarted}>
              {isAuthenticated ? 'Parcourir le catalogue' : 'Commencer'}
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------- FAQ Section ---------------- */}
      <div className={`py-8 -mt-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Questions fréquentes
          </h2>

          <div className="space-y-3">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl w-full overflow-hidden transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-800/80'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                } ${openIndex === index ? 'ring-1 ring-cyan-400/30' : ''}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className={`text-lg font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.question}
                  </span>

                  <svg
                    className={`w-5 h-5 text-cyan-400 transform transition-transform duration-300 flex-shrink-0 ml-4 ${
                      openIndex === index ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Transition fluide par max-height */}
                <div
                  style={{
                    maxHeight: openIndex === index ? '400px' : '0px',
                    transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
                    overflow: 'hidden',
                  }}
                >
                  <div className={`px-6 pb-5 text-base leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
