import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

const site = (
  process.env.PUBLIC_SITE_URL ||
  process.env.VITE_SITE_URL ||
  'https://bentotools.app'
).replace(/\/+$/, '')

export default defineConfig({
  site,
  trailingSlash: 'never',
  output: 'static',
  integrations: [react()],
})
