import { useEffect } from 'react'

interface ContentSEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  schema?: object | object[]
  aiSummary?: string
}

export function ContentSEO({ title, description, canonical, ogImage, schema, aiSummary }: ContentSEOProps) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:locale', 'fr_FR')
    setMeta('property', 'og:site_name', 'Holisource')
    if (ogImage) setMeta('property', 'og:image', ogImage)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    if (canonical) setLink('canonical', canonical)

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema]
      schemas.forEach((s, i) => {
        const id = `page-jsonld-${i}`
        document.getElementById(id)?.remove()
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = id
        script.textContent = JSON.stringify(s)
        document.head.appendChild(script)
      })
    }

    return () => {
      Array.from({ length: 5 }, (_, i) => document.getElementById(`page-jsonld-${i}`)?.remove())
    }
  }, [title, description, canonical, ogImage, schema])

  if (!aiSummary) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
      }}
    >
      {aiSummary}
    </div>
  )
}

function setMeta(attr: string, key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${CSS.escape(key)}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${CSS.escape(rel)}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}
