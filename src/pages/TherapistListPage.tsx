import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Therapeute } from '../lib/supabase'
import './TherapistListPage.css'

export default function TherapistListPage() {
  const [therapeutes, setTherapistes] = useState<Therapeute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTherapistes()
  }, [])

  async function fetchTherapistes() {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('therapeutes')
        .select('*')
        .eq('statut', 'approved')
        .order('created_at', { ascending: false })

      if (err) throw err
      setTherapistes(data || [])
    } catch (err) {
      console.error('Error fetching therapeutes:', err)
      setError('Erreur lors du chargement des thérapeutes')
    } finally {
      setLoading(false)
    }
  }

  const filtered = therapeutes.filter(t =>
    t.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ville.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="therapist-list-page">
      <section className="list-header">
        <h1>Nos Thérapeutes</h1>
        <p>Trouvez le praticien holistique qui vous convient</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom, spécialité ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="list-content">
        {loading && <div className="loading">Chargement des thérapeutes...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="no-results">Aucun thérapeute trouvé</div>
        )}

        <div className="therapist-grid">
          {filtered.map(therapeute => (
            <Link
              key={therapeute.id}
              to={`/therapeute/${therapeute.slug}`}
              className="therapist-card"
            >
              <div className="card-image">
                {therapeute.photo_url ? (
                  <img src={therapeute.photo_url} alt={`${therapeute.prenom} ${therapeute.nom}`} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="card-content">
                <h3>{therapeute.prenom} {therapeute.nom}</h3>
                <p className="specialite">{therapeute.specialite}</p>
                <p className="location">📍 {therapeute.ville}</p>
                {therapeute.tarif_min && therapeute.tarif_max && (
                  <p className="tarif">💰 {therapeute.tarif_min}€ - {therapeute.tarif_max}€</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
