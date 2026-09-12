import type { APIRoute } from 'astro'
import { canonicalSitemapPaths } from '../seoData'

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.origin ?? 'https://bentotools.app').replace(/\/+$/, '')
  const urls = canonicalSitemapPaths().map((path) =>
    path === '/' ? `${origin}/` : `${origin}${path}`,
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')}
</urlset>
`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
