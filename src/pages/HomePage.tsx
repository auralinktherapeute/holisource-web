import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
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
