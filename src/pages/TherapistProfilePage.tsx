import { useParams } from 'react-router-dom'
import './TherapistProfilePage.css'

export default function TherapistProfilePage() {
  const { slug } = useParams()

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <h1>Profil du thérapeute</h1>
        <p>Page en construction</p>
        <p className="slug">Slug: {slug}</p>
      </section>
    </div>
  )
}
