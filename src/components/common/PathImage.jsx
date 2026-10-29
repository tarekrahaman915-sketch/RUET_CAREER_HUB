import { useEffect, useState } from 'react'

const mem = {}

const pick = (j) => j?.thumbnail?.source || j?.originalimage?.source || ''
const big = (src) => src.replace(/\/(\d+)px-/, '/960px-')

// 1) Wikipedia REST summary  2) Wikipedia action API (pageimages)  3) Commons file search
async function fromSummary(title) {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}?redirect=true`)
  if (!r.ok) throw new Error('summary')
  const j = await r.json()
  const src = pick(j)
  if (!src) throw new Error('no image')
  return { src: big(src), page: j.content_urls?.desktop?.page || '' }
}

async function fromPageImages(title) {
  const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=960&titles=${encodeURIComponent(title)}`
  const j = await (await fetch(u)).json()
  const page = Object.values(j?.query?.pages || {})[0]
  if (!page?.thumbnail?.source) throw new Error('no image')
  return { src: page.thumbnail.source, page: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}` }
}

async function fromCommons(title) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=6&gsrsearch=${encodeURIComponent(title + ' filetype:bitmap')}&prop=imageinfo&iiprop=url&iiurlwidth=960`
  const j = await (await fetch(u)).json()
  const pages = Object.values(j?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0))
  const hit = pages.find((p) => /\.(jpe?g|png)$/i.test(p.title || '') && p.imageinfo?.[0]?.thumburl)
  if (!hit) throw new Error('no image')
  return { src: hit.imageinfo[0].thumburl, page: hit.imageinfo[0].descriptionurl || '' }
}

async function resolve(title) {
  for (const fn of [fromSummary, fromPageImages, fromCommons]) {
    try { return await fn(title) } catch { /* try next source */ }
  }
  return null
}

/**
 * Real photo for a career path, taken from Wikipedia / Wikimedia Commons
 * (lead image of the article for `title`, with fallbacks). If nothing loads,
 * a neutral picture placeholder is shown instead of an emoji.
 */
export default function PathImage({ title, local = null, alt = '', height = 150, credit = false, className = '' }) {
  const [img, setImg] = useState(() => (local ? { src: local, page: '' } : mem[title] || null))
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    if (local || !title || mem[title]) return
    try {
      const cached = sessionStorage.getItem(`pimg2:${title}`)
      if (cached) { mem[title] = JSON.parse(cached); setImg(mem[title]); return }
    } catch { /* ignore */ }
    let off = false
    resolve(title).then((data) => {
      if (!data || off) return
      mem[title] = data
      try { sessionStorage.setItem(`pimg2:${title}`, JSON.stringify(data)) } catch { /* ignore */ }
      setImg(data)
    })
    return () => { off = true }
  }, [title, local])

  return (
    <div className={`path-img ${className}`} style={{ height }}>
      {img && !broken ? (
        <img src={img.src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
      ) : (
        <svg className="path-img-fallback" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 16l-5-5-8 9" />
        </svg>
      )}
      {credit && img && !broken && img.page && (
        <a className="path-img-credit" href={img.page} target="_blank" rel="noreferrer">Photo: Wikipedia / Wikimedia Commons</a>
      )}
    </div>
  )
}
