import type { Context } from "netlify:edge"

const SUPABASE_URL = 'https://dqmujlqxpmcwscztrrdt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXVqbHF4cG1jd3NjenRycmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjM5NzgsImV4cCI6MjA4NDk5OTk3OH0.8RbSZphL-Ee78Ruo1_QE4WJ0tU4tkUl9w6Mk6uq7NKg'

const CRAWLER_RE = /bot|crawler|spider|GPTBot|ChatGPT|PerplexityBot|ClaudeBot|Googlebot|Bingbot|DuckDuckBot|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|applebot|ia_archiver/i

export default async function handler(request: Request, context: Context) {
  const ua = request.headers.get('user-agent') || ''
  if (!CRAWLER_RE.test(ua)) return context.next()

  const url = new URL(request.url)
  const slug = url.pathname.replace(/^\/therapeute\//, '').split('/')[0]
  if (!slug) return context.next()

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/therapeutes?slug=eq.${encodeURIComponent(slug)}&statut=eq.approved&select=prenom,nom,specialite,ville,description,approche,tarif_min,tarif_max,modalite,photo_url,telephone,adresse,code_postal,site_web,slug,titre_seo,meta_description,mots_cles`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    const data = await res.json()
    const t = Array.isArray(data) ? data[0] : null
    if (!t) return context.next()

    const name = `${t.prenom} ${t.nom}`
    const title = t.titre_seo || `${name} — ${t.specialite} à ${t.ville} | Holisource`
    const desc = t.meta_description || (t.description?.slice(0, 160)) ||
      `${name}, praticien(ne) en ${t.specialite} à ${t.ville}. Prise de rendez-vous en ligne sur Holisource.`
    const canonical = `https://www.holisource.com/therapeute/${t.slug}`
    const modaliteLabel: Record<string, string> = {
      presentiel: 'En cabinet', distanciel: 'En ligne', les_deux: 'Cabinet & en ligne'
    }

    const schema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': canonical,
      name,
      description: t.description || desc,
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
      priceRange: t.tarif_min && t.tarif_max ? `${t.tarif_min}€–${t.tarif_max}€` : undefined,
      makesOffer: {
        '@type': 'Service',
        name: t.specialite,
        description: t.approche || t.description,
        areaServed: { '@type': 'City', name: t.ville },
      },
      sameAs: t.site_web ? [t.site_web] : [],
      keywords: t.mots_cles?.join(', '),
    })

    const aiSummary = `${name} est praticien(ne) en ${t.specialite} à ${t.ville}, Alsace.${
      t.description ? ' ' + t.description : ''
    }${t.approche ? ' Approche : ' + t.approche : ''}${
      t.tarif_min ? ` Tarifs : ${t.tarif_min}€–${t.tarif_max}€.` : ''
    }${t.modalite ? ' ' + (modaliteLabel[t.modalite] || '') + '.' : ''} Profil vérifié sur Holisource.`

    const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(desc)}"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<link rel="canonical" href="${canonical}"/>
<meta property="og:type" content="profile"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${escHtml(title)}"/>
<meta property="og:description" content="${escHtml(desc)}"/>
<meta property="og:site_name" content="Holisource"/>
${t.photo_url ? `<meta property="og:image" content="${escHtml(t.photo_url)}"/>` : ''}
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escHtml(title)}"/>
<meta name="twitter:description" content="${escHtml(desc)}"/>
<script type="application/ld+json">${schema}</script>
</head>
<body>
<main>
<h1>${escHtml(name)}</h1>
<p>${escHtml(t.specialite)} — ${escHtml(t.ville)}</p>
${t.description ? `<p>${escHtml(t.description)}</p>` : ''}
${t.approche ? `<p><strong>Approche :</strong> ${escHtml(t.approche)}</p>` : ''}
${t.tarif_min ? `<p><strong>Tarifs :</strong> ${t.tarif_min}€ – ${t.tarif_max}€</p>` : ''}
<p aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">${escHtml(aiSummary)}</p>
</main>
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
</body>
</html>`

    return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } })
  } catch {
    return context.next()
  }
}

function escHtml(s: string | undefined): string {
  if (!s) return ''
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export const config = { path: '/therapeute/*' }
