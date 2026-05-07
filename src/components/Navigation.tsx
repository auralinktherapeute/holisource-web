import { Link } from 'react-router-dom'
import './Navigation.css'

interface NavigationProps {
  onOpenUpgrade?: () => void
}

export default function Navigation({ onOpenUpgrade }: NavigationProps) {
  // Affiche le lien admin — en production, ajouter une vérif d'authentification admin
  const isAdmin = true; // TODO: vérifier auth admin depuis Supabase

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Holi<span>Source</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/therapeutes" className="nav-link">Thérapeutes</Link>
          <button onClick={onOpenUpgrade} className="nav-btn premium-btn">
            ✨ Premium
          </button>
          <Link to="/devenir-therapeute" className="nav-btn">Devenir thérapeute</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link" title="Admin">
              🔐
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
