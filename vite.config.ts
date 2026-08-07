import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import {
  injectModeSeoIntoHtml,
  MODE_SEO,
  SEO_SHELL_MODES,
  type SeoMode,
} from './src/seoData'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * After Vite emits dist/index.html, copy mode-specific shells so
 * `/merge`, `/extract`, `/slim` ship unique meta tags for crawlers.
 * Set VITE_SITE_URL (e.g. https://staypress.com) for absolute canonical, og:url,
 * og:image / twitter:image, and a generated sitemap.xml (+ robots Sitemap line).
 */
function modeSeoShells(siteUrl: string | undefined): Plugin {
  return {
    name: 'staypress-mode-seo-shells',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(rootDir, 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) return

      const indexHtml = fs.readFileSync(indexPath, 'utf8')
      const origin = siteUrl?.replace(/\/+$/, '') || undefined

      fs.writeFileSync(
        indexPath,
        injectModeSeoIntoHtml(indexHtml, 'images', origin),
        'utf8',
      )

      for (const mode of SEO_SHELL_MODES) {
        const seo = MODE_SEO[mode]
        const shellHtml = injectModeSeoIntoHtml(indexHtml, mode, origin)
        const dir = path.join(distDir, seo.path.replace(/^\//, ''))
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), shellHtml, 'utf8')
      }

      if (origin) {
        const urls = (Object.keys(MODE_SEO) as SeoMode[]).map((mode) => {
          const p = MODE_SEO[mode].path
          return p === '/' ? `${origin}/` : `${origin}${p}`
        })
        const unique = [...new Set(urls)]
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')}
</urlset>
`
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')

        const robotsPath = path.join(distDir, 'robots.txt')
        if (fs.existsSync(robotsPath)) {
          let robots = fs.readFileSync(robotsPath, 'utf8')
          const sitemapLine = `Sitemap: ${origin}/sitemap.xml`
          if (!/^\s*Sitemap:/m.test(robots)) {
            robots = robots.trimEnd() + `\n\n${sitemapLine}\n`
          } else {
            robots = robots.replace(/^\s*#?\s*Sitemap:.*$/m, sitemapLine)
          }
          fs.writeFileSync(robotsPath, robots, 'utf8')
        }
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const siteUrl = env.VITE_SITE_URL || process.env.VITE_SITE_URL

  return {
    plugins: [react(), modeSeoShells(siteUrl)],
    appType: 'spa',
  }
})
