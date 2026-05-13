import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Therapeute } from '../lib/supabase'
import { ContentSEO } from '../components/ContentSEO'
import './TherapistProfilePage.css'

const MODALITE_LABEL: Record<string, string> = {
  presentiel: 'En cabinet',
  distanciel: 'En ligne',
  les_deux: 'Cabinet & en ligne',
}

export default function TherapistProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const [therapeute, setTherapiste] = useState<Therapeute | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetchTherapiste(slug)
  }, [slug])

  async function fetchTherapiste(slug: string) {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('therapeutes')
        .select('*')
        .eq('slug', slug)
        .eq('statut', 'approved')
        .maybeSingle()

      if (error) throw error
      if (!data) { setNotFound(true); return }
      setTherapiste(data)
    } catch (err) {
      console.error(err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  /* ── SEO data ── */
  function buildSeo(t: Therapeute) {
    const name = `${t.prenom} ${t.nom}`
    const canonical = `https://www.holisource.com/therapeute/${t.slug}`
    const title = t.titre_seo || `${name} — ${t.specialite} à ${t.ville} | Holisource`
    const description = t.meta_description || t.description?.slice(0, 160) ||
      `${name}, praticien(ne) en ${t.specialite} à ${t.ville}. Prise de rendez-vous en ligne sur Holisource.`

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': canonical,
      name,
      description: t.description || description,
      url: canonical,
      image: t.photo_url,
      telephone: t.telephone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: t.ville,
        postalCode: t.code_postal,
        streetAddress: t.adresse,
        addressRegion: 'Alsace',
        addressCountry: 'FR',
      },
      geo: undefined,
      priceRange: t.tarif_min && t.tarif_max ? `${t.tarif_min}€ – ${t.tarif_max}€` : undefined,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Séances de thérapie',
        itemListElement: [{
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: t.specialite },
          priceCurrency: 'EUR',
          price: t.tarif_min,
        }],
      },
      makesOffer: {
        '@type': 'Service',
        name: t.specialite,
        description: t.approche || t.description,
        provider: { '@type': 'Person', name },
        areaServed: { '@type': 'City', name: t.ville },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceLocation: t.modalite !== 'distanciel' ? { '@type': 'Place', name: t.ville } : undefined,
          availableLanguage: { '@type': 'Language', name: 'French' },
        },
      },
      sameAs: t.site_web ? [t.site_web] : [],
      keywords: t.mots_cles?.join(', '),
    }

    const aiSummary = `${name} est un(e) praticien(ne) en ${t.specialite} basé(e) à ${t.ville} (Alsace). ${
      t.description || ''
    } ${t.approche ? `Approche : ${t.approche}` : ''} ${
      t.tarif_min && t.tarif_max ? `Tarifs : de ${t.tarif_min}€ à ${t.tarif_max}€ la séance.` : ''
    } ${t.modalite ? `Modalité : ${MODALITE_LABEL[t.modalite]}.` : ''} Profil vérifié par Holisource.`

    return { title, description, canonical, schema, aiSummary }
  }

  /* ── States ── */
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner" />
          <p>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (notFound || !therapeute) {
    return (
      <div className="profile-page">
        <div className="profile-not-found">
          <h1>Thérapeute introuvable</h1>
          <p>Ce profil n'existe pas ou n'est plus disponible.</p>
          <Link to="/therapeutes" className="btn btn-primary">← Retour à l'annuaire</Link>
        </div>
      </div>
    )
  }

  const seo = buildSeo(therapeute)

  return (
    <div className="profile-page">
      <ContentSEO
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        ogImage={therapeute.photo_url}
        schema={seo.schema}
        aiSummary={seo.aiSummary}
      />

      {/* Breadcrumb */}
      <nav className="profile-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>›</span>
        <Link to="/therapeutes">Thérapeutes</Link>
        <span>›</span>
        <span>{therapeute.prenom} {therapeute.nom}</span>
      </nav>

      {/* Hero */}
      <section className="profile-hero">
        <div className="profile-avatar">
          {therapeute.photo_url ? (
            <img src={therapeute.photo_url} alt={`${therapeute.prenom} ${therapeute.nom}`} />
          ) : (
            <div className="avatar-placeholder">
              {therapeute.prenom[0]}{therapeute.nom[0]}
            </div>
          )}
        </div>
        <div className="profile-hero-info">
          <h1>{therapeute.prenom} {therapeute.nom}</h1>
          <p className="profile-specialite">{therapeute.specialite}</p>
          <div className="profile-tags">
            <span className="tag tag-ville">📍 {therapeute.ville}{therapeute.departement ? ` (${therapeute.departement})` : ''}</span>
            {therapeute.modalite && (
              <span className="tag tag-modalite">🏠 {MODALITE_LABEL[therapeute.modalite]}</span>
            )}
            {therapeute.tarif_min && therapeute.tarif_max && (
              <span className="tag tag-tarif">💶 {therapeute.tarif_min}€ – {therapeute.tarif_max}€</span>
            )}
          </div>
          {therapeute.calendly_url && (
            <a
              href={therapeute.calendly_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-rdv"
            >
              📅 Prendre rendez-vous
            </a>
          )}
        </div>
      </section>

      {/* Description */}
      {therapeute.description && (
        <section className="profile-section">
          <h2>À propos</h2>
          <p className="profile-description">{therapeute.description}</p>
        </section>
      )}

      {/* Approche */}
      {therapeute.approche && (
        <section className="profile-section">
          <h2>Mon approche</h2>
          <p className="profile-approche">{therapeute.approche}</p>
        </section>
      )}

      {/* Infos pratiques */}
      <section className="profile-section">
        <h2>Informations pratiques</h2>
        <ul className="profile-infos">
          <li><strong>Ville :</strong> {therapeute.ville}{therapeute.code_postal ? ` – ${therapeute.code_postal}` : ''}</li>
          {therapeute.modalite && <li><strong>Modalité :</strong> {MODALITE_LABEL[therapeute.modalite]}</li>}
          {therapeute.tarif_min && therapeute.tarif_max && (
            <li><strong>Tarifs :</strong> {therapeute.tarif_min}€ – {therapeute.tarif_max}€ / séance</li>
          )}
          {therapeute.telephone && <li><strong>Téléphone :</strong> {therapeute.telephone}</li>}
          {therapeute.site_web && (
            <li>
              <strong>Site web :</strong>{' '}
              <a href={therapeute.site_web} target="_blank" rel="noopener noreferrer">{therapeute.site_web}</a>
            </li>
          )}
        </ul>
      </section>

      {/* Calendly embed */}
      {therapeute.calendly_url && (
        <section className="profile-section">
          <h2>Réserver une séance</h2>
          <div className="calendly-embed">
            <iframe
              src={`${therapeute.calendly_url}?embed_domain=www.holisource.com&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1`}
              width="100%"
              height="700"
              frameBorder="0"
              title={`Réserver avec ${therapeute.prenom} ${therapeute.nom}`}
              loading="lazy"
            />
          </div>
        </section>
      )}

      <div className="profile-back">
        <Link to="/therapeutes" className="btn btn-secondary">← Retour à l'annuaire</Link>
      </div>
    </div>
  )
}
