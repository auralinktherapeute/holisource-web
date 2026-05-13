import { Link } from 'react-router-dom'
import { ContentSEO } from '../components/ContentSEO'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <ContentSEO
        title="Holisource — Thérapeutes holistiques en Alsace | Strasbourg, Colmar, Mulhouse"
        description="Trouvez votre thérapeute holistique en Alsace : magnétiseur, naturopathe, hypnothérapeute, sophrologue, praticien Reiki. Praticiens vérifiés à Strasbourg, Colmar, Mulhouse. Réservation en ligne."
        canonical="https://www.holisource.com"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://www.holisource.com/#website",
            "name": "Holisource",
            "url": "https://www.holisource.com",
            "description": "Annuaire de thérapeutes holistiques en Alsace — mise en relation patients et praticiens vérifiés",
            "inLanguage": "fr-FR",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.holisource.com/therapeutes?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://www.holisource.com/#organization",
            "name": "Holisource",
            "url": "https://www.holisource.com",
            "description": "Annuaire de thérapeutes holistiques en Alsace — mise en relation patients et praticiens qualifiés",
            "areaServed": [
              { "@type": "State", "name": "Alsace", "containsPlace": [
                { "@type": "City", "name": "Strasbourg" },
                { "@type": "City", "name": "Colmar" },
                { "@type": "City", "name": "Mulhouse" },
                { "@type": "City", "name": "Haguenau" },
                { "@type": "City", "name": "Sélestat" }
              ]}
            ],
            "knowsAbout": [
              "Sophrologie", "Naturopathie", "Hypnothérapie", "Reiki", "Magnétisme",
              "Ostéopathie holistique", "Acupuncture", "Réflexologie", "Aromathérapie",
              "Méditation", "Yoga thérapeutique", "Thérapies holistiques", "Bien-être Alsace",
              "EFT", "Coaching holistique", "Lithothérapie", "Kinésiologie holistique", "Shiatsu"
            ]
          }
        ]}
        aiSummary="Holisource est l'annuaire de référence pour trouver un thérapeute holistique en Alsace (Bas-Rhin 67 et Haut-Rhin 68). La plateforme met en relation des patients avec des praticiens vérifiés spécialisés en sophrologie, naturopathie, hypnothérapie, reiki, magnétisme, ostéopathie holistique, acupuncture, réflexologie, aromathérapie et autres thérapies alternatives. Les thérapeutes sont disponibles à Strasbourg, Colmar, Mulhouse, Haguenau et Sélestat, en présentiel, en ligne, ou les deux. La réservation de rendez-vous se fait directement en ligne via Calendly intégré."
      />
      <section className="hero">
        <div className="hero-content">
          <h1>
            Trouvez votre <span>thérapeute</span> en Alsace
          </h1>
          <p className="hero-subtitle">
            Magnétiseurs, naturopathes, praticiens holistiques qualifiés à Strasbourg, Colmar et Mulhouse
          </p>
          <div className="hero-buttons">
            <Link to="/therapeutes" className="btn btn-primary">
              Voir les thérapeutes
            </Link>
            <Link to="/devenir-therapeute" className="btn btn-secondary">
              Devenir thérapeute
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🧘</div>
          <h3>Spécialistes vérifiés</h3>
          <p>Tous les praticiens sont sélectionnés et modérés</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📍</div>
          <h3>Localisés en Alsace</h3>
          <p>Présentiels, en ligne ou les deux modalités</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📅</div>
          <h3>RDV faciles</h3>
          <p>Réservation directe avec Calendly intégré</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Prêt à commencer votre voyage bien-être?</h2>
        <Link to="/therapeutes" className="btn btn-primary btn-large">
          Explorez nos thérapeutes
        </Link>
      </section>
    </div>
  )
}
