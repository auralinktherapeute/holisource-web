const SUPABASE_URL = 'https://dqmujlqxpmcwscztrrdt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXVqbHF4cG1jd3NjenRycmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjM5NzgsImV4cCI6MjA4NDk5OTk3OH0.8RbSZphL-Ee78Ruo1_QE4WJ0tU4tkUl9w6Mk6uq7NKg'
const BASE = 'https://www.holisource.com'

export async function handler() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/therapeutes?statut=eq.approved&select=slug,updated_at,subscription_plan`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    const therapeutes = await res.json()

    const staticPages = [
      { url: BASE, priority: '1.0', changefreq: 'daily' },
      { url: `${BASE}/therapeutes`, priority: '0.9', changefreq: 'hourly' },
      { url: `${BASE}/devenir-therapeute`, priority: '0.7', changefreq: 'monthly' },
    ]

    const profilePages = (Array.isArray(therapeutes) ? therapeutes : []).map(t => ({
      url: `${BASE}/therapeute/${t.slug}`,
      priority: t.subscription_plan === 'premium_plus' ? '0.9' : t.subscription_plan === 'premium' ? '0.8' : '0.6',
      changefreq: 'weekly',
      lastmod: t.updated_at ? t.updated_at.split('T')[0] : undefined,
    }))

    const urls = [...staticPages, ...profilePages]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
      body: xml,
    }
  } catch (err) {
    return { statusCode: 500, body: 'Error generating sitemap' }
  }
}
