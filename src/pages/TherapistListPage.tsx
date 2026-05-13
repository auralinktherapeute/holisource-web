import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { supabase, type Therapeute } from '../lib/supabase'
import { ContentSEO } from '../components/ContentSEO'
import './TherapistListPage.css'

export default function TherapistListPage() {
  const [therapeutes, setTherapistes] = useState<Therapeute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [searchParams] = useSearchParams()
  const specialiteParam = searchParams.get('specialite') || ''
  const villeParam = searchParams.get('ville') || ''

  useEffect(() => {
    fetchTherapistes()
  }, [])

  useEffect(() => {
    if (specialiteParam) setSearchTerm(specialiteParam)
    else if (villeParam) setSearchTerm(villeParam)
  }, [specialiteParam, villeParam])

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

  function getSeoData() {
    const BASE = 'https://www.holisource.com'

    if (specialiteParam && villeParam) {
      const spec = specialiteParam.charAt(0).toUpperCase() + specialiteParam.slice(1)
      const ville = villeParam.charAt(0).toUpperCase() + villeParam.slice(1)
      return {
        title: `${spec} à ${ville} — Thérapeutes holistiques | Holisource`,
        description: `Trouvez un(e) praticien(ne) en ${spec.toLowerCase()} à ${ville}. Thérapeutes vérifiés, prise de RDV en ligne. Holisource, l'annuaire holistique de référence en Alsace.`,
        canonical: `${BASE}/therapeutes?specialite=${encodeURIComponent(specialiteParam)}&ville=${encodeURIComponent(villeParam)}`,
        schemaType: 'landing',
        aiSummary: `Cette page liste les thérapeutes spécialisés en ${spec.toLowerCase()} disponibles à ${ville} en Alsace. Tous les praticiens sont vérifiés par Holisource. Prise de rendez-vous en ligne disponible.`,
      }
    }

    if (specialiteParam) {
      const spec = specialiteParam.charAt(0).toUpperCase() + specialiteParam.slice(1)
      return {
        title: `${spec} en Alsace — Thérapeutes holistiques | Holisource`,
        description: `Trouvez les meilleurs praticiens en ${spec.toLowerCase()} en Alsace (Strasbourg, Colmar, Mulhouse). Thérapeutes vérifiés, réservation en ligne sur Holisource.`,
        canonical: `${BASE}/therapeutes?specialite=${encodeURIComponent(specialiteParam)}`,
        schemaType: 'landing',
        aiSummary: `Cette page recense tous les thérapeutes spécialisés en ${spec.toLowerCase()} en Alsace. Holisource vérifie chaque praticien avant publication. La réservation de rendez-vous se fait directement en ligne.`,
      }
    }

    if (villeParam) {
      const ville = villeParam.charAt(0).toUpperCase() + villeParam.slice(1)
      return {
        title: `Thérapeutes holistiques à ${ville} — Holisource Alsace`,
        description: `Trouvez un thérapeute holistique à ${ville} : sophrologie, naturopathie, hypnothérapie, reiki et plus. Praticiens vérifiés, prise de RDV en ligne sur Holisource.`,
        canonical: `${BASE}/therapeutes?ville=${encodeURIComponent(villeParam)}`,
        schemaType: 'landing',
        aiSummary: `Cette page liste tous les thérapeutes holistiques disponibles à ${ville} (Alsace). Toutes les spécialités sont représentées : sophrologie, naturopathie, hypnothérapie, reiki, magnétisme et bien d'autres. Réservation en ligne disponible.`,
      }
    }

    return {
      title: 'Tous les thérapeutes holistiques en Alsace | Holisource',
      description: 'Annuaire complet des thérapeutes holistiques en Alsace : sophrologues, naturopathes, hypnothérapeutes, praticiens Reiki, magnétiseurs... Praticiens vérifiés à Strasbourg, Colmar, Mulhouse.',
      canonical: `${BASE}/therapeutes`,
      schemaType: 'directory',
      aiSummary: 'Holisource répertorie tous les thérapeutes holistiques approuvés en Alsace (Bas-Rhin 67 et Haut-Rhin 68). Les spécialités disponibles incluent : sophrologie, naturopathie, hypnothérapie, reiki, magnétisme, ostéopathie holistique, acupuncture, réflexologie, aromathérapie, EFT, coaching holistique, lithothérapie, kinésiologie, shiatsu, méditation, yoga thérapeutique et chromothérapie. Les thérapeutes exercent à Strasbourg, Colmar, Mulhouse, Haguenau, Sélestat et dans toute l\'Alsace.',
    }
  }

  const seo = getSeoData()

  const filtered = therapeutes.filter(t =>
    t.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ville.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="therapist-list-page">
      <ContentSEO
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": seo.canonical,
          "name": seo.title,
          "description": seo.description,
          "url": seo.canonical,
          "isPartOf": { "@id": "https://www.holisource.com/#website" },
          "about": {
            "@type": "Thing",
            "name": "Thérapies holistiques Alsace"
          }
        }}
        aiSummary={seo.aiSummary}
      />
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
